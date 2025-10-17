import AddIcon from "@mui/icons-material/Add";
import DuplicateIcon from "@mui/icons-material/ContentCopy";
import DeleteIcon from "@mui/icons-material/Delete";
import RenameIcon from "@mui/icons-material/DriveFileRenameOutline";
import ListIcon from "@mui/icons-material/List";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton, Tooltip } from "@mui/material";
import Sequence from "classes/sequences";
import addSequence from "helpers/addsequence";
import loadSequence from "helpers/loadsequence";
import { JSX, useEffect, useState } from "react";
import SequenceDialog from "sections/sequencedialog";
import fetchData from "utils/fetchdata";
import toTitleCase from "utils/totitlecase";
import {
  Attribute,
  DbErrorType,
  DbResponseType,
  DbSequenceListType,
  DbSequenceNamesType,
  EDITMODE,
  MessageType,
  RESPONSETYPE,
  SequenceName,
} from "../types";

interface SequencesProps {
  sequenceType: Attribute;
  setMessage: Function;
  dbResponse: DbResponseType;
  setDbResponse: Function;
}
export default function Sequences(props: SequencesProps): JSX.Element {
  const { sequenceType, setMessage, dbResponse, setDbResponse } = props;
  const [sequenceObject, setSequenceObject] = useState<Sequence | null>(null);

  const [mode, setMode] = useState<EDITMODE>(EDITMODE.None);
  const [sequenceList, setSequenceList] = useState<SequenceName[]>([]);
  const [sequenceSearchList, setSequenceSearchList] = useState<SequenceName[]>(
    []
  );
  const [editMessage, setEditMessage] = useState<MessageType>({
    type: RESPONSETYPE.info,
    message: "",
  });
  const [showDelete, setShowDelete] = useState<string>("");
  const [showRename, setShowRename] = useState<string>("");
  const [newSequenceName, setNewSequenceName] = useState<string>("");
  const [showDuplicate, setShowDuplicate] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showSearchList, setShowSearchList] = useState<boolean>(false);
  const [searchTags, setSearchTags] = useState<string>("");

  // set up the sequence object and its properties whenever a new sequence type
  // is selected
  useEffect(() => {
    console.log("sequence startup for ", sequenceType);
    fetchData(`/${sequenceType}`, "GET", null, setDbResponse);
  }, [sequenceType]);

  // when a new response comes from the db handle those that apply here
  useEffect(() => {
    setMessage({ type: RESPONSETYPE.info, message: "" });
    console.log(`${sequenceType}sequence received response`, dbResponse.type);
    switch (dbResponse.type) {
      case RESPONSETYPE.error:
        {
          setMessage(dbResponse as MessageType);
          console.log("error is ", (dbResponse as DbErrorType).message);
        }
        break;
      case RESPONSETYPE[`${sequenceType}sequencenamelist`]:
        {
          if (showDelete) {
            setMessage({
              type: "info",
              message: `Sequence '${showDelete}' deleted.`,
            });
            setShowDelete("");
          }

          // if sequence list updated due to add or modify
          // the tag list may have changed as well
          setMode(EDITMODE.None);
          setSequenceList((dbResponse as DbSequenceNamesType).value);
        }
        break;
      case RESPONSETYPE[`${sequenceType}sequencesearchlist`]:
        {
          setSequenceSearchList((dbResponse as DbSequenceListType).value);
          setShowSearchList(true);
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
        console.log(
          `${sequenceType}sequence not processing response`,
          dbResponse.type
        );
    }
  }, [dbResponse]);

  function onListClick() {
    fetchData(`/${sequenceType}`, "GET", null, setDbResponse);
  }

  function onSequenceEditClick(name: string): void {
    setMode(EDITMODE.Modify);
    fetchData(`/${sequenceType}/${name}`, "GET", null, setDbResponse);
  }

  function onSequenceDeleteClick(name: string): void {
    setShowDelete(name);
  }

  function onSequenceRenameClick(name: string): void {
    setShowRename(name);
  }

  function onSequenceDuplicateClick(name: string): void {
    setShowDuplicate(name);
  }

  function onRenameSequence() {
    // check that the new name is unique
    if (sequenceList.findIndex((s) => s.name == newSequenceName) >= 0) {
      setEditMessage({
        type: RESPONSETYPE.error,
        message: `A ${toTitleCase(
          sequenceType
        )} sequence with name '${newSequenceName}' already exists`,
      });
      return;
    }

    // send the rename tranaction
    fetchData(
      `/${sequenceType}/rename/${showRename}?newname=${newSequenceName}`,
      "PUT",
      null,
      setDbResponse
    );
  }

  function onDuplicateSequence() {
    // check that the new name is unique
    if (sequenceList.findIndex((s) => s.name == newSequenceName) >= 0) {
      setEditMessage({
        type: RESPONSETYPE.error,
        message: `A ${toTitleCase(
          sequenceType
        )} sequence with name '${newSequenceName}' already exists`,
      });
      return;
    }

    // send the duplicate tranaction
    fetchData(
      `/${sequenceType}/duplicate/${showDuplicate}?newname=${newSequenceName}`,
      "PUT",
      null,
      setDbResponse
    );
  }
  const onAddClick = (): void => {
    // crete a sequence object with no name or the proper type
    addSequence(sequenceType, setSequenceObject);
    setMode(EDITMODE.Add);
  };

  const onDeleteSequence = (name: string): void => {
    if (showDelete != "") {
      fetchData(`/${sequenceType}/${name}`, "DELETE", null, setDbResponse);
    }
  };

  const onSearchClick = (): void => {
    // present an input field to provide a list of tags
    setSearchTags("");
    setShowSearch(true);
  };

  const onSearchOKClick = (): void => {
    if (searchTags != "") {
      fetchData(
        `/${sequenceType}/search/?tags=${searchTags}`,
        "GET",
        null,
        setDbResponse
      );
    }
  };

  const onDismissSearchList = (): void => {
    setShowSearch(false);
    setShowSearchList(false);
    setSearchTags("");
  };

  // enter modify mode when a sequence is clicked in the search list
  const onSequenceSearchClick = (name: string): void => {
    setShowSearchList(false);
    setShowSearch(false);
    setMode(EDITMODE.None);
    fetchData(`/${sequenceType}/${name}`, "GET", null, setDbResponse);
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
        {showSearch ? (
          <>
            <label>
              Tags List:&nbsp;
              <input
                type="text"
                name="searchtags"
                value={searchTags}
                onChange={(e) => setSearchTags(e.currentTarget.value)}
              />
            </label>
            &nbsp;
            <a href="#" className="okbutton" onClick={onSearchOKClick}>
              OK
            </a>
            &nbsp;
            <a
              href="#"
              className="cancelbutton"
              onClick={() => {
                setShowSearch(false);
                setSearchTags("");
              }}
            >
              Cancel
            </a>
          </>
        ) : null}
        {showSearchList ? (
          <>
            <div className="modal">
              <div className="modal-header">{`${toTitleCase(
                sequenceType
              )} sequences with tags ${searchTags}`}</div>
              <div className="modal-body">
                {sequenceSearchList.map((s: SequenceName) => (
                  <>
                    <a
                      href="#"
                      className="editbutton"
                      onClick={() => onSequenceSearchClick(s.name)}
                      key={`search-${s.name}`}
                    >
                      {s.name}
                    </a>
                    <br />
                  </>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  className="okbutton"
                  onClick={() => onDismissSearchList()}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </>
        ) : null}
        <hr />
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
        {showDelete != "" ? (
          <div className="modal">
            <div className="modal-header">{`Confirm ${toTitleCase(
              sequenceType
            )} Sequence Deletion`}</div>
            <div className="modal-body">
              {`Do you wish to delete the ${toTitleCase(
                sequenceType
              )} sequence '${showDelete}'?`}
            </div>
            <div className="modal-footer">
              <button
                className="yesbutton"
                onClick={() => onDeleteSequence(showDelete)}
              >
                Yes
              </button>
              <button className="nobutton" onClick={() => setShowDelete("")}>
                No
              </button>
            </div>
          </div>
        ) : null}
        {showRename != "" ? (
          <div className="modal">
            <div className="modal-header">{`Provide New ${sequenceType} Sequence Name`}</div>
            <div className="modal-body">
              <label>
                {`New ${sequenceType} Sequence Name: `}
                <input
                  type="text"
                  value={newSequenceName}
                  onChange={(e) => setNewSequenceName(e.target.value)}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button
                className="submitbutton"
                onClick={() => onRenameSequence()}
              >
                Submit
              </button>
              <button
                className="cancelbutton"
                onClick={() => setShowRename("")}
              >
                Cancel
              </button>
              <br />
              <div
                className={
                  editMessage.type == RESPONSETYPE.error
                    ? "errormessage"
                    : "infomessage"
                }
              >
                {editMessage.message}
              </div>
            </div>
          </div>
        ) : null}
        {showDuplicate != "" ? (
          <div className="modal">
            <div className="modal-header">{`Provide New Name for Duplicate of ${showDuplicate}`}</div>
            <div className="modal-body">
              <label>
                {`New ${sequenceType} Sequence Name: `}
                <input
                  type="text"
                  value={newSequenceName}
                  onChange={(e) => setNewSequenceName(e.target.value)}
                />
              </label>
            </div>
            <div className="modal-footer">
              <button
                className="submitbutton"
                onClick={() => onDuplicateSequence()}
              >
                Submit
              </button>
              <button
                className="cancelbutton"
                onClick={() => setShowRename("")}
              >
                Cancel
              </button>
              <br />
              <div
                className={
                  editMessage.type == RESPONSETYPE.error
                    ? "errormessage"
                    : "infomessage"
                }
              >
                {editMessage.message}
              </div>
            </div>
          </div>
        ) : null}
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
