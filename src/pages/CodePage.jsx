import React, { useState, useRef, useEffect } from "react";
import CodeRunner from "../CppRunner";
import Algorithm from "../Algorithm";
import { createFile, getFilesByUser, deleteFile as deleteFileApi, updateFile } from "../api/fileApi";

const cppTemplate = `#include<iostream>
using namespace std;

int main() {
  int x;
  cin >> x;
  cout << "You entered: " << x << endl;
  return 0;
}`;

// Function to get fresh, empty content for new files
const getFreshContent = (language) => {
  if (language === "cpp") {
    return `#include<iostream>
using namespace std;

int main() {
  // Your C++ code here
  
  return 0;
}`;
  } else if (language === "java") {
    return `public class Main {
  public static void main(String[] args) {
    // Your Java code here
    
  }
}`;
  }
  return "";
};

export default function CodePage({ user }) {
  const [files, setFiles] = useState([
    {
      _id: 'default-file',
      name: 'main.cpp',
      language: "cpp",
      code: cppTemplate,
      algo: "",
      input: "",
      output: "Output will appear here..."
    }
  ]);
  const [activeFileId, setActiveFileId] = useState('default-file');



  // Width % for code panel
  const [leftWidth, setLeftWidth] = useState(50);

  // Ref only for container div to get dimensions
  const containerRef = useRef(null);

  // Ref to track dragging state - you need to keep this because it's used to control drag
  const dragging = useRef(false);

  // Load user's files on component mount
  useEffect(() => {
    if (user) {
      loadUserFiles();
    }
  }, [user]);

  const loadUserFiles = async () => {
    try {
      const userFiles = await getFilesByUser(user.id);
      
      if (userFiles && userFiles.length > 0) {
        // Check if main.cpp already exists
        const mainCppExists = userFiles.find(file => file.name === 'main.cpp');
        if (mainCppExists) {
          setFiles(userFiles);
          setActiveFileId(mainCppExists._id);
        } else {
          // Create main.cpp since it doesn't exist
          try {
            const defaultFileData = {
              name: 'main.cpp',
              language: 'cpp',
              code: cppTemplate,
              algo: '',
              input: '',
              output: 'Output will appear here...'
            };
            
            const savedDefaultFile = await createFile(defaultFileData);
            
            // Add to existing files
            const updatedFiles = [...userFiles, savedDefaultFile];
            setFiles(updatedFiles);
            setActiveFileId(savedDefaultFile._id);
          } catch (createError) {
            console.error("Failed to create main.cpp:", createError);
            setFiles(userFiles);
            setActiveFileId(userFiles[0]._id);
          }
        }
      } else {
        // Create main.cpp since no files exist
        try {
          const defaultFileData = {
            name: 'main.cpp',
            language: 'cpp',
            code: cppTemplate,
            algo: '',
            input: '',
            output: 'Output will appear here...'
          };
          
          const savedDefaultFile = await createFile(defaultFileData);
          
          setFiles([savedDefaultFile]);
          setActiveFileId(savedDefaultFile._id);
        } catch (createError) {
          console.error("Failed to create main.cpp:", createError);
          // Keep the local default file if database creation fails
        }
      }
    } catch (error) {
      console.error("Failed to load files:", error);
      // Keep the local default file if error
    }
  };

  // Drag handlers
  const onMouseMove = (e) => {
    if (!dragging.current || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    let newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;
    if (newLeftWidth < 20) newLeftWidth = 20;
    if (newLeftWidth > 80) newLeftWidth = 80;

    setLeftWidth(newLeftWidth);
  };

  const onMouseUp = () => {
    dragging.current = false;
    document.body.style.userSelect = "auto";
  };

  const onMouseDown = () => {
    dragging.current = true;
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const activeFile = files.find((f) => f._id === activeFileId);

  const updateFileInState = (id, updates) => {
    setFiles((prev) =>
      prev.map((file) => (file._id === id ? { ...file, ...updates } : file))
    );
  };

  const deleteFile = async (fileId) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      // First delete from backend
      await deleteFileApi(fileId);
      
      // Then remove from state
      const updatedFiles = files.filter(file => file._id !== fileId);
      setFiles(updatedFiles);
      
      // If deleted file was active, switch to first available file
      if (activeFileId === fileId) {
        if (updatedFiles.length > 0) {
          setActiveFileId(updatedFiles[0]._id);
        } else {
          // If no files left, create a new default file
          const defaultFileData = {
            name: 'main.cpp',
            language: 'cpp',
            code: cppTemplate,
            algo: '',
            input: '',
            output: 'Output will appear here...'
          };
          
          try {
            const savedDefaultFile = await createFile(defaultFileData);
            setFiles([savedDefaultFile]);
            setActiveFileId(savedDefaultFile._id);
          } catch (error) {
            console.error("Failed to create default file after deletion:", error);
          }
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Failed to delete file. Please try again.");
    }
  };

  const renameFile = async (file) => {
    const newName = prompt("Enter new file name:", file.name);
    if (!newName || newName.trim() === '') return;
    
    const trimmedName = newName.trim();
    
    // Check if name already exists
    const nameExists = files.find(f => f._id !== file._id && f.name === trimmedName);
    if (nameExists) {
      alert("A file with this name already exists. Please choose a different name.");
      return;
    }
    
    try {
      // First update in backend
      await updateFile(file._id, { name: trimmedName });
      
      // Then update in state
      updateFileInState(file._id, { name: trimmedName });
    } catch (error) {
      console.error("Error renaming file:", error);
      alert("Failed to rename file. Please try again.");
    }
  };

  const addNewFile = async () => {
    // First test if backend is accessible
    try {
      const testResponse = await fetch('https://note-code-backend.onrender.com/');
      if (!testResponse.ok) {
        alert("Backend server is not running. Please start the backend server first.");
        return;
      }
    } catch {
      alert("Backend server is not running. Please start the backend server first.");
      return;
    }

    // Check if user is authenticated
    const token = localStorage.getItem("NoteCode");
    if (!token) {
      alert("You are not logged in. Please log in again.");
      return;
    }

    const name = prompt("Enter file name (e.g., myfile.cpp):");
    if (!name) return;

    // Ask for language preference
    const language = prompt("Choose language (cpp/java):", "cpp");
    if (!language || (language !== "cpp" && language !== "java")) {
      alert("Please choose either 'cpp' or 'java'");
      return;
    }

    console.log("Creating new file with name:", name, "and language:", language);

    try {
      const newFileData = {
        name: name, // Use the provided name
        language: language,
        code: getFreshContent(language), // Fresh, empty code for selected language
        algo: "", // Empty algorithm
        input: "",
        output: "Output will appear here..."
      };
      
      console.log("Sending file data to backend:", newFileData);
      const newFile = await createFile(newFileData);
      console.log("Backend response:", newFile);
      
      setFiles((prev) => [...prev, newFile]);
      setActiveFileId(newFile._id);
      console.log("File added successfully to state");
    } catch (error) {
      console.error("Failed to create new file:", error);
      console.log("Creating local file as fallback");
      
      // Create a local file if backend fails
      const localFile = {
        _id: 'local-' + Date.now(),
        name: name, // Use the provided name
        language: language,
        code: getFreshContent(language), // Fresh, empty code for selected language
        algo: "", // Empty algorithm
        input: "",
        output: "Output will appear here..."
      };
      setFiles((prev) => [...prev, localFile]);
      setActiveFileId(localFile._id);
      console.log("Local file created:", localFile);
    }
  };

  if (!user) {
    return <div className="flex items-center justify-center h-screen">Please log in to access files.</div>;
  }

  return (
    <div
      className="w-full h-screen flex"
      ref={containerRef}
      style={{ userSelect: dragging.current ? "none" : "auto" }}
    >
      {/* Sidebar */}
      <div className="w-56 bg-gray-200 p-2 flex flex-col">
        <h2 className="text-lg font-bold mb-2">Files</h2>
        <div className="flex-1 overflow-y-auto">
          {files.map((file) => (
            <div
              key={file._id}
              className={`px-3 py-2 rounded ${
                activeFileId === file._id
                  ? "bg-white font-semibold"
                  : "hover:bg-gray-300"
              }`}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setActiveFileId(file._id)}
                >
                  {file.name || (file.language === "cpp" ? "main.cpp" : "Main.java")}
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      renameFile(file);
                    }}
                    className="text-xs px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    title="Rename file"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(file._id);
                    }}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    title="Delete file"
                  >
                    🗑️
                  </button>
                </div>
              </div>
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

      {/* Left pane - Code Runner */}
      <div
        className="border p-2 flex flex-col"
        style={{
          width: `${leftWidth}%`,
          transition: dragging.current ? "none" : "width 0.2s ease",
        }}
      >
        {activeFile && (
          <CodeRunner
            key={activeFile._id}
            fileId={activeFile._id}
            language={activeFile.language}
            setLanguage={(lang) => updateFileInState(activeFile._id, { language: lang })}
            code={activeFile.code}
            setCode={(c) => updateFileInState(activeFile._id, { code: c })}
            input={activeFile.input}
            setInput={(inp) => updateFileInState(activeFile._id, { input: inp })}
            output={activeFile.output}
            setOutput={(out) => updateFileInState(activeFile._id, { output: out })}
          />
        )}
      </div>

      {/* Divider */}
      <div
        onMouseDown={onMouseDown}
        className="bg-gray-400 cursor-col-resize"
        style={{ width: "5px" }}
      />

      {/* Right pane - Algorithm */}
      <div
        className="border p-2 flex flex-col"
        style={{
          width: `${100 - leftWidth}%`,
          transition: dragging.current ? "none" : "width 0.2s ease",
        }}
      >
        {activeFile && (
          <Algorithm
            key={activeFile._id}
            fileId={activeFile._id}
            algorithm={activeFile.algo}
            setAlgorithm={(algo) => updateFileInState(activeFile._id, { algo: algo })}
          />
        )}
      </div>
    </div>
  );
}
