import React, { useState } from "react";
import CodeRunner from "./CppRunner";
import Algorithm from "./Algorithm";

const cppTemplate = `#include<iostream>
using namespace std;

int main() {
  int x;
  cin >> x;
  cout << "You entered: " << x << endl;
  return 0;
}`;

export default function App() {
  const [files, setFiles] = useState([
    {
      id: 1,
      name: "main.cpp",
      language: "cpp",
      code: cppTemplate,
      input: "",
      output: "Output will appear here...",
      algorithm: ""
    }
  ]);

  const [activeFileId, setActiveFileId] = useState(1);

  const activeFile = files.find(f => f.id === activeFileId);

  const updateFile = (id, updates) => {
    setFiles(prev =>
      prev.map(file =>
        file.id === id ? { ...file, ...updates } : file
      )
    );
  };

  const addNewFile = () => {
    const name = prompt("Enter file name (e.g., myfile.cpp):");
    if (!name) return;

    const newId = Date.now();
    setFiles(prev => [
      ...prev,
      {
        id: newId,
        name: name,
        language: "cpp",
        code: cppTemplate,
        input: "",
        output: "Output will appear here...",
        algorithm: ""
      }
    ]);
    setActiveFileId(newId);
  };

  return (
    <div className="w-full h-screen flex">
      {/* Sidebar */}
      <div className="w-56 bg-gray-200 p-2 flex flex-col">
        <h2 className="text-lg font-bold mb-2">Files</h2>
        <div className="flex-1 overflow-y-auto">
          {files.map(file => (
            <div
              key={file.id}
              onClick={() => setActiveFileId(file.id)}
              className={`px-3 py-2 cursor-pointer rounded ${
                activeFileId === file.id
                  ? "bg-white font-semibold"
                  : "hover:bg-gray-300"
              }`}
            >
              {file.name}
            </div>
          ))}
        </div>
        <button
          onClick={addNewFile}
          className="mt-2 px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          + New File
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex gap-4 p-4 bg-white border-l">
        {activeFile && (
          <>
            <div className="flex-1 border p-2">
              <CodeRunner
                language={activeFile.language}
                setLanguage={lang => updateFile(activeFile.id, { language: lang })}
                code={activeFile.code}
                setCode={c => updateFile(activeFile.id, { code: c })}
                input={activeFile.input}
                setInput={inp => updateFile(activeFile.id, { input: inp })}
                output={activeFile.output}
                setOutput={out => updateFile(activeFile.id, { output: out })}
              />
            </div>
            <div className="flex-1 border p-2">
              <Algorithm
                algorithm={activeFile.algorithm}
                setAlgorithm={algo => updateFile(activeFile.id, { algorithm: algo })}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
