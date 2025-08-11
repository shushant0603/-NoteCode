import { useState, useRef } from "react";
import Editor from "@monaco-editor/react";
import { updateFile } from "./api/fileApi"; // Adjust path accordingly

export default function Algorithm({ fileId, algorithm, setAlgorithm }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editorWidth, setEditorWidth] = useState("100%");
  const originalWidth = useRef(null);

  console.log("Algorithm component rendered with:", { fileId, algorithm });

  const handleToggleWidth = () => {
    if (!isExpanded) {
      if (!originalWidth.current) {
        originalWidth.current = editorWidth;
      }
      setEditorWidth(`${window.innerWidth}px`);
    } else {
      setEditorWidth(originalWidth.current);
    }
    setIsExpanded(!isExpanded);
  };

  const handleAlgoChange = async (value) => {
    setAlgorithm(value);
    if (fileId) {
      try {
        await updateFile(fileId, { algo: value });
      } catch (err) {
        console.error("Failed to update algorithm", err);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-2">Algorithm</h2>

      <div
        style={{ width: editorWidth, flex: 1, border: "1px solid #ccc", borderRadius: 6 }}
      >
        <Editor
          height="100%"
          language="plaintext"
          value={algorithm}
          onChange={handleAlgoChange}
          options={{
            minimap: { enabled: true },
            folding: true,
            lineNumbers: "on",
            wordWrap: "on",
            fontSize: 14,
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>

      <div className="mt-2 flex gap-2 justify-end">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={handleToggleWidth}
        >
          {isExpanded ? "Reset Width" : "Expand to Screen Size"}
        </button>
      </div>
    </div>
  );
}
