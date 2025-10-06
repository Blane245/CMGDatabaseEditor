import { JSX, useEffect, useState } from "react";
import {
  DbErrorType,
  DbResponseType,
  DbSequenceListType,
  DbSequenceNamesType,
  DbSequenceType,
  EDITMODE,
  MessageType,
  NoteItem,
  NoteSequence,
  RESPONSETYPE,
  SequenceItem,
  SequenceName,
} from "../types";
import fetchData from "../utils/fetchdata";
import NoteSequenceDialog from "./notesequencedialog";

interface NoteSequencesProps {
  setMessage: Function;
  dbResponse: DbResponseType;
  setDbResponse: Function;
}
export default function NoteSequences(props: NoteSequencesProps): JSX.Element {
  const { setMessage, dbResponse, setDbResponse } = props;
  const [mode, setMode] = useState<EDITMODE>(EDITMODE.None);
  const [sequenceList, setSequenceList] = useState<SequenceName[]>([]);
  const [sequenceSearchList, setSequenceSearchList] = useState<SequenceItem[]>(
    []
  );
  const [showDelete, setShowDelete] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [showSearchList, setShowSearchList] = useState<boolean>(false);
  // const [name, setName] = useState<string>("");
  // const [value, setValue] = useState<string>("");
  const [searchTags, setSearchTags] = useState<string>("");
  const [valueResponse, setValueResponse] =
    useState<DbResponseType>(dbResponse);

  // on startup show the sequence list
  useEffect(() => {
    fetchData(`/sequences`, "GET", null, setDbResponse);
  }, []);

  // process the error,  sequencelist, and sequencesearchlist responses
  // relay the sequencevalue response to the notesequenceditdialog
  useEffect(() => {
    console.log("notesequence received response", dbResponse.type);
    switch (dbResponse.type) {
      case RESPONSETYPE.error:
        if ((dbResponse as DbErrorType).message != "")
          setMessage(dbResponse as MessageType);
        break;
      case RESPONSETYPE.sequencenamelist:
        // if sequence list updated to do delete ...
        if (showDelete) {
          setMessage({
            type: "info",
            message: `Sequence '${showDelete}' deleted.`,
          });
          // update the tag list when a sequence is deleted
          fetchData("/tags", "GET", null, setDbResponse);
          setShowDelete("");
        }

        // if sequence list updated due to add or modify
        // the tag list may have chaged as well
        setMode(EDITMODE.None);
        setSequenceList((dbResponse as DbSequenceNamesType).value);
        break;

      case RESPONSETYPE.sequencesearchlist:
        setSequenceSearchList((dbResponse as DbSequenceListType).value);
        setShowSearchList(true);
        break;
      case RESPONSETYPE.sequencevalue:
        setValueResponse(dbResponse);
        setMode(EDITMODE.Modify);
        break;
      default:
        console.log("notesequence not processing response", dbResponse.type);
    }
  }, [dbResponse]);

  function onListClick() {
    fetchData(`/sequences`, "GET", null, setDbResponse);
  }

  function onSequenceEditClick(name: string): void {
    setMode(EDITMODE.Modify);
    fetchData(`/sequence/${name}`, "GET", null, setDbResponse);
  }

  function onSequenceDeleteClick(name: string): void {
    setShowDelete(name);
  }

  function onAddClick() {
    setMode(EDITMODE.Add);
  }

  function onDeleteSequence(name: string): void {
    if (showDelete != "") {
      fetchData(`/sequence/${name}`, "DELETE", null, setDbResponse);
    }
  }

  function onSearchClick(): void {
    // present an input field to provide a list of tags
    setSearchTags("");
    setShowSearch(true);
  }

  function onSearchOKClick(): void {
    if (searchTags != "") {
      fetchData(
        `/sequences/search/?tags=${searchTags}`,
        "GET",
        null,
        setDbResponse
      );
    }
  }

  function onDismissSearchList(): void {
    setShowSearch(false);
    setShowSearchList(false);
    setSearchTags("");
  }

  // enter modify mode when a sequence is clicked in the search list
  function onSequenceSearchClick(name: string) {
    setShowSearchList(false);
    setShowSearch(false);
    setMode(EDITMODE.None);
    fetchData(`/sequence/${name}`, "GET", null, setDbResponse);
  }
  // others to follow
  return (
    <>
      <div className="sequence">
        <h1>Note Sequences</h1>
        <a href="#" className="addbutton" onClick={() => onAddClick()}>
          Add Sequence
        </a>
        <br />
        <a href="#" className="listbutton" onClick={() => onListClick()}>
          List Sequences
        </a>
        <br />
        <a href="#" className="listbutton" onClick={() => onSearchClick()}>
          Search
        </a>
        {showSearch ? (
          <>
            <br />
            <label>
              Tags List:&nbsp;
              <input
                type="text"
                name="searchtags"
                value={searchTags}
                onChange={(e) => setSearchTags(e.currentTarget.value)}
              />
              <br />
            </label>
            &nbsp;
            <a href="#" className="okbutton" onClick={() => onSearchOKClick()}>
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
              <div className="modal-header">{`Sequences with tags ${searchTags}`}</div>
              <div className="modal-body">
                {sequenceSearchList.map((s: SequenceItem) => (
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
            <a
              href="#"
              className="deletebutton"
              onClick={() => onSequenceDeleteClick(item.name)}
              key={`sequencedelete-${item.name}`}
            >
              Delete
            </a>
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
            <div className="modal-header">Confirm Note Sequence Deletion</div>
            <div className="modal-body">
              {`Do you wish to delete the note sequence '${showDelete}'?`}
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
      </div>
      {mode != EDITMODE.None ? (
        <NoteSequenceDialog
          mode={mode}
          setMode={setMode}
          dbResponse={valueResponse}
          setDbResponse={setDbResponse}
        />
      ) : null}
    </>
  );
}
