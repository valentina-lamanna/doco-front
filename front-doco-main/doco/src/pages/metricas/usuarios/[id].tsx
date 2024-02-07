import React , {useState, useEffect} from "react";
import {GraficoBarras} from "../../../components/GraficoBarras";
import { Root } from "../../../constants/styles";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import {BACK_FULL_URL} from "../../../config/config";
import fetcher from "../../../constants/fetcher";
import useUserContext from "../../../hooks/useUserContext";
import useDocoContext from "../../../hooks/useDocoContext";
import useSWR from "swr";
import { useTranslation } from 'next-i18next';
import theme from "../../../config/theme";
import Typography from '@mui/material/Typography';
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "doco"])),
      // Will be passed to the page component as props
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true, // Configura el fallback a true
  };
}

export default function UsersMetrics() {
  const router = useRouter();
  const { id } = router.query;
  const { setAlertError } = useDocoContext();
  const { state} = useUserContext();
  const { t } = useTranslation(['doco']);
  const idUser = state.id;
  const teamId = state.teamId;

  const [labels, setLabels] =useState([]);
  const [value, setValue] =useState([]);

  const { data: metrics, error } = useSWR(
      `${BACK_FULL_URL}/reports/user/${id}`,
      fetcher
  );

  if (error) {
    return setAlertError("hubo_un_error_al_traer_el_usuario");
  }

  useEffect(()=>{ // todo, dejar solo el if cuando haga el swr
    if (metrics) {
      setLabels([])
      setValue([])
      metrics.tagMetrics.map((tag) => {
        setLabels(prevState => [...prevState, tag.label])
        setValue(prevState => [...prevState, tag.value])

      })
    }
  }, [metrics])


  return (
      <Root>
        {metrics &&
            (<div>
                <Typography variant="h4" color={theme.palette.primary.main} sx={{marginBottom:'3%'}}>
                  {t('metricas_del_usuario') + ': ' + metrics.username}
                </Typography>
                <Typography variant="h6" color={theme.palette.secondary.main} sx={{marginBottom:'3%'}}>
                  {t('puntos_totales') + ': ' + metrics.pointsCount}
                </Typography>
                <div style={{width:'75%', marginLeft:'10%'}}>
                  <GraficoBarras labels={labels} value={value}/>
                </div>
            </div>)
        }
      </Root>
  );
};

