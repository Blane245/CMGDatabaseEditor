import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Tooltip } from "@mui/material";
import Sequence from "classes/sequences";
import { useEditorContext } from "CMGSequenceEditorContext";
import addSequence from "helpers/addsequence";
import loadSequence from "helpers/loadsequence";
import { JSX, useEffect, useState } from "react";
import SequenceDialog from "sections/sequencedialog";
import fetchData from "utils/fetchdata";
import toTitleCase from "utils/totitlecase";
import {
  DbSequenceNamesType,
  EDITMODE,
  RESPONSETYPE,
  SequenceName,
} from "../types";
import { SequenceSearch } from "./subsections/sequencesearch";
import { SequenceList } from "./subsections/sequencelist";

export default function Sequences(): JSX.Element {
  const { sequenceType, setMessage, dbResponse, setDbResponse, mode, setMode } =
    useEditorContext();
  const [sequenceObject, setSequenceObject] = useState<Sequence | null>(null);

  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [sequenceList, setSequenceList] = useState<SequenceName[]>([]);

  // get the sequence list for this type at startup
  useEffect(() => {
      setMessage({
        type: RESPONSETYPE.info,
        message: '',
      });
    fetchData(`/${sequenceType}`, "GET", null, setDbResponse);
  }, [sequenceType]);

  // when a new response comes from the db handle those that apply here
  useEffect(() => {
    setMessage({ type: RESPONSETYPE.info, message: "" });
    console.log(`${sequenceType} sequence received response`, dbResponse.type);
    switch (dbResponse.type) {
      case RESPONSETYPE[`${sequenceType}sequencenamelist`]:
        {
          // the tag list may have changed as well
          setMode(EDITMODE.None);
          setSequenceList((dbResponse as DbSequenceNamesType).value);
        }
        break;
      case RESPONSETYPE[`${sequenceType}sequencevalue`]:
        {
          loadSequence(sequenceType, dbResponse, setSequenceObject);

          // enter modify mode once sequence object and attribute properties are loaded is loaded
          setMode(EDITMODE.Modify);
        }
        break;
      default:
        break;
    }
  }, [dbResponse]);

  function onListClick() {
      setMessage({
        type: RESPONSETYPE.info,
        message: '',
      });
    fetchData(`/${sequenceType}`, "GET", null, setDbResponse);
  }

  const onAddClick = (): void => {
    // crete a sequence object with no name and the proper type
      setMessage({
        type: RESPONSETYPE.info,
        message: '',
      });
    addSequence(sequenceType, setSequenceObject);
    setMode(EDITMODE.Add);
  };

  const onSearchClick = (): void => {
      setMessage({
        type: RESPONSETYPE.info,
        message: '',
      });
    setShowSearch(true);
  };

  return (
    <>
      <div className="sequence">
        <h1>{`${toTitleCase(sequenceType)} Sequences`}</h1>
        <Tooltip title={`Add ${toTitleCase(sequenceType)} sequence`}>
          <IconButton onClick={() => onAddClick()}>
            <AddIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip title={`List ${toTitleCase(sequenceType)} sequences`}>
          <IconButton onClick={() => onListClick()}>
            <ListIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        <Tooltip
          title={`Search ${toTitleCase(
            sequenceType
          )} for sequences by tag list`}
        >
          <IconButton onClick={() => onSearchClick()}>
            <SearchIcon fontSize="large" />
          </IconButton>
        </Tooltip>
        {!!showSearch && <SequenceSearch setShowSearch={setShowSearch} />}
        <hr />
        {!!(sequenceList.length > 0) && (
          <SequenceList sequenceList={sequenceList} />
        )}
      </div>
      {mode != EDITMODE.None && sequenceObject ? (
        <div className="edit">
          <SequenceDialog
            sequenceType={sequenceType}
            sequenceObject={sequenceObject}
            setSequenceObject={setSequenceObject}
            mode={mode}
            setMode={setMode}
            setDbResponse={setDbResponse}
          />
        </div>
      ) : null}
    </>
  );
}
