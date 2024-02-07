import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";
import { BACK_FULL_URL } from "../../../config/config";
import fetcher from "../../../constants/fetcher";
import { Title, Root } from "../../../constants/styles";
import { Button, IconButton, Typography } from "@mui/material";
import EditorText from "../../../components/Editor";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import CommentList from "../../../components/CommentList";
import { DocumentStatus } from "../../../types/DocumentStatus";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import BasicModal from "../../../components/Modal";
import useUserContext from "../../../hooks/useUserContext";
import { ChipContainer } from "../../../components/ChipContainer";
import EditIcon from "@mui/icons-material/Edit";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import TranslateIcon from "@mui/icons-material/Translate";
import theme from "../../../config/theme";
import OnlyReadEditor from "../../../components/OnlyReadEditor";
import useDocoContext from "../../../hooks/useDocoContext";
import { useTranslation } from "next-i18next";
import DeleteIcon from "@mui/icons-material/Delete";
import { UserRole } from "../../../types/UserRole";
import CircularProgress from "@mui/material/CircularProgress";

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
    fallback: true,
  };
}

const VerticalContainer = styled(Box)({
  display: " grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gridGap: "10px",
});

const initialState = {
  entityMap: {
    0: {
      type: "IMAGE",
      mutability: "IMMUTABLE",
      data: {
        src: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
      },
    },
  },
  blocks: [
    {
      key: "9gm3s",
      text: "You can have images in your text field. This is a very rudimentary example, but you can enhance the image plugin with resizing, focus or alignment plugins.",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: "ov7r",
      text: " ",
      type: "atomic",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [
        {
          offset: 0,
          length: 1,
          key: 0,
        },
      ],
      data: {},
    },
    {
      key: "e23a8",
      text: "See advanced examples further down …",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

const jsoninit = JSON.stringify(initialState);

export default function seeDocument() {
  const router = useRouter();
  const { setAlertError, setAlertSuccess } = useDocoContext();
  const { id } = router.query;
  const { t } = useTranslation(["doco"]);
  const { state } = useUserContext();
  const rol = state.rol;
  const userId = state.id;
  const teamId = state.teamId;
  const [showCommentList, setShowCommentList] = useState(true);
  const [feedbackComment, setFeedbackComment] = useState(null);
  const [openApproveModal, setOpenApproveModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [docTranslated, setDocTranslated] = useState();

  const { data: document, mutate } = useSWR(
    `${BACK_FULL_URL}/documents/${id}?includeComments=true&includeApprovals=true&includeTeam=true`,
    (url, params) => fetcher(url, params),
    {
      revalidateOnMount: true,
    }
  );

  if (!document) {
    return (
      <div style={{ marginLeft: "50%" }}>
        <CircularProgress />{" "}
      </div>
    );
  }

  const changeStatus = async (e) => {
    e.preventDefault();
    try {
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: document.data,
          id: document.id,
          userId,
          status: DocumentStatus.IN_PROGRESS,
        }),
      };
      await fetcher(`${BACK_FULL_URL}/documents/status`, options);
      setOpenEditModal(false);
      router.push(`/documentos/editar/${document.id}`);
    } catch (error) {
      setAlertError("hubo_un_error_al_cambiar_el_estado");
    }
  };
  const saveFeedback = async (e) => {
    e.preventDefault();
    const feedbackCommentJson = JSON.parse(feedbackComment);
    if (!feedbackCommentJson.blocks[0].text) {
      setShowCommentList(!showCommentList);
      return;
    }

    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          comment: feedbackComment,
          type:
            document.status === DocumentStatus.REVIEWING
              ? "FEEDBACK"
              : "PUBLISHED",
          userId,
          documentId: document.id,
        }),
      };

      await fetcher(`${BACK_FULL_URL}/comments?onlyActives=true`, options);
      await mutate(
        `${BACK_FULL_URL}/documents/${id}?includeComments=true&includeApprovals=true`
      );
      setFeedbackComment("");
      setShowCommentList(!showCommentList);
    } catch (error) {
      setAlertError("hubo_un_error_al_crear_el_comentario");
    }
  };

  const sendApproval = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        documentId: document.id,
      }),
    };
    await fetcher(`${BACK_FULL_URL}/documents/approve`, options);
    await mutate(
      `${BACK_FULL_URL}/documents/${id}?includeComments=true&includeApprovals=true`
    );
    setOpenApproveModal(false);
    setAlertSuccess(t("la_documentacion_fue_aprobada"));
  };

  const translateDocument = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: document.data,
        toLanguage: router.locale,
        fromLanguage: "es",
      }),
    };
    const response = await fetcher(
      `${BACK_FULL_URL}/common/translate`,
      options
    );
    setDocTranslated(response);
  };

  return (
    <Root>
      <VerticalContainer>
        <Typography variant="h4" color={theme.palette.primary.main}>
          {document?.title?.toUpperCase()}
        </Typography>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            justifyContent: "end",
          }}
        >
          <ChipContainer tags={document.approvals || []} />
          {teamId === document.teamId && (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => {
                setOpenEditModal(!openEditModal);
              }}
            >
              <EditIcon />
            </IconButton>
          )}
          {document.status === "REVIEWING" &&
            !document.approvals.some((x) => x.id === userId) && (
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => setOpenApproveModal(true)}
              >
                <ThumbUpIcon />
              </IconButton>
            )}
          {document.status === DocumentStatus.PUBLISHED && (
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={translateDocument}
            >
              <TranslateIcon />
            </IconButton>
          )}
        </div>
        <ChipContainer tags={document.tags || []} />
      </VerticalContainer>
      <div style={{ marginTop: "10px" }}></div>
      <OnlyReadEditor text={docTranslated || document.data} hasStyle />
      <div>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Title>{t("Comentarios").toLocaleUpperCase()}</Title>
          <IconButton onClick={() => setShowCommentList(!showCommentList)}>
            <AddIcon />
          </IconButton>
        </Box>

        <CommentList comments={document.comments} />
        {!showCommentList && (
          <>
            <EditorText
              readOnly={false}
              data={feedbackComment}
              onSave={(updateContent) => {
                setFeedbackComment(updateContent);
              }}
              setImagenes={() => {}}
            />
            <Button type="submit" variant="contained" onClick={saveFeedback}>
              {t("guardar")}
            </Button>
          </>
        )}
      </div>

      <BasicModal
        open={openApproveModal}
        setOpen={setOpenApproveModal}
        massage1="esta_seguro_que_desea_aprobar_el_documento"
        massage2=""
        buttonOk="si_aprobar"
        buttonCancel="no_cancelar"
        actionOk={sendApproval}
      />

      <BasicModal
        open={openEditModal}
        setOpen={setOpenEditModal}
        massage1="esta_seguro_que_desea_modificar_el_documento"
        massage2=""
        buttonOk="si_modificar"
        buttonCancel="no_cancelar"
        actionOk={changeStatus}
      />
    </Root>
  );
}
