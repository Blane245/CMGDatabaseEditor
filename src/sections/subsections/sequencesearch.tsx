// perform a search of the sequences from a user-supplied list of tags

import { useEditorContext } from "CMGSequenceEditorContext";
import { JSX, useEffect, useState } from "react";
import {
  DbSequenceListType,
  EDITMODE,
  RESPONSETYPE,
  SequenceName,
} from "types";
import fetchData from "utils/fetchdata";
import { matchWildCard } from "utils/matchwildcard";
import toTitleCase from "utils/totitlecase";

// and/or wild-card version of the name
interface SequenceListProps {
  setShowSearch: Function;
}

export function SequenceSearch(props: SequenceListProps): JSX.Element {
  const { setShowSearch } = props;
  const { sequenceType, dbResponse, setDbResponse, setMessage, setMode } =
    useEditorContext();
  const [searchTags, setSearchTags] = useState<string>("");
  const [namePattern, setNamePattern] = useState<string>("");
  const [showSearchList, setShowSearchList] = useState<boolean>(false);
  const [sequenceSearchList, setSequenceSearchList] = useState<SequenceName[]>(
    []
  );

  // handle responses from the database for searches
  useEffect(() => {
    setMessage({ type: RESPONSETYPE.info, message: "" });
    console.log(`${sequenceType} search received response`, dbResponse.type);
    if (dbResponse.type == RESPONSETYPE[`${sequenceType}sequencesearchlist`]) {
      // refine the search list by the name pattern, if specified
      const searchList: SequenceName[] =
        namePattern == ""
          ? (dbResponse as DbSequenceListType).value
          : (dbResponse as DbSequenceListType).value.filter(
              (sn: SequenceName) => matchWildCard(sn.name, namePattern)
            );
      setSequenceSearchList(searchList);
      setShowSearchList(true);
      // clear the dbresponse
      setDbResponse({type: RESPONSETYPE.info, message:''});
    }
  }, [dbResponse]);

  useEffect (()=> {
    setMessage({ type: RESPONSETYPE.info, message: "" });
    setNamePattern('');
    setSearchTags('');
  },[]);

  const onSearchOKClick = (): void => {
    fetchData(
      `/${sequenceType}/search/?tags=${searchTags}`,
      "GET",
      null,
      setDbResponse
    );
  };

  // request the sequence by name and enter modify mode when a sequence is clicked in the search list
  const onSequenceSearchClick = (name: string): void => {
    setShowSearchList(false);
    setShowSearch(false);
    setMode(EDITMODE.None);
    fetchData(`/${sequenceType}/${name}`, "GET", null, setDbResponse);
  };

  const onDismissSearchList = (): void => {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setShowSearch(false);
    setShowSearchList(false);
    setSearchTags("");
  };

  return (
    <>
      <div className="showsearch">
        <label>
          Tags List:&nbsp;
          <input
            type="text"
            name="searchtags"
            value={searchTags}
            onChange={(e) => setSearchTags(e.currentTarget.value)}
          />
        </label>
        <br />
        <label>
          Sequence Name Pattern:&nbsp;
          <input
            type="text"
            name="namePattern"
            value={namePattern}
            onChange={(e) => setNamePattern(e.currentTarget.value)}
          />
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
            setNamePattern("");
          }}
        >
          Cancel
        </a>
      </div>
      {!!showSearchList && (
        <div className="modal">
          <div className="modal-header">
            {`${toTitleCase(
              sequenceType
            )} sequences with tags ${searchTags} and name pattern ${namePattern}`}
          </div>
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
            <button className="okbutton" onClick={() => onDismissSearchList()}>
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
