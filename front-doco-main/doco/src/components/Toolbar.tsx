import { styled } from "@mui/material/styles";
import {
  BlockquoteButton,
  BoldButton,
  CodeBlockButton,
  HeadlineOneButton,
  HeadlineThreeButton,
  HeadlineTwoButton,
  ItalicButton,
  OrderedListButton,
  SubButton,
  SupButton,
  UnderlineButton,
  UnorderedListButton,
} from "@draft-js-plugins/buttons";
import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import createUndoPlugin from "@draft-js-plugins/undo";
import createImagePlugin from "@draft-js-plugins/image";
import createFocusPlugin from "@draft-js-plugins/focus";
import createBlockDndPlugin from "@draft-js-plugins/drag-n-drop";
import { composeDecorators } from "@draft-js-plugins/editor";

const focusPlugin = createFocusPlugin();
const blockDndPlugin = createBlockDndPlugin();

const decorator = composeDecorators(
  focusPlugin.decorator,
  blockDndPlugin.decorator
);

const imagePlugin = createImagePlugin({ decorator });
const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const undoPlugin = createUndoPlugin();
const { UndoButton, RedoButton } = undoPlugin;

export const plugins = [toolbarPlugin, undoPlugin, imagePlugin];
const ContainerDiv = styled("div")({
  display: "flex",
  "& button": {
    height: "40px",
    width: "40px",
    background: "#e3e3e3",
    color: "black",
    borderRadius: "4px",
    cursor: "pointer",
    border: "black 1px solid",
    "&:hover": {
      background: "#999999",
    },
  },
});

function ToolbarCustom() {
  return (
    <Toolbar>
      {(externalProps) => (
        <ContainerDiv>
          <BlockquoteButton {...externalProps} />
          <BoldButton {...externalProps} />
          <CodeBlockButton {...externalProps} />
          <HeadlineOneButton {...externalProps} />
          <HeadlineTwoButton {...externalProps} />{" "}
          <HeadlineThreeButton {...externalProps} />
          <ItalicButton {...externalProps} />
          <OrderedListButton {...externalProps} />
          <SubButton {...externalProps} />
          <SupButton {...externalProps} />
          <UnderlineButton {...externalProps} />
          <UnorderedListButton {...externalProps} />
          <UndoButton {...externalProps} />
          <RedoButton {...externalProps} />
        </ContainerDiv>
      )}
    </Toolbar>
  );
}

export default ToolbarCustom;
