import Editor, { composeDecorators } from "@draft-js-plugins/editor";
import styled from "@emotion/styled";
import { EditorState, convertFromRaw } from "draft-js";
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

const OnlyReadEditor = ({ text, hasStyle }) => {
  const getParsedValue = () => {
    const blocksFromHTML = text
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(text)))
      : EditorState.createEmpty();

    return blocksFromHTML;
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

  return hasStyle ? (
    <EditorDiv>
      <Editor
        plugins={[
          blockDndPlugin,
          focusPlugin,
          alignmentPlugin,
          resizeablePlugin,
          imagePlugin,
        ]}
        editorState={getParsedValue()}
        readOnly={true}
      />
    </EditorDiv>
  ) : (
    <Editor editorState={getParsedValue()} readOnly={true} />
  );
};

export default OnlyReadEditor;
