import AddIcon from "@mui/icons-material/Add";
import ListIcon from "@mui/icons-material/List";
import { IconButton, Tooltip } from "@mui/material";
import { JSX, useEffect, useState } from "react";
import {
  Attribute,
  Attributes,
  DbErrorType,
  DbResponseType,
  DbSequenceNamesType,
  DbTagListType,
  MessageType,
  RESPONSETYPE,
  SequenceName,
  TagItem,
} from "types";
import fetchData from "utils/fetchdata";
import toTitleCase from "utils/totitlecase";
interface TagsProps {
  sequenceType: Attribute;
  setMessage: Function;
  dbResponse: DbResponseType;
  setDbResponse: Function;
}
export default function Tags(props: TagsProps): JSX.Element {
  const { sequenceType, setMessage, dbResponse, setDbResponse } = props;
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<string>("");
  const [tagName, setTagName] = useState<string>("");
  const [tagList, setTagList] = useState<TagItem[]>([]);
  const [sequenceNameList, setSequenceNameList] = useState<SequenceName[]>([]);
  const [showSequenceList, setShowSequenceList] = useState<boolean>(false);

  // on startup show the tag list
  useEffect(() => {
    fetchData(`/tag`, "GET", null, setDbResponse);
  }, []);

  // when a response arrives from the database take the apporpriate action
  useEffect(() => {
    console.log("tag received response", dbResponse.type);
    switch (dbResponse.type) {
      case RESPONSETYPE.error:
        setMessage(dbResponse as MessageType);
                  console.log('error is ', (dbResponse as DbErrorType).message);
        
        break;
      case RESPONSETYPE.taglist:
        setTagList((dbResponse as DbTagListType).value);
        break;
      case RESPONSETYPE[`tag${sequenceType}sequencelist`]:
        if (tagName != "") {
          setSequenceNameList((dbResponse as DbSequenceNamesType).value);
          setShowSequenceList(true);
        }
        break;
      default:
        console.log("tag not processing response", dbResponse.type);
    }
  }, [dbResponse]);

  function onAddClick() {
    fetchData(`/tag/${tagName}`, "POST", null, setDbResponse);
    setShowAdd(false);
    setTagName("");
  }

  function onListClick() {
    fetchData(`/tag`, "GET", null, setDbResponse);
  }

  function onDeleteTag(tagName: string) {
    fetchData(`/tag/${tagName}`, "DELETE", null, setDbResponse);
    setShowDelete("");
  }

  function onSequenceClick(name: string) {
    fetchData(`/${sequenceType}/${name}`, "GET", null, setDbResponse);
    setShowSequenceList(false);
  }

  // either request confirmation to delete the tag or request
  // the list of sequences for this tag
  // a tag can only be deleted if all of its sequence-use counts are zero
  function onTagSequenceClick(item: TagItem) {
    if (getTotalTagSequenceCount(item) == 0) {
      setShowDelete(item.name);
    } else if (getTagNameCount(item) != 0) {
      setTagName(item.name);
      fetchData(
        `/tag/sequences/${item.name}?type=${sequenceType}`,
        "GET",
        null,
        setDbResponse
      );
    }
  }

  function getTagClassName(item: TagItem): string {
    const total: number = getTotalTagSequenceCount(item);
    const count: number = item[`${sequenceType}_count`];
    if (count == 0)
      if (total == 0) return "deletebutton";
      else return "inactivebutton";
    return "listbutton";
  }

  function getTagNameCount(item: TagItem): number {
    const count: number = item[`${sequenceType}_count`];
    return count;
  }

  // count the total number of seqeunces using this tag
  function getTotalTagSequenceCount(item: TagItem): number {
    let total: number = 0;
    for (let i = 0; i < Attributes.length; i++) {
      const att: Attribute = Attributes[i];

      if (att != Attribute.none) {
        const count: number = item[`${att}_count`];
        total += count;
      }
    }
    return total;
  }
  return (
    <>
      <h1>Tags</h1>
      <Tooltip title={`Add Tag`}>
        <IconButton
          onClick={() => {
            setTagName("");
            setShowAdd(true);
          }}
        >
          <AddIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title={`List Tags`}>
        <IconButton
          onClick={()=>onListClick()}
        >
          <ListIcon fontSize="large" />
        </IconButton>
      </Tooltip>
      <br />
      {showAdd ? (
        <>
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.currentTarget.value)}
          />
          &nbsp;
          <a href="#" className="okbutton" onClick={() => onAddClick()}>
            OK
          </a>
          &nbsp;
          <a
            href="#"
            className="cancelbutton"
            onClick={() => setShowAdd(false)}
          >
            Cancel
          </a>
        </>
      ) : null}
      <hr />
      {tagList.map((item: TagItem) => (
        <>
          <a
            key={`tag-${item.name}`}
            className={getTagClassName(item)}
            onClick={() => {
              onTagSequenceClick(item);
            }}
            aria-disabled={
              getTotalTagSequenceCount(item) != 0 && getTagNameCount(item) == 0
            }
          >
            {`${item.name}(${getTagNameCount(item)})`}
          </a>
          <br />
        </>
      ))}
      {showDelete != "" ? (
        <div className="modal">
          <div className="modal-header">Confirm Tag Deletion</div>
          <div className="modal-body">
            {`Do you wish to delete the tag '${showDelete}'?`}
          </div>
          <div className="modal-footer">
            <button
              className="yesbutton"
              onClick={() => onDeleteTag(showDelete)}
            >
              Yes
            </button>
            <button className="nobutton" onClick={() => setShowDelete("")}>
              No
            </button>
          </div>
        </div>
      ) : null}
      {showSequenceList ? (
        <div className="modal">
          <div className="modal-header">{`List of ${toTitleCase(
            sequenceType
          )} Sequences for tag '${tagName}' `}</div>
          <div className="modal-body">
            {sequenceNameList.map((item: SequenceName) => (
              <>
                <a
                  className="editbutton"
                  href="#"
                  key={`sequence-${item.name}`}
                  onClick={() => onSequenceClick(item.name)}
                >
                  {item.name}
                </a>
                <br />
              </>
            ))}
          </div>
          <div className="modal-footer">
            <button
              className="okbutton"
              onClick={() => setShowSequenceList(false)}
            >
              Dismiss
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}
