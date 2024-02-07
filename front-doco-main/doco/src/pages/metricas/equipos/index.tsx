import React, { useState } from "react";
import { Root } from "../../../constants/styles";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import IconButton from "@mui/material/IconButton";
import InsightsIcon from "@mui/icons-material/Insights";
import theme from "../../../config/theme";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import Grid from "@mui/material/Grid";
import useSWR from "swr";
import useDocoContext from "../../../hooks/useDocoContext";
import useUserContext from "../../../hooks/useUserContext";
import fetcher from "../../../constants/fetcher";
import { BACK_FULL_URL } from "../../../config/config";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "doco"])),
      // Will be passed to the page component as props
    },
  };
}
const MetricasPageTeam = () => {
  const router = useRouter();
  const { t } = useTranslation(["doco"]);
  const { setAlertError } = useDocoContext();
  const { state } = useUserContext();
  const teamId = state.teamId;

  const { data: teams, error } = useSWR(`${BACK_FULL_URL}/teams`, fetcher);

  if (error) {
    return setAlertError("hubo_un_error_al_traer_los_equipos");
  }

  return (
    <Root>
      <Typography
        variant="h4"
        color={theme.palette.primary.main}
        sx={{ marginBottom: "1%" }}
      >
        {t("metricas_de_los_equipos")}
      </Typography>
        <Typography variant="subtitle1" sx={{ marginBottom: "3%" }}>
        {t("descripcion_metricas")}
        {t("descripcion_puntos_metricas")}
      </Typography>

      {teams &&
        teams.map((team) => {
          return (
            <Grid container spacing={2}>
              <Grid item xs={5}>
                <p>{team.name}</p>
              </Grid>
              <Grid item xs={4}>
                <IconButton
                  aria-label="delete"
                  color="secondary"
                  onClick={() => {
                    router.push(`/metricas/equipos/${team.id}`);
                  }}
                >
                  <InsightsIcon />
                </IconButton>
              </Grid>
            </Grid>
          );
        })}
    </Root>
  );
};

export default MetricasPageTeam;
