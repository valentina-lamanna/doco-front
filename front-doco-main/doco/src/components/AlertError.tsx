import React from "react";
import Alert from "@mui/material/Alert";
import useDoco from "../hooks/useDocoContext";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import { useTranslation } from 'next-i18next';

export const AlertError = ({props}) => {
  const { alertError, setAlertError } = useDoco();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation(['doco']);

  const handleClose = (event) => {
    setAlertError(null);
    setOpen(false);
  };


    React.useEffect(() => {
        setOpen(alertError !== null);

        if (alertError !== null) {
            const timer = setTimeout(() => {
                setAlertError(null);
                setOpen(false);
            }, 4000); // 5000 ms = 5 segundos

            // Limpia el temporizador cuando el componente se desmonta o cuando alertSuccess cambia
            return () => clearTimeout(timer);
        }
    }, [setOpen, alertError]);

  return (
    <Collapse
      in={open}
      collapsedHeight={0}
      style={{
          justifyContent: "center",
          paddingLeft:     open ? "10%" : '0%',
          paddingRight:    open ? "10%" : '0%',
          paddingBottom:      open ? "1%" : '0%',
      }}
    >
      <Alert
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
        sx={{ mb: 2 }}
      >
        {t(alertError)}

      </Alert>
    </Collapse>
  );
};
