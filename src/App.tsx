import React from "react";
import "./App.css";
import CodeEditorWrapper from "./components/code-editor-for-file/CodeEditorWrapper";
import files from "./components/code-editor/files";

function App() {
  return (
    <div className="App">
      <div className="header">HEADER</div>
      <div className="content">
        {/* <CodeEditor /> */}
        <CodeEditorWrapper files={files} filesLoading={false} modelName="test" />
      </div>
      <div className="bottom">bottom</div>
    </div>
  );
}

export default App;
