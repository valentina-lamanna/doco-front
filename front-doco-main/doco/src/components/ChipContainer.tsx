import { styled } from "@mui/material/styles";
import { Box, Chip } from "@mui/material";
import theme from "../config/theme";

const Container = styled(Box)({
  display: "flex",
  gap: "5px", // Espacio entre los chips
});

export const ChipContainer = ({ tags }) => {
  return (
    <Container>
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          style={{
            backgroundColor: theme.palette.secondary.main,
            color: "white",
          }}
          label={tag.name}
        />
      ))}
    </Container>
  );
};
