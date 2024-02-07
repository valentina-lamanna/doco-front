import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import useSWR from "swr";
import { BACK_FULL_URL } from "../../../config/config";
import fetcher from "../../../constants/fetcher";
import { Root } from "../../../constants/styles";
import { Button, TextField, Typography } from "@mui/material";
import EditorText from "../../../components/Editor";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import useI18n from "../../../hooks/useI18n";
import { DocumentStatus } from "../../../types/DocumentStatus";
import { useEffect, useState } from "react";
import BasicModal from "../../../components/Modal";
import useUserContext from "../../../hooks/useUserContext";
import TagDropdown from "../../../components/TagDropdown";
import theme from "../../../config/theme";
import useDocoContext from "../../../hooks/useDocoContext";

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
  gridAutoRows: " minmax(100px, auto)",
  marginTop: "10px",
});

const ButtonContainer = styled("div")({
  display: " grid",
  gridTemplateColumns: "repeat(9, 1fr)",
  gridGap: "10px",
  gridAutoRows: " minmax(100px, -1)",
  justifyContent: "end",
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

export default function editDocument() {
  const router = useRouter();
  const { id } = router.query;
  const { i18n } = useI18n();
  const { state } = useUserContext();
  const userId = state.id;
  const [content, setContent] = useState(null);
  const [openSaveModal, setOpenSaveModal] = useState(false);
  const [openRevisionModal, setOpenRevisionModal] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const { setAlertSuccess } = useDocoContext();

  const { data: document, mutate } = useSWR(
    `${BACK_FULL_URL}/documents/${id}?includeOwners=true`,
    (url, params) => fetcher(url, params),
    {
      revalidateOnMount: true, // Disable caching for this request
    }
  );

  useEffect(() => {
    if (document) {
      setTextFieldValue(document.title);
    }
  }, [document]);

  if (!document) {
    return <div>{i18n("cargando")}</div>;
  }

  const handleTagChange = async (selectedTags) => {
    setSelectedOptions(selectedTags);
  };

  const parseFormData = async () => {
    const json = JSON.parse(content);
    const formData = new FormData();
    formData.append("data", content);
    formData.append("id", document.id);
    formData.append("userId", userId);
    formData.append("title", textFieldValue);

    if (imagenes.length > 0) {
      const aplanado = imagenes.flat();
      aplanado.forEach((image, index) => {
        formData.append("images", image.file, image.name.toString()); //'images' --> tienen que ser as})
      });
    }
    return formData;
  };
  const updateDocumentContent = async (e) => {
    const data = await parseFormData();
    const options = {
      method: "PUT",
      body: data,
    };
    await fetcher(`${BACK_FULL_URL}/documents/save`, options);
    await mutate(`${BACK_FULL_URL}/documents/${id}?includeComments=true`);
    setAlertSuccess("el_documento_se_edito_bien");
    router.push("/documentos");
  };

  const changeStatus = async (e) => {
    await updateDocumentContent(e);
    e.preventDefault();
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: content,
        id: document.id,
        userId,
        status: DocumentStatus.REVIEWING,
      }),
    };
    await fetcher(`${BACK_FULL_URL}/documents/status`, options);
    setOpenRevisionModal(false);
    router.push(`/documentos/ver/${document.id}`);
  };

  return (
    <Root>
      <Typography
        variant="h4"
        color={theme.palette.primary.main}
        sx={{ marginBottom: "1%" }}
      >
        {i18n("editar_documento_titulo")}
      </Typography>
      <Typography variant="subtitle1" sx={{ marginBottom: "3%" }}>
        {i18n("descripcion_editar_docs")}
      </Typography>

      <VerticalContainer>
        <TextField
          id="title"
          name="title"
          type="text"
          label={i18n("titulo")}
          value={textFieldValue}
          onChange={(e) => setTextFieldValue(e.target.value)}
        />
        <TagDropdown
          onChange={handleTagChange}
          defaultValue={document.tags || []}
        />
      </VerticalContainer>

      <div style={{ marginTop: "10px" }}></div>
      <EditorText
        readOnly={document?.status !== DocumentStatus.IN_PROGRESS}
        data={document.data || content}
        onSave={(updateContent) => {
          setContent(updateContent);
        }}
        setImagenes={setImagenes}
      />

      <ButtonContainer>
        <div
          style={{
            gridColumn:
              document?.owners && document.owners.some((x) => x.id === userId)
                ? "1/8"
                : "1/9",
          }}
        />
        <Button
          type="submit"
          variant="contained"
          onClick={(e) => setOpenSaveModal(true)}
        >
          {i18n("guardar")}
        </Button>

        {document?.owners && document.owners.some((x) => x.id === userId) && (
          <Button
            type="submit"
            color="secondary"
            variant="contained"
            onClick={() => setOpenRevisionModal(!openRevisionModal)}
          >
            {i18n("a_revision")}
          </Button>
        )}
      </ButtonContainer>
      <BasicModal
        open={openSaveModal}
        setOpen={setOpenSaveModal}
        massage1="esta_seguro_que_desea_modificar_el_documento"
        massage2=""
        buttonOk="si_modificar"
        buttonCancel="no_cancelar"
        actionOk={(e) => {
          updateDocumentContent(e);
        }}
      />

      <BasicModal
        open={openRevisionModal}
        setOpen={setOpenRevisionModal}
        massage1="esta_seguro_que_desea_revisar_el_documento"
        massage2=""
        buttonOk="si_revisar"
        buttonCancel="no_cancelar"
        actionOk={changeStatus}
      />
    </Root>
  );
}
