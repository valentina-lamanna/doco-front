import React, { useEffect, useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import fetcher from "../constants/fetcher";
import { BACK_FULL_URL } from "../config/config";
import useUserContext from "../hooks/useUserContext";
import OnlyReadEditor from "./OnlyReadEditor";
import useDocoContext from "../hooks/useDocoContext";
import { Typography } from "@mui/material";
import theme from "../config/theme";

const CommentList = ({ comments }) => {
  const { state } = useUserContext();
  const userId = state.id;
  const { setAlertError } = useDocoContext();

  const [items, setItems] = useState(
    comments ? comments.filter((x) => x.active) : []
  );

  useEffect(() => {
    setItems(comments ? comments.filter((x) => x.active) : []);
  }, [comments]);

  const handleDelete = async (commentId) => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          commentId,
        }),
      };
      await fetcher(`${BACK_FULL_URL}/comments`, options);
      setItems((prevItems) =>
        prevItems.filter((item) => item.id !== commentId)
      );
    } catch (error) {
      setAlertError("hubo_un_error_al_borrar_comentario");
    }
  };

  return (
    <List>
      {items.map((item) => (
        <ListItem key={item.id}>
          <ListItem style={{ display: "block" }}>
            <Typography variant="subtitle1" color={theme.palette.primary.main}>
              {item.user.name} {item.user.lastName}
            </Typography>

            <OnlyReadEditor text={item.comment} hasStyle={false} />
          </ListItem>
          {userId === item.user.id && (
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDelete(item.id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default CommentList;
