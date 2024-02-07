import { styled } from "@mui/material/styles";
import theme from "../config/theme";

export const Root = styled("div")({
  width: "90%",
  paddingLeft: "10%",
  paddingRigth: "10%",
});

export const Title = styled("h3")({
  color: theme.palette.primary.main,
});
