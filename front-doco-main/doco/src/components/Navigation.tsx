import * as React from "react";
import { useContext, useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/Button";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import LogoutIcon from "@mui/icons-material/Logout";
import theme from "../config/theme";
import useUserContext from "../hooks/useUserContext";
import { useRouter } from "next/router";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useTranslationContext } from '../contexts/translationProvider'
import FormControl from '@mui/material/FormControl';
import { useTranslation } from 'next-i18next';
import InputLabel from '@mui/material/InputLabel';
import Popover from '@mui/material/Popover';
import { makeStyles } from '@mui/styles';
import Typography from "@mui/material/Typography";



const pages = ["documentos", "equipos", "metricas", "etiquetas"];
export const idiomas = ["es", "en", "pt"];

const Logo = styled("img")({
  width: "100px",
  height: "auto",
  paddingRigth: "2%",
});


const useStyles = makeStyles((theme) => ({
    popoverContent: {
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
    },
    menuItem: {
        padding: theme.spacing(1),
    },
}));

function ResponsiveAppBar({props}) {
    const { state, dispatch } = useUserContext();
    const rol = state.rol;
    const teamID = state.teamId;
    const mail = state.mail;
    const router = useRouter();
    const rutaActual = router.pathname.split('/')[1];
    const [selectedButton, setSelectedButton] = useState(rutaActual);
    const { locale } = useTranslationContext();
    const { t } = useTranslation(['doco']);
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const [src, setSrc] = useState("../../logo_doco.ico");

    const handleButtonClick = (event) => {setAnchorEl(event.currentTarget); };

    const handleMenuItemClick = (value) => () => {
        setSelectedButton('metricas');
        if(value === 'usuarios'){
            router.push(`/metricas/${value}`);
        }else{
            if(rol === 'ADMINISTRATOR'){
                router.push(`/metricas/${value}`);
            }else if(rol === 'LEADER'){
                router.push(`/metricas/${value}/${teamID}`);
            }
        }
        setAnchorEl(null);
    };

    const handleClosePopover = () => { setAnchorEl(null);};

    const open = Boolean(anchorEl);

  const choosePage = (page) => {
    setSelectedButton(page);
    switch (page) {
      case "documentos":
        router.push("/documentos");
        break;
      case "equipos":
        router.push("/equipos");
        break;
      case "metricas":
        router.push("/metricas");
        break;
      case "etiquetas":
        router.push("/etiquetas");
        break;
    }
  };

  const handleCerrarSesion = (event) => {
      router.push("/logIn")
      dispatch({ type: "LOGOUT" });
  };
    const handleChangeIdioma = (event: SelectChangeEvent) => {
    const locale = event.target.value;
    router.push(router.pathname, router.asPath, { locale });
  };
    useEffect(() => {
        if(router.locale !== 'es'){
            setSrc("../../../logo_doco.ico")
        }
    }, [router.locale]);



    return (
        <AppBar position="static" style={{ backgroundColor: "#FAFAFA" }}>
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Logo src={src} alt="Logo" />
                    <Box  sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} style={{justifyContent: 'center'}}>
                        {pages.map((page) => (
                            page.toString() === 'etiquetas' && rol == 'ADMINISTRATOR'
                            || (page != 'etiquetas' && page.toString() != 'metricas')
                                ?
                                <Button
                                    style={{color: selectedButton === page ? '#FAFAFA': theme.palette.primary.main,
                                            backgroundColor: selectedButton === page ? theme.palette.primary.main : 'transparent'}}
                                    key={page}
                                    onClick={() => choosePage(page)}
                                    sx={{my: 2, color: 'white', display: 'block'}}
                                >
                                    {t(page)}
                                </Button>
                                :
                             page.toString() === 'metricas' && rol != 'STANDARD' ?
                                 <div sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' } }} style={{justifyContent: 'center'}}>
                                     <Button onClick={handleButtonClick}  aria-haspopup="true"
                                         sx={{ marginBottom: '16px', marginTop:'16px',
                                             color: selectedButton === page ? '#FAFAFA': theme.palette.primary.main,
                                             backgroundColor: selectedButton === page ? theme.palette.primary.main : 'transparent',
                                             '&:hover': { backgroundColor: theme.palette.primary.main, color:'#FAFAFA'},}}
                                     > {t(page)}
                                     </Button>
                                     <Popover  open={open} anchorEl={anchorEl} onClose={handleClosePopover}
                                         anchorOrigin={{vertical: 'bottom', horizontal: 'left',}}
                                         transformOrigin={{vertical: 'top', horizontal: 'left',}}
                                     >
                                         <div className={classes.popoverContent}>
                                             <MenuItem className={classes.menuItem} onClick={handleMenuItemClick('usuarios')}>
                                                    {t('usuarios')}
                                             </MenuItem>
                                             <MenuItem className={classes.menuItem} onClick={handleMenuItemClick('equipos')}>
                                                 {t('equipos')}
                                             </MenuItem>
                                         </div>
                                     </Popover>
                                 </div>
                            :null

                        ))}
                    </Box>

                    <FormControl sx={{ m: 1, minWidth: '5%', minBlockSize:10, marginRight:'3%',  }} size="small">
                        <Select
                            labelId="idioma"
                            id="idioma"
                            value={locale}
                            onChange={handleChangeIdioma}
                        >
                            {idiomas.map((idioma) => {
                                return( <MenuItem value={idioma}>{idioma}</MenuItem>);
                            })
                            }

                        </Select>
                    </FormControl>
                    <Box sx={{ flexGrow: 0,display: { xs: 'flex', md: 'flex' }, alignItems: 'center',  minBlockSize:6}} style={{paddingRight:'2%'}}>
                        <p style={{color :theme.palette.primary.main}}>
                            {mail}
                        </p>
                        <Tooltip title={t('cerrar_sesion')}>
                            <IconButton onClick={handleCerrarSesion} sx={{ p: 0 }}>
                                <LogoutIcon style={{color:  theme.palette.primary.main}}></LogoutIcon>
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
);

}
export default ResponsiveAppBar;
