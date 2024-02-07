import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box,IconButton,Tooltip} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {Root} from "../../constants/styles";
import theme from "../../config/theme";
import {BACK_FULL_URL} from "../../config/config";
import useDocoContext from "../../hooks/useDocoContext";
import useUserContext from "../../hooks/useUserContext";
import { useRouter } from "next/router";
import Typography from '@mui/material/Typography';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import useSWR from "swr";
import fetcher from "../../constants/fetcher";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "doco"])),
      // Will be passed to the page component as props
    },
  };
}

export interface UserTeam{
  id: number;
  name: string;
  last: number;
}
export interface Team {
  id: number;
  name: string;
  lead: UserTeam;
  documentsCoutn: number;
  users: UserTeam[];
}



const TeamPage = () => {
  const [teamsTable, setTeamsTable] = useState<Document[]>([])
  const { setAlertError } = useDocoContext();
  const { state} = useUserContext();
  const router = useRouter();
  const { t } = useTranslation(['doco']);
  const idUser = state.id;
  const teamId = state.teamId;

  const { data: teams, error } = useSWR(
      `${BACK_FULL_URL}/teams`,
      fetcher
  );

  if (error) {
    return setAlertError("hubo_un_error_al_traer_equipos");
  }


  useEffect(() => {
    if(teams){
      const array = teams.map((team) => {
        const userCount = team.members.length
        return {
          id:team.id,
          name:team.name,
          lead: team.leader.name + ' ' + team.leader.lastName,
          users: userCount,
          documentsCoutn:team.documentsCount
        }
      });
      setTeamsTable(array)
    }
  },[teams])


  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'name',
        header: t('nombre'),
        Header: ({column}) => <div>{t('nombre')}</div>,
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
      },
      {
        accessorKey: 'lead',
        header: t('lider'),
        Header: ({column}) => <div>{t('lider')}</div>,
      },
      {
        accessorKey: 'users',
        header: t('integrantes'),
        Header: ({column}) => <div>{t('integrantes')}</div>,

      },
      {
        accessorKey: 'documentsCoutn',
        header: t('documentos'),
        Header: ({column}) => <div>{t('documentos')}</div>,
      },
    ];
  }, [teams] );

  return (
      <Root>

        <Typography variant="h3" color={theme.palette.primary.main}>
          {t('listado_equipos')}
        </Typography>
        <br/>
        {teams  && ( <MaterialReactTable
            theme={theme}
            localization={{
              actions: t('actions'),
              and: t('and'),
              cancel: t('cancel'),
              clearFilter: t('clearFilter'),
              clearSearch: t('clearSearch'),
              showHideFilters: t('showHideFilters'),
              showHideSearch: t('showHideSearch'),
              // ... and many more - see link below for full list of translation keys
            }}
            muiTableHeadCellProps={{
              sx: theme => ({
                color: theme.palette.secondary.main
              })
            }}
            columns={columns}
            data={teamsTable}
            enableEditing // son las acctiones
            enableColumnActions={false}
            enableHiding={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableColumnFilters={false}
            muiTablePaginationProps={{
              rowsPerPageOptions: [5, 10, 20],
              showFirstButton: false,
              showLastButton: false,
              SelectProps: {
                native: true
              },
              labelRowsPerPage: t('labelRowsPerPageEquipos')
            }}
            muiSearchTextFieldProps={{
              variant: 'outlined',
              placeholder: t('search'),
              label: t('search'),
              InputLabelProps: {
                shrink: true
              }
            }}
            positionActionsColumn="last"
            renderRowActions={({ row, table }) => (
                <Box sx={{ display: 'flex', gap: '1rem' }}>
                      <Tooltip arrow placement="left" title={t('ver')}>
                        <IconButton onClick={() => router.push(`/equipos/ver/${row.original.id}`) }>
                          <VisibilityIcon/>
                        </IconButton>
                      </Tooltip>
                </Box>
            )}
        /> ) }
      </Root>
  );

};


export default TeamPage;