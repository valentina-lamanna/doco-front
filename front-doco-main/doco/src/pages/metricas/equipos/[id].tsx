import React , {useState, useEffect} from "react";
import {GraficoBarras} from "../../../components/GraficoBarras";
import {Root} from "../../../constants/styles";
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
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';

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

export default function TeamMetrics() {
  const router = useRouter();
  const { id } = router.query;
  const { setAlertError } = useDocoContext();
  const { state} = useUserContext();
  const { t } = useTranslation(['doco']);
  const [labelsTag, setLabelsTag] =useState([]);
  const [valueTag, setValueTag] =useState([]);
  const [labelsUser, setLabelsUser] =useState([]);
  const [valueUser, setValueUser] =useState([]);
  const [metricType, setMetricType] =useState('tag')

  const { data: metrics, error } = useSWR(
      `${BACK_FULL_URL}/reports/team/${id}`,
      fetcher
  );

  if (error) {
    return setAlertError("hubo_un_error_al_traer_el_equipo");
  }

  useEffect(()=>{
    if (metrics) {
      setLabelsTag([])
      setValueTag([])
      setLabelsUser([])
      setValueUser([])
      metrics.tagMetrics.map((tag) => {
        setLabelsTag(prevState => [...prevState, tag.label])
        setValueTag(prevState => [...prevState, tag.value])
      })
      metrics.userMetrics.map((user) => {
        setLabelsUser(prevState => [...prevState, user.label])
        setValueUser(prevState => [...prevState, user.value])
      })
    }
  }, [metrics])

  const handleChange = (event) => {
    setMetricType(event.target.value);
  };

  return (
      <Root>
        {metrics &&
            (<div>
              <Grid container spacing={2} sx={{marginBottom:'5%'}}>
                <Grid item xs={11}>
                  <Typography variant="h4" color={theme.palette.primary.main} sx={{marginBottom:'3%'}}>
                    {t('metricas_del_equipo') + ': ' + metrics.teamName}
                  </Typography>
                </Grid>
                <Grid item xs={1}>
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">{t('metrica')}</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={metricType}
                        label={t('metrica')}
                        onChange={handleChange}
                    >
                      <MenuItem value='tag'>{t('por_etiqueta')}</MenuItem>
                      <MenuItem value='user'>{t('por_usuario')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <div style={{width:'75%', marginLeft:'10%'}}>
                {metricType === 'tag' && (<GraficoBarras labels={labelsTag} value={valueTag}/>)}
                {metricType === 'user' && (<GraficoBarras labels={labelsUser} value={valueUser}/>)}
              </div>

            </div>)
        }
      </Root>
  );
};

