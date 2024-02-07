import React, { useState } from "react";
import { Autocomplete, TextField, Button } from "@mui/material";
import useSWR from "swr";
import fetcher from "../constants/fetcher";
import { BACK_FULL_URL } from "../config/config";
import { useRouter } from "next/router";
import useUserContext from "../hooks/useUserContext";
import { useTranslation } from "next-i18next";

function TagDropdown({ onChange, defaultValue }) {
  const router = useRouter();
  const { id } = router.query;
  const { state } = useUserContext();
  const teamId = state.teamId;
  const { t } = useTranslation(["doco"]);

  const [selectedOptions, setSelectedOptions] = useState(defaultValue || []);
  const { data: tags } = useSWR(
    `${BACK_FULL_URL}/tags`,
    (url, params) => fetcher(url, params),
    {
      revalidateOnMount: true,
    }
  );

  if (!tags) {
    // hay un texto de traduccion para esto pero no se bien como importarlo
    // si alguna lo hace, agregaria el texto de "Editar etiquetas" de abajo tambien
    return <div>Cargando...</div>;
  }

  const handleOptionChange = async (_, newValue) => {
    const addedTags = newValue.filter((tag) => !selectedOptions.includes(tag));
    const removedTags = selectedOptions.filter(
      (tag) => !newValue.includes(tag)
    );

    for (const tag of addedTags) {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: id,
          teamId: teamId,
          tagId: tag.id,
        }),
      };
      await fetcher(`${BACK_FULL_URL}/documents/tag`, options);
    }
    for (const tag of removedTags) {
      const options = {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          documentId: id,
          teamId: teamId,
          tagId: tag.id,
        }),
      };
      await fetcher(`${BACK_FULL_URL}/documents/tag`, options);
    }

    setSelectedOptions(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div>
      <Autocomplete
        multiple
        id="multi-select-dropdown"
        options={tags}
        value={selectedOptions}
        onChange={handleOptionChange}
        getOptionLabel={(option) => option.name}
        renderInput={(params) => (
          <TextField
            {...params}
            label={t("elegir_etiquetas")}
            variant="outlined"
          />
        )}
      />
    </div>
  );
}

export default TagDropdown;
