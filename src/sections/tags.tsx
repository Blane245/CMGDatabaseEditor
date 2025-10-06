import { JSX, useEffect, useState } from "react";
import fetchData from "../utils/fetchdata";
import { DbErrorType, DbResponseType, DbSequenceListType, DbSequenceNamesType, DbTagListType, MessageType, RESPONSETYPE, SequenceName, TagItem } from "../types";
interface TagsProps {
  setMessage: Function;
  dbResponse: DbResponseType;
  setDbResponse: Function;
}
export default function Tags(props: TagsProps): JSX.Element {
  const { setMessage, dbResponse, setDbResponse } = props;
  const [showAdd, setShowAdd] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<string>("");
  const [tagName, setTagName] = useState<string>("");
  const [tagList, setTagList] = useState<TagItem[]>([]);
  const [sequenceNameList, setSequenceNameList] = useState<SequenceName[]>([]);
  const [showSequenceList, setShowSequenceList] = useState<boolean>(false);

    // on startup show the tag list
    useEffect(() => {
          fetchData(`/tags`, "GET", null, setDbResponse);
    },[]);
  
  // when a response arrives from the database take the apporpriate action
  useEffect(() => {
    console.log('tag received response', dbResponse.type);
    switch (dbResponse.type) {
      case RESPONSETYPE.error:
        setMessage(dbResponse as MessageType);
        break;
      case RESPONSETYPE.taglist:
        setTagList((dbResponse as DbTagListType).value);
        break;
      case RESPONSETYPE.tagsequencelist:
        if (tagName != "") {
          setSequenceNameList((dbResponse as DbSequenceNamesType).value);
          setShowSequenceList(true);
        }
        break;
      default:
        console.log('tag not processing response', dbResponse.type);
    }
  }, [dbResponse]);

  function onAddClick() {
    fetchData(`/tag/${tagName}`, "POST", null, setDbResponse);
    setShowAdd(false);
    setTagName('');
  }

  function onListClick() {
    fetchData(`/tags`, "GET", null, setDbResponse);
  }

  function onTagSequencesClick(item: TagItem): void {
    if (item.count == 0) setShowDelete(item.name);
    else {
      setTagName(item.name);
      fetchData(`/tag/sequences/${item.name}`, 'GET', null, setDbResponse);
    }
  }

  function onDeleteTag(tagName: string) {
    fetchData(`/tag/${tagName}`, "DELETE", null, setDbResponse);
    setShowDelete("");
  }

  function onSequenceClick(name: string) {
    fetchData(`/sequence/${name}`, "GET", null, setDbResponse);
    setShowSequenceList(false)
  }

  return (
    <>
      <h1>Tags</h1>
      <a href="#"
       className="addbutton" 
       onClick={() => { setTagName (''); setShowAdd(true)}}
       >
        Add Tag
      </a>
      {showAdd ? (
        <>
          <input
            type="text"
            value={tagName}
            onChange={(e) => setTagName(e.currentTarget.value)}
          />
          &nbsp;
          <a href="#" className='okbutton' onClick={() => onAddClick()}>OK</a>
          &nbsp;
          <a href="#" className='cancelbutton' onClick={() => setShowAdd(false)}>Cancel</a>
        </>
      ) : null}
      <br />
      <a href="#" className="listbutton" onClick={() => onListClick()}>
        List Tags
      </a>
      <hr />
      {tagList.map((item: TagItem) => (
        <>
          <a href="#"
            className={item.count == 0 ? "deletebutton" : "listbutton"}
            onClick={() => onTagSequencesClick(item)}
            key={`deletetag-${item.name}`}
          >
            {item.name + "(" + item.count + ")"}
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
      {showSequenceList?
      <div className="modal">
        <div className="modal-header">{`List of Note Sequences for tag '${tagName}' `}</div>
        <div className="modal-body">
          {sequenceNameList.map((item:SequenceName) => (
            <a
            className="editbutton" 
            href="#" 
            key={`sequence-${item.name}`} 
            onClick={()=> onSequenceClick(item.name)}>
              {item.name}
              </a>  
          ))}
        </div>
        <div className="modal-footer">
          <button className="okbutton" onClick={()=>setShowSequenceList(false)}>Dismiss</button>
        </div>
      </div>
      :null}
    </>
  );
}
