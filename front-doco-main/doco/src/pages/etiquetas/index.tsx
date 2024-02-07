import React, { useMemo, useState, useEffect } from 'react';
import { MaterialReactTable } from 'material-react-table';
import { Box, IconButton, Tooltip, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Root } from '../../constants/styles';
import theme from '../../config/theme';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import { useTranslation } from 'next-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import BasicModal from '../../components/Modal';
import BasicModalInput from '../../components/ModalInput';
import useUserContext from '../../hooks/useUserContext';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import fetcher from '../../constants/fetcher';
import { BACK_FULL_URL } from '../../config/config';
import useDocoContext from '../../hooks/useDocoContext';
import Grid from '@mui/material/Grid';
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common', 'doco'])),
    },
  };
}

export interface Tag {
  id: number;
  name: string;
  description: string;
  documentCount:number;
}

const ConfigsPage = () => {
  const { t } = useTranslation(['doco']);
  const [openNewDelete, setOpenNewDelete] = useState(false);
  const [openNewEdit, setOpenNewEdit] = useState(false);
  const router = useRouter();
  const { state } = useUserContext();
  const rol = state.rol;
  const [openNewAdd, setOpenNewAdd] = useState(false);
  const { setAlertError } = useDocoContext();
  const { setAlertSuccess } = useDocoContext();
  const [tagsTable, setTagsTable] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState({
    name: '',
    description: '',
  });
  const [newDeletedTag, setDeletedTag] = useState({
    id: null,
    name: '',
    description: '',
  });
  const [deletingTag, setDeletingTag] = useState<Tag | null>(null);
  const [editingTag, setEditingTag] = useState<Tag | null>(null); // Nuevo estado para la etiqueta en edición
  const [selectedRow, setSelectedRow] = useState(false);
  const [isDuplicateName, setIsDuplicateName] = useState(false);


  const { data: tags, error, mutate: mutateTags } = useSWR(
      `${BACK_FULL_URL}/tags`,
      fetcher
  );

  if (error) {
    return setAlertError(t('hubo_un_error_al_traer_las_tags'));
  }
  const reloadTags = () => {
    mutateTags(); // Esto forzará una recarga de los datos
  };

  useEffect(() => {
    if (tags) {
      const array = tags.map((tag) => {
        return {
          id: tag.id,
          name: tag.name,
          description: tag.description,
          documentCount: tag.documentCount
        };
      });
      setTagsTable(array);
    }
  }, [tags]);


  useEffect(() => {
    if (rol !== 'ADMINISTRATOR') {
      router.push('/documento');
    }
  }, []);

  const checkDuplicateName = (name) => {
    // Verifica si el nombre ya existe en las etiquetas existentes
    return tagsTable.some((tag) => tag.name === name);
  };

  const createTag = async (tagData) => {
    try {
      const response = await fetch(`${BACK_FULL_URL}/tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setAlertSuccess(t('la_etiqueta_fue_creada_exitosamente'));
        reloadTags();
        return { success: true, data: responseData };
      } else {
        setAlertError(t('hubo_un_error_al_crear_la_tag'));
        return { success: false, errors: responseData };
      }
    } catch (error) {
      setAlertError(t('hubo_un_error_al_crear_la_tag'));
      return { success: false, errors: [error.message] };
    }
  };

  const updateTag = async (tagData) => {
    try {
      const response = await fetch(`${BACK_FULL_URL}/tags`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setAlertSuccess(t('la_etiqueta_fue_actualizada_exitosamente'));
        reloadTags();
        return { success: true, data: responseData };
      } else {
        setAlertError(t('hubo_un_error_al_actualizar_la_tag'));
        return { success: false, errors: responseData };
      }
    } catch (error) {
      setAlertError(t('hubo_un_error_al_actualizar_la_tag'));
      return { success: false, errors: [error.message] };
    }
  };

  const deleteTag = async (tagData) => {
    try {
      const response = await fetch(`${BACK_FULL_URL}/tags`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tagData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setAlertSuccess(t('la_etiqueta_fue_eliminada_exitosamente'));
        reloadTags();
        return { success: true, data: responseData };
      } else {
        setAlertError(t('hubo_un_error_al_eliminar_la_tag'));
        return { success: false, errors: responseData };
      }
    } catch (error) {
      setAlertError(t('hubo_un_error_al_eliminar_la_tag'));
      return { success: false, errors: [error.message] };
    }
  };

  const handleDeleteButtonClick = (row: Tag) => {
    setDeletingTag(row);
    setOpenNewDelete(true);
  };

  const handleEditButtonClick = (row: Tag) => {
    setEditingTag(row);
    setOpenNewEdit(true);
  };

  const handleAddTag = async () => {
    try {
      if (newTag.name.trim() === '') {
        // Si el campo de nombre está vacío, establece el nombre predeterminado
        newTag.name = t('nueva_etiqueta');
      }

      if (checkDuplicateName(newTag.name)) {
        // Si el nombre está duplicado, muestra una alerta o realiza la acción adecuada
        return;
      }

      const response = await createTag({
        name: newTag.name,
        description: '', // Dejar la descripción vacía
        userId: state.userId,
      });

      if (response.success) {
        setOpenNewAdd(false); // Cierra el modal
        setNewTag({ name: '', description: '' }); // Limpia los valores después de crear la etiqueta
        return { success: true, data: response };
      } else {
        setAlertError(t('hubo_un_error_al_crear_la_tag'));
      }
    } catch (error) {
      setAlertError(t('hubo_un_error_al_crear_la_tag'));
    }
  };

  const handleEditTag = async () => {
    if (!editingTag) return; // Verifica que haya una etiqueta en edición

    try {
      const response = await updateTag({
        id: editingTag.id,
        name: editingTag.name,
        description: '', // Dejar la descripción vacía
        userId: state.userId,
      });

      if (response.success) {
        setOpenNewEdit(false); // Cierra el modal
        setEditingTag({ id: null , name: '', description: '' }); // Limpia los valores después de editar la etiqueta
      }
      else {
        setOpenNewEdit(false);
        setAlertError(t('hubo_un_error_al_actualizar_la_tag'));
      }
    } catch (error) {
      setOpenNewEdit(false);
      setAlertError(t('hubo_un_error_al_actualizar_la_tag'));
    }
  };

  const handleDeleteTag = async () => {
    try {
      if (!deletingTag) return; // Verifica que haya una etiqueta para eliminar
      const response = await deleteTag({
        id: deletingTag.id,
        userId: state.userId,
      });

      if (response.success) {
        setOpenNewDelete(false); // Cierra el modal
        setDeletedTag({ id: null , name: '', description: ''}); // Limpia los valores después de eliminar la etiqueta
      }
      else if(response.errors.message.text === 'Delete Tag Failed, a document has the tag') {
        setOpenNewDelete(false);
        setAlertError(t('no_se_puede_borrar_porque_hay_doc'));
      }
      else {
        setOpenNewDelete(false);
        setAlertError(t('hubo_un_error_al_eliminar_la_tag'));
      }
    } catch (error) {
      setOpenNewDelete(false);
      setAlertError(t('hubo_un_error_al_eliminar_la_tag'));
    }
  };

  const columns = useMemo(() => {
    return [
      {
        accessorKey: 'name',
        header: t('etiquetas'),
        Header: ({ column }) => (
            <div style={{ color: '#ED4B82' }}>{t('etiquetas')}</div>
        ),
        Cell: ({ cell }) => (
            <div>
              <Chip
                  style={{
                    backgroundColor: theme.palette.secondary.main,
                    color: 'white',
                    marginRight: '2%',
                    marginTop: '1%',
                  }}
                  label={cell.getValue()}
              />
            </div>
        ),
      },
      {
        accessorKey: 'documentCount',
        header: t('documentCount'),
        Header: ({column}) => <div>{t('documentCount')}</div>,
      }
      
    ];
  }, [tags]);

  return (
      <Root>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <Typography variant="h3" color={theme.palette.primary.main}>
              {t('listado_de_etiquetas')}
            </Typography>
          </Grid>
          <Grid item xs={2}>
            <div
                style={{
                  display: 'flex',
                  marginBottom: '2%',
                  justifyContent: 'flex-end',
                  marginRight: '1%',
                }}
            >
              <Tooltip title={t('nueva_etiqueta')}>
                <Fab
                    sx={{
                      backgroundColor: theme.palette.secondary.main,
                      '&:hover': {
                        backgroundColor: theme.palette.secondary.main,
                      },
                    }}
                    onClick={() => {
                      setOpenNewAdd(true);
                    }}
                    aria-label="add"
                >
                  <AddIcon sx={{ color: 'white' }} />
                </Fab>
              </Tooltip>
            </div>
          </Grid>
        </Grid>
        <br />
        <Box style={{ width: '100%' }}>
          <MaterialReactTable
              theme={theme}
              localization={{
                actions: t('actions'),
                and: t('and'),
                cancel: t('cancel'),
                clearFilter: t('clearFilter'),
                clearSearch: t('clearSearch'),
                showHideFilters: t('showHideFilters'),
                showHideSearch: t('showHideSearch'),
              }}
              columns={columns}
              data={tagsTable}
              enableEditing
              enableColumnActions={false}
              muiTableHeadCellProps={{
                sx: (theme) => ({
                  color: theme.palette.secondary.main,
                }),
              }}
              muiTablePaginationProps={{
                rowsPerPageOptions: [5, 10, 20],
                showFirstButton: false,
                showLastButton: false,
                SelectProps: {
                  native: true,
                },
                labelRowsPerPage: t('etiquetasPorPagina'),
              }}
              muiSearchTextFieldProps={{
                variant: 'outlined',
                placeholder: t('search'),
                label: t('search'),
                InputLabelProps: {
                  shrink: true,
                },
              }}
              enableHiding={false}
              enableFullScreenToggle={false}
              enableDensityToggle={false}
              enableColumnFilters={false}
              positionActionsColumn="last"
              renderRowActions={({ row }) => (
                  <Box sx={{ display: 'flex', gap: '1rem' }}>
                    <Tooltip arrow placement="left" title={t('editar')}>
                      <IconButton onClick={() => handleEditButtonClick(row.original)}>
                        <ModeEditIcon />
                      </IconButton>
                    </Tooltip>
                    {row.original.documentCount === 0 ? (
                    <Tooltip arrow placement="left" title={t('borrar')}>
                      <IconButton onClick={() => handleDeleteButtonClick(row.original)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>)
                    :null}
                  </Box>
              )}
          />
          <BasicModal
              open={openNewDelete}
              setOpen={setOpenNewDelete}
              massage1={t('esta_seguro_que_desea_eliminar_la_etiqueta')}
              massage2=""
              buttonOk={t('si_eliminar')}
              buttonCancel={t('no_cancelar')}
              actionOk={handleDeleteTag}
          />

          <BasicModalInput
              open={openNewEdit}
              setOpen={setOpenNewEdit}
              massage1={t('actualizar_el_nombre_de_la_etiqueta')}
              massage2=""
              labelNameForm={t('nombre_etiqueta')}
              labelValueForm={editingTag ? editingTag.name : ''}
              onLabelValueChange={(event) => {
                setEditingTag({ ...editingTag, name: event.target.value });
              }}
              buttonOk={t('confirmar')}
              buttonCancel={t('cancel')}
              actionOk={handleEditTag}
          />
          <BasicModalInput
              open={openNewAdd}
              setOpen={setOpenNewAdd}
              massage1={t('ingresar_el_nombre_de_la_nueva_etiqueta')}
              massage2={
                checkDuplicateName(newTag.name)
                  ? t('no_se_puede_nombre_repetido')
                  : ''  
                }
              labelNameForm={t('nombre_etiqueta')}
              labelValueForm={newTag.name}
              onLabelValueChange={(event) => {
                setNewTag({ ...newTag, name: event.target.value });
              }}
              buttonOk={t('agregar')}
              buttonCancel={t('cancel')}
              actionOk={handleAddTag}
              isDisabled={isDuplicateName} 
          />
        <br />
        <br />
      </Box>
      <br />
      <br />
    </Root>
  );
};

export default ConfigsPage;