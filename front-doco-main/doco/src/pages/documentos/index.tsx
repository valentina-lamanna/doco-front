import React, { useCallback, useMemo, useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Box, IconButton, Tooltip } from "@mui/material";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import HistoryIcon from "@mui/icons-material/History";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import PostAddIcon from "@mui/icons-material/PostAdd";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { Root } from "../../constants/styles";
import Chip from "@mui/material/Chip";
import theme from "../../config/theme";
import { BACK_FULL_URL } from "../../config/config";
import useDocoContext from "../../hooks/useDocoContext";
import useUserContext from "../../hooks/useUserContext";
import { useRouter } from "next/router";
import Typography from "@mui/material/Typography";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import BasicModal from "../../components/Modal";
import useSWR , { mutate } from "swr";
import fetcher from "../../constants/fetcher";
import Grid from "@mui/material/Grid";
import DeleteIcon from "@mui/icons-material/Delete";

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "doco"])),
      // Will be passed to the page component as props
    },
  };
}

export interface Document {
  id: number;
  title: string;
  team: string;
  teamId: number;
  status: string;
  tags: string[];
  version: number;
  data?: string;
}

const DocumentPage = () => {
  const [docs, setDocs] = useState<Document[]>([]);
  const { setAlertError, setAlertSuccess, setDocHistory } = useDocoContext();
  const { state } = useUserContext();
  const [openNewVersion, setOpenNewVersion] = useState(false);
  const [newVersionId, setNewVersionId] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [idBorrar, setIdBorrar] = useState(null);
  const router = useRouter();
  const { t } = useTranslation(["doco"]);
  const idUser = state.id ? state.id : 1;
  const rol = state.rol;
  const teamId = state.teamId;

  const { data: documents, error } = useSWR(
    `${BACK_FULL_URL}/documents/info/${idUser}/?includeTeam=true&onlyActives=true`,
    fetcher
  );
  function reloadData() {
    // Llama a mutate con la clave de solicitud para forzar la recarga
    mutate(`${BACK_FULL_URL}/documents/info/${idUser}/?includeTeam=true&onlyActives=true`);
  }

  if (error) {
    return setAlertError("hubo_un_error_al_traer_docs");
  }

  useEffect(() => {
    if (documents) {
      let filter = [];
      if (rol === "ADMINISTRATOR") {
        filter = documents;
      } else {
        filter = documents.filter((d) => {
          return (
            (d.status !== "PUBLISHED" &&
              d.team.id !== teamId &&
              d.version >= 1) ||
            d.team.id === teamId ||
            d.status === "PUBLISHED"
          );
        });
      }

      const array = filter.map((doc) => {
        const array = doc.tags.map((t) => {
          return t.name;
        });
        const tags = array.join(",");
        let state = "";
        switch (doc.status) {
          case "IN PROGRESS":
            state = t("proceso");
            break;
          case "REVIEWING":
            state = t("revision");
            break;
          case "PUBLISHED":
            state = t("publicado");
            break;
        }
        return {
          id: doc.id,
          title: doc.title,
          team: doc.team.name,
          teamId: doc.team.id,
          status: state,
          tags: tags,
          version: doc.version,
        };
      });
      setDocs(array);
    }
  }, [documents]);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "title",
        header: "titulo",
        Header: ({ column }) => <div>{t("titulo")}</div>,
        enableColumnOrdering: false,
        enableEditing: false, //disable editing on this column
        enableSorting: false,
      },
      {
        accessorKey: "team",
        header: "areas",
        Header: ({ column }) => <div>{t("areas")}</div>,
      },
      {
        accessorKey: "status",
        header: "estado",
        Header: ({ column }) => <div>{t("estado")}</div>,
      },
      {
        accessorKey: "tags",
        header: "etiquetas",
        Header: ({ column }) => <div>{t("etiquetas")}</div>,
        Cell: ({ cell }) => tagsChip(cell.getValue()),
      },
    ];
  }, [documents]);

  const tagsChip = (tags) => {
    let array = [];
    if (tags !== "") {
      array = tags.split(",");
    }
    return (
      <React.Fragment>
        {array.map((language) => (
          <Chip
            style={{
              backgroundColor: theme.palette.secondary.main,
              color: "white",
              marginRight: "2%",
              marginTop: "1%",
            }}
            label={language}
          />
        ))}
      </React.Fragment>
    );
  };

  const createDocument = async () => {
    const response = await fetch(`${BACK_FULL_URL}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: idUser }),
    });
    const responseData = await response.json();
    if (responseData.success) {
      router.push(`/documentos/editar/${responseData.data.id}`);
    } else {
      setAlertError("hubo_un_erro_al_crear_nuevo_doc");
    }
  };

  const deleteDocument = async () => {
    try {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: idUser,
          documentId: idBorrar,
        }),
      };
      await fetcher(`${BACK_FULL_URL}/documents`, options);
      setIdBorrar(null);
      setOpenDeleteModal(false);
      setAlertSuccess("borrar_documento_correcto");
      reloadData()
    } catch (error) {
      console.log(error)
      setIdBorrar(null);
      setOpenDeleteModal(false);
      setAlertError("hubo_un_error_al_borrar_documento");
    }
  };
  return (
    <Root>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Typography variant="h3" color={theme.palette.primary.main}>
            {t("documentos")}
          </Typography>
        </Grid>
        <Grid item xs={2}>
          <Tooltip title={t("nuevo_doc")}>
            <Fab
              sx={{
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.main,
                },
              }}
              onClick={createDocument}
              aria-label="add"
              size={"medium"}
            >
              <AddIcon sx={{ color: "white" }} />
            </Fab>
          </Tooltip>
        </Grid>
      </Grid>

      <br />

      {docs.length > 0 && (
        <MaterialReactTable
          theme={theme}
          localization={{
            actions: t("actions"),
            and: t("and"),
            cancel: t("cancel"),
            clearFilter: t("clearFilter"),
            clearSearch: t("clearSearch"),
            showHideFilters: t("showHideFilters"),
            showHideSearch: t("showHideSearch"),
            // ... and many more - see link below for full list of translation keys
          }}
          muiTableHeadCellProps={{
            sx: (theme) => ({
              color: theme.palette.secondary.main,
            }),
          }}
          columns={columns}
          data={docs}
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
              native: true,
            },
            labelRowsPerPage: t("labelRowsPerPage"),
          }}
          muiSearchTextFieldProps={{
            variant: "outlined",
            placeholder: t("search"),
            label: t("search"),
            InputLabelProps: {
              shrink: true,
            },
          }}
          positionActionsColumn="last"
          renderRowActions={({ row, table }) => (
            <Box sx={{ display: "flex", gap: "1rem" }}>
              <Tooltip arrow placement="right" title={t("historial")}>
                <IconButton
                  onClick={() => {
                    setDocHistory(row.original.title);
                    router.push(`/documentos/historial/${row.original.id}`);
                  }}
                >
                  <HistoryIcon />
                </IconButton>
              </Tooltip>
              {rol === "ADMINISTRATOR" ? (
                <Tooltip arrow placement="right" title={t("borrar")}>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => {
                      setIdBorrar(row.original.id);
                      setOpenDeleteModal(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              {row.original.status === t("publicado") ||
              (row.original.status !== t("publicado") &&
                row.original.teamId !== teamId &&
                row.original.version >= 1) ||
              (row.original.status !== t("publicado") &&
                row.original.teamId !== teamId &&
                row.original.version == 0 &&
                rol === "ADMINISTRATOR") ? (
                <Tooltip arrow placement="left" title={t("ver")}>
                  <IconButton
                    onClick={() =>
                      router.push(`/documentos/ver/${row.original.id}`)
                    }
                  >
                    <VisibilityIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              {row.original.status === t("proceso") &&
              row.original.teamId === teamId ? (
                <Tooltip arrow placement="left" title={t("editar")}>
                  <IconButton
                    onClick={() =>
                      router.push(`/documentos/editar/${row.original.id}`)
                    }
                  >
                    <ModeEditIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
              {row.original.status === t("revision") &&
              row.original.teamId === teamId ? (
                <Tooltip arrow placement="right" title={t("revisiar")}>
                  <IconButton
                    onClick={() =>
                      router.push(`/documentos/ver/${row.original.id}`)
                    }
                  >
                    <FindInPageIcon />
                  </IconButton>
                </Tooltip>
              ) : null}
            </Box>
          )}
        />
      )}
      <BasicModal
        open={openNewVersion}
        setOpen={setOpenNewVersion}
        massage1="esta_seguro_que_desea_crear_una_nueva_version_del_documento"
        massage2=""
        buttonOk="si_crear"
        buttonCancel="no_cancelar"
        actionOk={() => router.push(`/documentos/editar/${newVersionId}`)}
      />
      <BasicModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        massage1="esta_seguro_que_desea_eliminar_el_documento"
        massage2=""
        buttonOk="si_eliminar"
        buttonCancel="no_cancelar"
        actionOk={deleteDocument}
      />
    </Root>
  );
};

export default DocumentPage;
