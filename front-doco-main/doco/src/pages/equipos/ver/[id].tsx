import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Root } from '../../../constants/styles';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Typography from '@mui/material/Typography';
import theme from '../../../config/theme';
import { useTranslation } from 'next-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { BACK_FULL_URL } from '../../../config/config';
import useSWR from 'swr';
import useDocoContext from '../../../hooks/useDocoContext';
import fetcher from '../../../constants/fetcher';

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'doco'])),
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

export interface UserTeam {
  id: number;
  name: string;
  lastName: string;
}

export interface Team {
  id: number;
  name: string;
  leader: UserTeam;
  documentsCoutn: number;
  members: UserTeam[]; 
}

export default function VerEquipo() {
  const router = useRouter();
  const { t } = useTranslation(['doco']);
  const { id } = router.query;
  const { setAlertError } = useDocoContext();
  const [teamData, setTeamData] = useState<Team | null>(null); // Cambiamos a un solo equipo

  const { data: team, error } = useSWR(`${BACK_FULL_URL}/teams/${id}`, fetcher);

  useEffect(() => {
    if (team) {
      setTeamData(team);
    } else if (error) {
      setAlertError('hubo_un_error_al_traer_el_equipo');
    }
  }, [team, error, setAlertError]);

  return (
    <Root>
      <div>
        <Typography variant="h3" color={theme.palette.primary.main}>
          {teamData?.name}
        </Typography>

        <br />
        <br />

        <Typography variant="h4" color={theme.palette.secondary.main}>
          {t('lider')}: 
        </Typography>
        {teamData?.leader.name} {teamData?.leader.lastName}


        <br />
        <br />
        <Typography variant="h4" color={theme.palette.secondary.main}>
            {t('integrantes')}:
        </Typography>

        <Box style={{ width: '27%' }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 100, border: 'none' }} size="medium" aria-label="Detalle equipo">
              <TableHead>
                <TableRow>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {teamData?.members ? (
                  teamData.members.map((member) => (
                    <TableRow key={member.id} sx={{ '&:last-child td , &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">
                      
                          {member.name} {member.lastName}
                    
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2}>{t('hubo_un_error_al_traer_el_equipo')}</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </div>
    </Root>
  );
}
