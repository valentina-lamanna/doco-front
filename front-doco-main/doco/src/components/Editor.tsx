import React, { useState, useRef } from "react";
import Editor, { composeDecorators } from "@draft-js-plugins/editor";
import { convertFromRaw, EditorState, convertToRaw, RichUtils } from "draft-js";
import { styled } from "@mui/material/styles";
import ToolbarCustom, { plugins } from "./Toolbar";
import createImagePlugin from "@draft-js-plugins/image";
import createFocusPlugin from "@draft-js-plugins/focus";
import createResizeablePlugin from "@draft-js-plugins/resizeable";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import createAlignmentPlugin from "@draft-js-plugins/alignment";
import createDragNDropUploadPlugin from "@draft-js-plugins/drag-n-drop-upload";

const EditorDiv = styled("div")({
  boxSizing: "border-box",
  border: "1px solid #ddd",
  cursor: "text",
  padding: "16px",
  borderRadius: "2px",
  marginBottom: "2em",
  boxShadow: `inset 0px 1px 8px -3px #ABABAB`,
  background: "#fefefe",
  maxHeight: "500px",
  minHeight: "300px",
  overflowY: "auto",
});

function EditorText({ data, onSave, readOnly, setImagenes }) {
  const initial = data
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(data)))
    : EditorState.createEmpty(); // Usar un EditorState vacío si no hay data

  const [editorState, setEditorState] = useState(initial);
  const editorRef = useRef(null);


  const onChange = (newEditorState) => {
    setEditorState(newEditorState);
    const content = JSON.stringify(
      convertToRaw(newEditorState.getCurrentContent())
    );
    onSave(content);
  };

  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const focusPlugin = createFocusPlugin();
  const resizeablePlugin = createResizeablePlugin();
  const blockDndPlugin = createBlockDndPlugin();
  const alignmentPlugin = createAlignmentPlugin();
  const { AlignmentTool } = alignmentPlugin;
  const decorator = composeDecorators(
    resizeablePlugin.decorator,
    alignmentPlugin.decorator,
    focusPlugin.decorator,
    blockDndPlugin.decorator
  );
  const imagePlugin = createImagePlugin({ decorator });


  const customUpload = (data, success, failed, progress) => {

    const mockResult = data.files.map((f) => {
      return {
        file : f,
        name: f.name,
        src: URL.createObjectURL(f),
      };
    });
    setImagenes((prevImages) =>[...prevImages, mockResult])

    let intervalId = -1;
    let currentProgress = 0;

    intervalId = setInterval(() => {
      if (currentProgress < 100) {
        currentProgress += 10;
        progress(currentProgress, mockResult[0]);
      }

      if (currentProgress === 100) {
        clearInterval(intervalId);
        success(mockResult /*, { retainSrc: true }*/);
      }
    }, 1000);
  };

  const dragNDropFileUploadPlugin = createDragNDropUploadPlugin({
    handleUpload: customUpload,
    addImage: (editorState, src) => {
      return imagePlugin.addImage(editorState, src.toString(), {});
    },
  });

  return (
    <div>
      <ToolbarCustom />
      <EditorDiv onClick={focusEditor}>
        <Editor
          editorState={editorState}
          onChange={onChange}
          readOnly={readOnly}
          plugins={[
            dragNDropFileUploadPlugin,
            blockDndPlugin,
            focusPlugin,
            alignmentPlugin,
            resizeablePlugin,
            imagePlugin,
            ...plugins,
          ]} // Agrega el plugin de arrastrar y soltar
          ref={editorRef}
          handleKeyCommand={(command) => {
            let newState = RichUtils.handleKeyCommand(editorState, command);

            if (newState) {
              onChange(newState);
              return "handled";
            }

            return "not-handled";
          }}
        />
      </EditorDiv>
    </div>
  );
}

export default EditorText;
