import React, {useEffect, useState, useMemo} from "react";
import { useRouter } from "next/router";
import { Root } from "../../../constants/styles";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import {BACK_FULL_URL} from "../../../config/config";
import fetcher from "../../../constants/fetcher";
import useUserContext from "../../../hooks/useUserContext";
import useDocoContext from "../../../hooks/useDocoContext";
import useSWR from "swr";
import { useTranslation } from 'next-i18next';
import { MaterialReactTable } from 'material-react-table';
import { Box,IconButton,Tooltip} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Typography from '@mui/material/Typography';
import theme from "../../../config/theme";
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

export interface History{
  user: string,
  comment: string,
  status: string,
  date: string,
}
export default function VerHistoria() {
  const router = useRouter();
  const { setAlertError,docHistory, setDocHistory } = useDocoContext();
  const { state} = useUserContext();
  const { t } = useTranslation(['doco']);
  const [historyTable, setHistoryTable] = useState<History[]>([])
  const [id, setId] = useState(null);

  useEffect(() => {
    if (router.query.id) {
      setId(router.query.id);
    }
  }, [router.query]);

  const { data: history, error ,  mutate: mutateHistorial} = useSWR(
      `${BACK_FULL_URL}/documents/${id}/history`,
      fetcher
  );


  if (error) {
    return setAlertError("hubo_un_error_al_traer_el_historial");
  }


  useEffect(()=>{
    if (history) {
      const titulo = history[0] ? history[0].title : ''
      setDocHistory(titulo)

      const array = history.map((his) => {
        let state = '';
        switch (his.status) {
          case 'IN PROGRESS':
            state = t('proceso');
            break;
          case 'REVIEWING':
            state = t('revision');
            break;
          case 'PUBLISHED':
            state = t('publicado');
            break;
        }
        return {
          version: his.version,
          user: his.name + ' ' + his.lastname ,
          status: state ,
          date: his.createdAt
        }
      })
      setHistoryTable(array)
    }
  }, [history])

  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'version',
        header: t('version'),
        Header: ({column}) => <div>{t('version')}</div>,
        enableEditing: false, //disable editing on this column
      },
      {
        accessorKey: 'user',
        header: t('miembro'),
        Header: ({column}) => <div>{t('miembro')}</div>,
      },
      {
        accessorKey: 'status',
        header: t('estado'),
        Header: ({column}) => <div>{t('estado')}</div>,

      },
      {
        accessorKey: 'date',
        header: t('fecha'),
        Header: ({column}) => <div>{t('fecha')}</div>,
      },
    ];
  }, [history] );
  return (
      <Root>
        <Typography variant="h3" color={theme.palette.primary.main}>
          {t('historial_doc_id')}
        </Typography>
        <Typography variant="h4" color={theme.palette.primary.main}>
          {docHistory}
        </Typography>
        <br/>
        {history  && ( <MaterialReactTable
            theme={theme}
            localization={{
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
            data={historyTable}
            enableColumnActions={false}
            enableHiding={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableColumnFilters={false}
            muiTablePaginationProps={{
              rowsPerPageOptions: [10, 25, 50],
              showFirstButton: false,
              showLastButton: false,
              SelectProps: {
                native: true
              },
              labelRowsPerPage: t('labelRowsPerPageHistorial')
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
        /> ) }
      </Root>
  );
}