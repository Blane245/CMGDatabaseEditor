// duplicate a sequence to the current or new sequencetype
// the new sequence type list should be displayed
import { useEditorContext } from "CMGdatabaseeditorcontext";
import { JSX, useEffect, useState } from "react";
import {
  Attribute,
  Attributes,
  DbSequenceNamesType,
  MessageType,
  RESPONSETYPE,
  SequenceName,
} from "types";
import fetchData from "utils/fetchdata";
import toTitleCase from "utils/totitlecase";

interface SequenceDuplicateProps {
  setName: Function;
  name: string;
  sequenceList: SequenceName[]; // of the current sequence type
}

export function SequenceDuplicate(props: SequenceDuplicateProps): JSX.Element {
  const { name, setName, sequenceList } = props;
  const { sequenceType, setSequenceType, dbResponse, setDbResponse, setMessage } =
    useEditorContext();
  const [newSequenceName, setNewSequenceName] = useState<string>(name);
  const [newSequenceType, setNewSequenceType] = useState<Attribute | null>(
    null
  );
  const [copyTags, setCopyTags] = useState<boolean>(true);
  const [editMessage, setEditMessage] = useState<MessageType>({
    type: RESPONSETYPE.info,
    message: "",
  });

  // initialize the new sequence type to the current one by default
  useEffect(() => {
      setMessage({
        type: RESPONSETYPE.info,
        message: '',
      });
      setEditMessage({
        type: RESPONSETYPE.info,
        message: '',
      });
    setNewSequenceType(sequenceType);
  }, [sequenceType]);

  // when a new sequence list comes in, validate the sequence name as
  // unique and then perform the duplication
  useEffect(() => {
    console.log(`${sequenceType} duplicate received response`, dbResponse.type);
    if (dbResponse.type != `${newSequenceType}sequencenamelist`) return;

    if (
      (dbResponse as DbSequenceNamesType).value.findIndex(
        (s: SequenceName) => s.name == newSequenceName
      ) >= 0
    ) {
      setEditMessage({
        type: RESPONSETYPE.error,
        message: `A ${toTitleCase(
          newSequenceType as string
        )} sequence with name '${newSequenceName}' already exists`,
      });
      return;
    } else {
      // issue the request to duplicate the sequence. response should be a new sequence list
      setMessage({
        type: RESPONSETYPE.info,
        message: '',
      });
      setEditMessage({
        type: RESPONSETYPE.info,
        message: '',
      });
      fetchData(
        `/${sequenceType}/duplicate/${name}?newname=${newSequenceName}&newtype=${newSequenceType}&copytags=${copyTags}`,
        "PUT",
        null,
        setDbResponse
      );

      // update the sequence type to the new one
      setSequenceType(newSequenceType as Attribute);
      setName('');
    }
  }, [dbResponse]);

  // rename the sequence
  function onDuplicateSequence() {
    // If the newsequencetype is not the current one, request to have it loaded
    // so the new sequence name can be checked for uniqueness, then handle the
    // check and update in the effect trigger
    if (sequenceType == newSequenceType) {
      if (
        sequenceList.findIndex(
          (s: SequenceName) => s.name == newSequenceName
        ) >= 0
      ) {
        setEditMessage({
          type: RESPONSETYPE.error,
          message: `A ${toTitleCase(
            sequenceType
          )} sequence with name '${newSequenceName}' already exists`,
        });
        return;
      } else {
        // issue the request to duplicate the sequence. response should be a new sequence list
        fetchData(
          `/${sequenceType}/duplicate/${name}?newname=${newSequenceName}&newtype=${newSequenceType}&copytags=${copyTags}`,
          "PUT",
          null,
          setDbResponse
        );
      }
    } else {
      // the new sequence type is different from current one
      // request the new sequence list
      fetchData(`/${newSequenceType}`, "GET", null, setDbResponse);
    }
    setName('');
  }

  return (
    <div className="modal">
      <div className="modal-header">
      <p>{`Provide New Sequence Name and New Sequence Type`}</p>
      <p>{`Select Whether to Copy Tags`}</p>
      </div>
      <div className="modal-body">
        <label>
          {`New Sequence Name: `}
          <input
            type="text"
            value={newSequenceName}
            onChange={(e) => setNewSequenceName(e.target.value)}
          />
        </label>
        <br />
        <label>
          {`New Sequence Type: `}
          <select
            name="sequencetype"
            value={newSequenceType as string}
            onChange={(e) => setNewSequenceType(e.target.value as Attribute)}
          >
            {Attributes.map((a) => (
              <option key={`type-${a}`} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          {`Copy Tags?`}
          <input
            name={"copytags"}
            type={"checkbox"}
            checked={copyTags}
            onChange={(e) => setCopyTags(e.target.checked)}
          />
        </label>
      </div>
      <div className="modal-footer">
        <button className="submitbutton" onClick={() => onDuplicateSequence()}>
          Submit
        </button>
        <button className="cancelbutton" onClick={() => setName("")}>
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
  );
}
