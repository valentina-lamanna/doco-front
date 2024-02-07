import React, {useEffect} from "react";
import { Root } from "../constants/styles";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from 'next-i18next';
import { styled } from '@mui/material/styles';
import theme from "../config/theme";
import Typography from '@mui/material/Typography';
export async function getStaticProps({ locale }) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common", "doco"])),
            // Will be passed to the page component as props
        },
    };
}

const ErrorPage = () => {

    const { t } = useTranslation(['doco']);
    return (
        <Root>
           <img style={{marginLeft:'30%', marginTop:'20%'}} src={'/404.png'}/>
        </Root>
    );
};

export default ErrorPage;
