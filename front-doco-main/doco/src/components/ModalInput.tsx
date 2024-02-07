import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useTranslation } from 'next-i18next';
import theme from "../config/theme";
import TextField from '@mui/material/TextField';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export default function BasicModalInput({ ...props }) {
    const { open, setOpen, massage1, massage2, labelNameForm, labelValueForm, buttonOk, buttonCancel, actionOk, onLabelValueChange } = props;
    const { t } = useTranslation(['doco']);
    const handleClose = () => setOpen(false);

    return (
        <div>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        {t(massage1)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2, color: 'red' }}>
                        {t(massage2)}
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <div>
                            <TextField
                                label={t(labelNameForm)}
                                id="standard-size-small"
                                value={labelValueForm} // Usar 'value' en lugar de 'defaultValue'
                                size="small"
                                variant="standard"
                                onChange={(e) => onLabelValueChange(e)} // Llamar a la función 'onLabelValueChange' al cambiar el valor
                            />
                        </div>
                    </Box>
                    <div style={{ justifyContent: 'left' }}>
                        <Button style={{ marginRight: '2%', marginLeft: '65%' }} variant="outlined" color="secondary" onClick={handleClose}>{t(buttonCancel)}</Button>
                        <Button style={{ marginRight: '2%' }} variant="contained" color="secondary" onClick={actionOk}>{t(buttonOk)}</Button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}
