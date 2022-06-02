import { Button, CircularProgress, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { CodeFile } from "../../types/File";
import { Restriction } from "../../types/Restriction";
import "./CodeEditorWrapper.css";
import CodeEditorForFile from "./CodeEditorForFile";

type Props = {
  highlight?: boolean;
  constrained?: boolean;
  files: { [key: string]: CodeFile };
  filesLoading: boolean;
  modelName: string;
};

const CodeEditorWrapper = ({ highlight = true, constrained = true, files, filesLoading, modelName }: Props) => {
  const [file, setFile] = useState<CodeFile>(Object.values(files)[0]);
  const [reseting, setReseting] = useState(false);

  const [saveCodeForRender, setSaveCodeForRender] = useState({
    status: "",
    message: "",
  });

  const refs = useRef<{ editor?: any; constrainedInstance?: any }>({
    editor: undefined,
    constrainedInstance: undefined,
  });
  const deltaDecorationsRef = useRef<string[]>([]);

  const getFile = () => {
    const code: string = refs.current.editor.getValue();

    const codeFile: CodeFile = {
      name: file.name,
      language: file.language,
      source: code,
    };

    if (constrained && file.constrains) {
      const model = refs.current.editor.getModel();
      const ranges = Object.values(model.getCurrentEditableRanges());
      const constrains: Restriction[] = ranges.map((rangeObj: any, idx) => ({
        range: [
          rangeObj.range.startLineNumber,
          rangeObj.range.startColumn,
          rangeObj.range.endLineNumber,
          rangeObj.range.endColumn,
        ],
        label: file.constrains ? file.constrains[idx].label : rangeObj.index,
        allowMultiline: file.constrains ? file.constrains[idx].allowMultiline : false,
      }));
      codeFile.constrains = constrains;
    }
    return codeFile;
  };

  useEffect(() => {
    setFile(Object.values(files)[0]);
    // deltaDecorationsRef.current = [];
  }, [files]);

  useEffect(() => {
    if (!refs.current.editor || !refs.current.constrainedInstance) {
      return;
    }
    if (constrained) {
      refs.current.constrainedInstance.initializeIn(refs.current.editor);
      refs.current.constrainedInstance.toggleDevMode();
      const model = refs.current.editor.getModel();
      if (file?.constrains) {
        refs.current.constrainedInstance.addRestrictionsTo(model, file?.constrains);
      }
    } else {
      refs.current.constrainedInstance.disposeConstrainer();
    }
  }, [constrained]);

  useEffect(() => {
    if (highlight) updateHighlight(file);
  }, [file]);

  useEffect(() => {
    if (saveCodeForRender.status === "SUCCESS") {
    } else if (saveCodeForRender.status === "ERROR") {
    }
    // console.log(saveCodeForRender);
  }, [saveCodeForRender]);

  const addRef = (editor: any, constrainedInstance: any) => {
    refs.current = {
      editor,
      constrainedInstance,
    };
    if (constrained) {
      constrainedInstance.initializeIn(editor);
    }
    if (highlight) updateHighlight(file);
  };

  const onFileChange = (newFile: CodeFile) => {
    if (file === newFile) return;
    setFile(newFile);
    setTimeout(() => {
      if (highlight) updateHighlight(newFile);
    }, 10);
  };

  const updateHighlight = (file: CodeFile) => {
    if (!constrained) return;
    if (!refs.current.editor || !refs.current.constrainedInstance) {
      return;
    }
    const model = refs.current.editor.getModel();
    if (!model._isRestrictedModel) {
      try {
        refs.current.constrainedInstance.addRestrictionsTo(
          model,
          file?.constrains?.map((restricitons) => ({
            ...restricitons,
            // validate: (currentlyTypedValue: string, newRange: any, info: any) => {
            //   if (info.isDeletion) {s
            //   }
            //   return true;
            // },
          }))
        );
      } catch (exception) {
        // console.log(exception);

        refs.current.constrainedInstance.addRestrictionsTo(model, []);
      }
    }

    if (!model._hasHighlight) {
      model.toggleHighlightOfEditableAreas();
    }
    return;
    const ranges = Object.values(model.getCurrentEditableRanges());
    deltaDecorationsRef.current = refs.current.editor.deltaDecorations(
      deltaDecorationsRef.current,
      ranges.map((rangeObj: any) => ({
        range: rangeObj.range,
        options: { className: "editable-code" },
      }))
    );
  };

  return (
    <div className="code-editor-container">
      <div className="code-editor">
        {Object.values(files).length > 1 && (
          <div className="files-section">
            <List sx={{ width: "100%" }} component="nav">
              {Object.values(files).map((f) => (
                <ListItemButton key={f.name} selected={file === f} onClick={(event) => onFileChange(f)}>
                  <ListItemText primary={f.name} />
                </ListItemButton>
              ))}
            </List>
          </div>
        )}
        <div className="code-section">
          {(filesLoading || reseting) && (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          )}
          {file && <CodeEditorForFile constrained={constrained} file={file} addRef={addRef} />}
        </div>
      </div>
      <div className="code-buttons">
        <div className="code-button-container">
          <Button variant="contained" color="error">
            {"RESET_BUTTON"}
          </Button>
        </div>
        <div className="code-button-container">
          <Button variant="contained" color="success">
            {"SAVE_BUTTON"}
          </Button>
        </div>
        <div className="code-button-container">
          <Button variant="contained">{"RENDER_BUTTON"}</Button>
        </div>
        <div className="code-button-container">
          <Button className="add-btn" variant="outlined" color="success">
            {"ADD_BUTTON"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorWrapper;
