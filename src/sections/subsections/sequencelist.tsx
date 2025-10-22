// rename a sequence
import DuplicateIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import { IconButton, Tooltip } from "@mui/material";
import { useEditorContext } from "CMGSequenceEditorContext";
import { JSX, useState } from "react";
import { EDITMODE, RESPONSETYPE, SequenceName } from "types";
import fetchData from "utils/fetchdata";
import { SequenceDuplicate } from "./sequenceduplicate";
import { SequenceDelete } from "./sequenceedelete";
import { SequenceRename } from "./sequencerename";

interface SequenceListProps {
  sequenceList: SequenceName[];
}

export function SequenceList(props: SequenceListProps): JSX.Element {
  const { sequenceList } = props;
  const { setMode, sequenceType, setDbResponse, setMessage } =
    useEditorContext();
  const [deleteName, setDeleteName] = useState<string>("");
  const [renameName, setRenameName] = useState<string>("");
  const [duplicateName, setDuplicateName] = useState<string>("");

  function onSequenceEditClick(name: string): void {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setMode(EDITMODE.Modify);
    fetchData(`/${sequenceType}/${name}`, "GET", null, setDbResponse);
  }

  function onSequenceDeleteClick(name: string): void {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setDeleteName(name);
  }

  function onSequenceRenameClick(name: string): void {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setRenameName(name);
  }

  function onSequenceDuplicateClick(name: string): void {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setDuplicateName(name);
  }

  return (
    <>
      {sequenceList.map((item: SequenceName) => (
        <>
          <Tooltip title={`Rename ${item.name}`}>
            <IconButton onClick={() => onSequenceRenameClick(item.name)}>
              <RenameIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Duplicate ${item.name}`}>
            <IconButton onClick={() => onSequenceDuplicateClick(item.name)}>
              <DuplicateIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Delete ${item.name}`}>
            <IconButton onClick={() => onSequenceDeleteClick(item.name)}>
              <DeleteIcon fontSize="large" />
            </IconButton>
          </Tooltip>
          &nbsp;
          <a
            href="#"
            className="editbutton"
            onClick={() => onSequenceEditClick(item.name)}
            key={`sequenceedit-${item.name}`}
          >
            {item.name}
          </a>
          <br />
        </>
      ))}
      {!!(deleteName != "") && (
        <SequenceDelete name={deleteName} setName={setDeleteName} />
      )}
      {!!(renameName != "") && (
        <SequenceRename
          name={renameName}
          setName={setRenameName}
          sequenceList={sequenceList}
        />
      )}
      {!!(duplicateName != "") && (
        <SequenceDuplicate
          name={duplicateName}
          setName={setDuplicateName}
          sequenceList={sequenceList}
        />
      )}
    </>
  );
}
