import React from "react";
import Alert from "@mui/material/Alert";
import useDoco from "../hooks/useDocoContext";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Collapse from "@mui/material/Collapse";
import { useTranslation } from 'next-i18next';

export const AlertSuccess = ({props}) => {
  const { alertSuccess, setAlertSuccess } = useDoco();
  const [open, setOpen] = React.useState(false);
    const { t } = useTranslation(['doco']);


  const handleClose = (event) => {
    setAlertSuccess(null);
    setOpen(false);
  };


    React.useEffect(() => {
        setOpen(alertSuccess !== null);

        if (alertSuccess !== null) {
            const timer = setTimeout(() => {
                setOpen(false);
                setAlertSuccess(null);
            }, 9000); // 5000 ms = 5 segundos

            // Limpia el temporizador cuando el componente se desmonta o cuando alertSuccess cambia
            return () => clearTimeout(timer);
        }
    }, [setOpen, alertSuccess]);

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
        severity="success"
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
        {t(alertSuccess)}

      </Alert>
    </Collapse>
  );
};
