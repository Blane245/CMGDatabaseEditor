import AddIcon from "@mui/icons-material/Add";
import { IconButton, Tooltip } from "@mui/material";
import Ensemble from "classes/ensemble";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import { JSX, useEffect, useState } from "react";
import fetchData from "utils/fetchdata";
import {
  DbEnsembleListType,
  DbEnsembleType,
  DbVoiceListType,
  EDITMODE,
  EnsembleType,
  PARTITIONTYPE,
  RESPONSETYPE,
  VoiceType,
} from "../../types";
import { EnsembleList } from "./ensemblelist";
import EnsembleDialog from "./ensembledialog";

export default function Ensembles(): JSX.Element {
  const {
    setMessage,
    dbResponse,
    setDbResponse,
    editMode,
    setEditMode,
    partition,
  } = useEditorContext();
  const [ensembleObject, setEnsembleObject] = useState<Ensemble | null>(null);
  const [list, setList] = useState<EnsembleType[]>([]);
  const [voiceList, setVoiceList] = useState<VoiceType[]>([]);

  // get the ensemble and when the partition starts up
  useEffect(() => {
    if (partition != PARTITIONTYPE.ensemble) return;
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    fetchData(`/ensembles`, "GET", null, setDbResponse);
  }, [partition]);

  // when a new response comes from the db handle those that apply here
  useEffect(() => {
    setMessage({ type: RESPONSETYPE.info, message: "" });
    switch (dbResponse.type) {
      case RESPONSETYPE[`ensemblelist`]:
        setList((dbResponse as DbEnsembleListType).value);
        return;
      case RESPONSETYPE[`ensemble`]:
        const data: EnsembleType = (dbResponse as DbEnsembleType).value;
        const n: Ensemble = new Ensemble();
        n.name = data.name;
        n.description = data.description;
        n.voices = data.voices ? data.voices.split(',') : [];
        setEnsembleObject(n);
        return;
      case RESPONSETYPE["voicelist"]:
        setVoiceList((dbResponse as DbVoiceListType).value);
        fetchData(`/ensembles`, "GET", null, setDbResponse);
        return;
      default:
        return;
    }
  }, [dbResponse]);

  const onAddClick = (): void => {
    // crete an ensemble object with no name or descriptiop
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setEnsembleObject(new Ensemble());
    setEditMode(EDITMODE.Add);
  };

  return (
    <>
      {!!(partition == PARTITIONTYPE.ensemble) && (
        <div className="primary">
          <h1>
            Ensembles&nbsp;
            <Tooltip title={`Add Ensemble`}>
              <IconButton onClick={() => onAddClick()}>
                <AddIcon fontSize="large" />
              </IconButton>
            </Tooltip>
          </h1>
          <hr />
          <EnsembleList list={list} />
        </div>
      )}
      {!!(
        partition == PARTITIONTYPE.ensemble &&
        editMode != EDITMODE.None &&
        ensembleObject
      ) && (
        <div className="edit">
          <EnsembleDialog
            ensemble={ensembleObject}
            setEnsemble={setEnsembleObject}
            allEnsembles={list}
            allVoices={voiceList}
          />
        </div>
      )}
    </>
  );
}
