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

  const refs = useRef<{ editor?: any; constrainedInstance?: any }>({
    editor: undefined,
    constrainedInstance: undefined,
  });

  useEffect(() => {
    setFile(Object.values(files)[0]);
  }, [files]);

  useEffect(() => {
    if (!refs.current.editor || !refs.current.constrainedInstance) {
      return;
    }
    if (constrained) {
      refs.current.constrainedInstance.initializeIn(refs.current.editor);
      const model = refs.current.editor.getModel();
      if (file?.constrains) {
        refs.current.constrainedInstance.addRestrictionsTo(model, file.constrains);
      }
    } else {
      refs.current.constrainedInstance.disposeConstrainer();
    }
  }, [constrained]);

  useEffect(() => {
    if (highlight) updateHighlight(file);
  }, [file]);

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
  };

  const updateHighlight = (file: CodeFile) => {
    if (!constrained) return;
    if (!refs.current.editor || !refs.current.constrainedInstance) {
      return;
    }

    // refs.current.constrainedInstance.disposeConstrainer();
    // refs.current.constrainedInstance.initializeIn(refs.current.editor);

    const model = refs.current.editor.getModel();
    if (!model._isRestrictedModel) {
      try {
        refs.current.constrainedInstance.addRestrictionsTo(
          model,
          file.constrains?.map((restrictions) => restrictions) || []
        );
      } catch (exception) {
        console.log(exception);
        refs.current.constrainedInstance.addRestrictionsTo(model, []);
      }
    }

    if (!model._hasHighlight) {
      model.toggleHighlightOfEditableAreas();
    }
    return;
  };

  const handleReset = () => {
    // setFile({ ...file });
    refs.current.editor.setValue(file.source);
    updateHighlight(file);
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
          {filesLoading && (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          )}
          {file && <CodeEditorForFile constrained={constrained} file={file} addRef={addRef} />}
        </div>
      </div>
      <div className="code-buttons">
        <div className="code-button-container">
          <Button variant="contained" color="error" onClick={() => handleReset()}>
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
