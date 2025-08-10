import axios from "axios";

export default function CodeRunner({
  language,
  setLanguage,
  code,
  setCode,
  input,
  setInput,
  output,
  setOutput
}) {
  const cppTemplate = `#include<iostream>
using namespace std;

int main() {
  int x;
  cin >> x;
  cout << "You entered: " << x << endl;
  return 0;
}`;

  const javaTemplate = `public class Main {
  public static void main(String[] args) {
    java.util.Scanner sc = new java.util.Scanner(System.in);
    int x = sc.nextInt();
    System.out.println("You entered: " + x);
  }
}`;

  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang);
    setOutput("Output will appear here...");
    setCode(selectedLang === "cpp" ? cppTemplate : javaTemplate);
  };

  const runCode = async () => {
    setOutput("Running...");

    const version = language === "cpp" ? "10.2.0" : "15.0.2";
    const fileName = language === "cpp" ? "main.cpp" : "Main.java";

    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language,
        version,
        files: [{ name: fileName, content: code }],
        stdin: input,
      });

      const result = response.data;

      if (result.run.stderr) {
        setOutput(`Error:\n${result.run.stderr}`);
      } else {
        setOutput(result.run.output);
      }
    } catch (err) {
      console.error(err);
      setOutput("Failed to run code.");
    }
  };

  return (
    <div className="p-2 h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Code Runner</h2>

      <label className="mb-1 font-medium">Select Language:</label>
      <select
        className="mb-2 border border-gray-300 rounded p-1"
        value={language}
        onChange={handleLanguageChange}
      >
        <option value="cpp">C++</option>
        <option value="java">Java</option>
      </select>

      <textarea
        className="flex-1 w-full p-2 text-sm font-mono border border-gray-300 rounded resize-none"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />

      <label className="mt-2 mb-1 font-medium">Standard Input:</label>
      <textarea
        className="h-16 p-2 text-sm font-mono border border-gray-300 rounded"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        className="mt-2 px-4 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
        onClick={runCode}
      >
        Run Code
      </button>

      <div className="mt-2">
        <h3 className="font-semibold mb-1">Output:</h3>
        <pre className="w-full p-2 bg-gray-100 border border-gray-300 rounded whitespace-pre-wrap max-h-40 overflow-auto">
          {output}
        </pre>
      </div>
    </div>
  );
}
