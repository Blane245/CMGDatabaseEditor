import AddIcon from "@mui/icons-material/Add";
import { IconButton, Tooltip } from "@mui/material";
import Voice from "classes/voice";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import { JSX, useEffect, useState } from "react";
import fetchData from "utils/fetchdata";
import {
  DbVoiceListType,
  DbVoiceType,
  EDITMODE,
  PARTITIONTYPE,
  RESPONSETYPE,
  VoiceType,
} from "../../types";
import VoiceDialog from "./voicedialog";
import VoiceList from "./voicelist";

export default function Voices(): JSX.Element {
  const {
    setMessage,
    dbResponse,
    setDbResponse,
    editMode,
    setEditMode,
    partition,
  } = useEditorContext();
  const [voiceObject, setVoiceObject] = useState<Voice | null>(null);
  const [voiceList, setVoiceList] = useState<VoiceType[]>([]);

  useEffect(() => {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    fetchData(`/voices`, "GET", null, setDbResponse);
  }, []);

  // when a new response comes from the db handle those that apply here
  useEffect(() => {
    setMessage({ type: RESPONSETYPE.info, message: "" });
    switch (dbResponse.type) {
      case RESPONSETYPE[`voicelist`]:
        setVoiceList((dbResponse as DbVoiceListType).value);
        return;
      case RESPONSETYPE[`voice`]:
        const data: VoiceType = (dbResponse as DbVoiceType).value;
        const n: Voice = new Voice();
        n.name = data.name;
        n.description = data.description;
        n.duration = data.duration;
        n.intervalMean = data.intervalMean;
        n.noiseAmplitude = data.noiseAmplitude;
        n.noiseFrequency = data.noiseFrequency;
        n.registerHi = data.registerHi;
        n.registerLo = data.registerLo;
        n.timbre = data.timbre;
        setVoiceObject(n);
        return;
      default:
        return;
    }
  }, [dbResponse]);

  const onAddClick = (): void => {
    // crete a voice object with no name or descriptiop
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setVoiceObject(new Voice());
    setEditMode(EDITMODE.Add);
  };

  return (
    <>
      {!!(partition == PARTITIONTYPE.ensemble) && (
        <div className="secondary">
          <h1>
            Voices&nbsp;
            <Tooltip title={`Add Voice`}>
              <IconButton onClick={() => onAddClick()} className="addbutton">
                <AddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </h1>
          <hr />
          <VoiceList list={voiceList} />
        </div>
      )}
      {!!(
        partition == PARTITIONTYPE.ensemble &&
        editMode != EDITMODE.None &&
        voiceObject
      ) && (
        <div className="edit">
          <VoiceDialog
            voice={voiceObject}
            setVoice={setVoiceObject}
            allVoices={voiceList}
          />
        </div>
      )}
    </>
  );
}
