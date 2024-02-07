import React, { useContext, useState, useEffect } from "react";
import { useForm , Resolver} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import {AlertError} from "../../components/AlertError";
import md5 from 'md5'
import Button from "@mui/material/Button";
import theme from "../../config/theme";
import useDocoContext from "../../hooks/useDocoContext";
import useUserContext from "../../hooks/useUserContext";
import {BACK_FULL_URL} from "../../config/config";
import useI18n from "../../hooks/useI18n";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import {idiomas} from "../../components/Navigation";
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {useTranslationContext} from "../../contexts/translationProvider";
import { useRouter } from "next/router";
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';
import {Loading} from "../../components/loading";
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common", "doco"])),
            // Will be passed to the page component as props
        },
    };
}

const Logo = styled("img")({
    width: "11%",
    height: "auto",
    marginTop: "4%",
    marginLeft: "23%",
    borderRadius: "50%",
    position: "absolute",
});

type FormValues = {
    mail: string
    password: string
}

const schema = yup.object({
    mail: yup.string().required(),
    password: yup.string().required(),
})
    .required();

const resolver: Resolver<FormValues> = async (values) => {
    return {
        values: values.mail ? values : {},
        errors: !values.mail ? {
                mail: {
                    type: "required",
                    message: "El mail es requerido",
                },
            }
            : !values.password ? {
                    password: {
                        type: "required",
                        message: "El mail es requerido",
                    },
                }
                :
                {},

    }
}

const IncioSesion = ({}) => {
    const { state, dispatch } = useUserContext();
    const { setAlertError  } = useDocoContext();
    const [form, setForm] = useState({
        mail: "",
        password: "",
    });
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<FormValues>({ resolver })
    const onSubmit = (data) => enviar();
    const router = useRouter();
    const { locale } = useTranslationContext();
    const {i18n} = useI18n();



    useEffect(() => {
        if (Object.keys(errors).length !== 0) {
            if (Object.keys(errors).includes("mail")) {
                setAlertError('es_obligatorio_escribir_el_mail');
            } else if (Object.keys(errors).includes("password")) {
                setAlertError("es_obligatorio_escribir_la_contraseña");
            }
        }
    }, [errors]);

    let isLoggedIn = false;

    if (state) {
        isLoggedIn = state.isLogIn;
    }
    const handleChangeIdioma = (event: SelectChangeEvent) => {
        const locale= event.target.value
        router.push(router.pathname, router.asPath, { locale });
    };


    const enviar = async () =>{
        try {
            const user = {email: form.mail,
                password: md5(form.password)}
            const response = await fetch(BACK_FULL_URL + "/users/authenticate", {
                method: "POST",
                body: JSON.stringify(user),
                headers: {"Content-type": "application/json;charset=UTF-8"}
            })

            const data = await response.json();
            if(data.success) {
                dispatch({type: 'LOGIN', payload: {rol: data.data.role, id: data.data.id, teamId: data.data.team.id, isLogIn: true, mail: data.data.email}});
                router.push("/documentos");
            }
            else{
                if(data.message.text === 'User not found'){
                    setAlertError("usuario_no_existe")
                }
                else if(data.message.text === 'Authentication Failed - Invalid Credentials'){
                    setAlertError("contraseña_incorrecta")

                }
                else{
                    setAlertError("hubo_un_error_al_iniciar_sesion")
                }
            }
        }
        catch (error){
            setAlertError( "hubo_un_error_al_iniciar_sesion")
        }
    }

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };
    const handleChange = (event) => {
        setForm((prev) => ({
            ...prev,
            [event.target.id]: event.target.value,
        }));
    };



    return (
        <div>
            <Grid container spacing={2} style={{ height: "102vh" }}>
                <Grid item xs={6}>
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
                    <div
                        style={{
                            marginTop: "30%", //'10%' por si esta la foto
                            marginLeft: "15%",
                            justifyContent: "centre",
                        }}
                    >
                        <Typography variant="h2" color={theme.palette.primary.main}>
                            {i18n('bienvenido')} <br /> DoCo
                        </Typography>
                    </div>
                </Grid>
                <Grid item xs={6}>
                    <div
                        style={{
                            backgroundColor: theme.palette.primary.main,
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                position: "absolute",
                                marginLeft: "13%",
                                marginRight: "10%",
                                marginTop: "8%",
                                width: '30%',
                                height: '65%',
                                backgroundColor: "#FAFAFA",
                            }}
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <div style={{ marginTop: "7%", width: "30%", position: "fixed" }} >
                                    <AlertError />
                                </div>
                                <div style={{ marginTop: "7%", width: "30%", marginLeft:'15%', position: "fixed" }} >
                                    <Loading></Loading>
                                </div>
                                <FormControl
                                    sx={{
                                        m: 1,
                                        width: "25%",
                                        marginLeft: "3%",
                                        marginTop: "13%",
                                        position: "fixed",
                                    }}
                                    variant="outlined"
                                >
                                    <TextField
                                        {...register("mail")}
                                        id="mail"
                                        name="mail"
                                        type="email"
                                        label={i18n("usuario_E-mail")}
                                        value={form.mail}
                                        onChange={handleChange}
                                        autoComplete="e-mail"
                                    />
                                </FormControl>
                                <FormControl
                                    sx={{
                                        m: 1,
                                        width: "25%",
                                        marginLeft: "3%",
                                        marginTop: "19%",
                                        position: "fixed",
                                    }}
                                    variant="outlined"
                                >
                                    <InputLabel htmlFor="password">{i18n("contraseña")}</InputLabel>
                                    <OutlinedInput
                                        {...register("password")}
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={handleChange}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                            }
                                        }}
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                        label="Contraseña *"
                                    />
                                </FormControl>
                                <FormControl
                                    sx={{
                                        m: 1,
                                        marginLeft: "11%",
                                        marginTop: "24%",
                                        position: "fixed",
                                    }}
                                    variant="outlined"
                                >
                                    <Button type="submit" variant="contained" onClick={() => {}}>
                                        {i18n("inicio_sesion")}
                                    </Button>
                                </FormControl>
                            </form>
                        </Box>
                        <Logo src="../../logo_doco.ico" alt="Logo" />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default IncioSesion;