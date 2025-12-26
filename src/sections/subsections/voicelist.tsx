import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import React, { useEffect } from "react";
import { JSX, useState } from "react";
import { EDITMODE, VoiceType, RESPONSETYPE } from "types";
import fetchData from "utils/fetchdata";
import { VoiceDelete } from "./voicedelete";

interface ListProps {
  list: VoiceType[];
}

export default function VoiceList(props: ListProps): JSX.Element {
  const { list } = props;
  const { setEditMode, setDbResponse, setMessage } = useEditorContext();
  const [deleteName, setDeleteName] = useState<string>("");
  const [voiceList, setVoiceList] = useState<VoiceType[]>([]);

  useEffect(() => {
    setVoiceList(list);
  }, [list]);

  function onVoiceEditClick(name: string): void {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setEditMode(EDITMODE.Modify);
    fetchData(`/voice/${name}`, "GET", null, setDbResponse);
  }

  function onVoiceDeleteClick(name: string): void {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setDeleteName(name);
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            <th style={{ color: "red" }}>Delete</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
            {voiceList.map((voice: VoiceType) => (
              <React.Fragment key={`voice-${voice.name}`}>
                <tr>
                  <td>
                    <Tooltip title={`Delete ${voice.name}`}>
                      <IconButton className="deletebutton"
                        onClick={() => onVoiceDeleteClick(voice.name)}
                      >
                        <DeleteIcon fontSize="large" />
                      </IconButton>
                    </Tooltip>
                  </td>
                  <td>
                <a
                  href="#"
                  className="editbutton"
                  onClick={() => onVoiceEditClick(voice.name)}
                >
                  {voice.name}
                </a>
                </td>
                  <td align="left">
                    {voice.description}
                  </td>
                </tr>
              </React.Fragment>
            ))}
        </tbody>
      </table>
      {!!(deleteName != "") && (
        <VoiceDelete name={deleteName} setName={setDeleteName} />
      )}
    </>
  );
}
