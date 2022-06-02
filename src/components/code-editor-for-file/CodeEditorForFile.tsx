import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
//@ts-ignore
import { constrainedEditor } from "constrained-editor-plugin";
import "./CodeEditorForFile.css";
import { CodeFile, File } from "../../types/File";

type Props = {
  constrained?: boolean;
  file: CodeFile;
  addRef: (ref: any, constrainedInstance: any) => void;
};

const CodeEditorForFile = ({ constrained = true, file, addRef }: Props) => {
  const onEditorMount = (editor: any, monaco: any) => {
    const constrainedInstance = constrainedEditor(monaco);
    const model = editor.getModel();

    addRef(editor, constrainedInstance);
  };

  return (
    <div className="code-section">
      <Editor
        onMount={onEditorMount}
        path={file?.name}
        defaultLanguage={file?.language}
        defaultValue={file?.source}
        options={{ scrollBeyondLastLine: false }}
      />
    </div>
  );
};

export default CodeEditorForFile;
