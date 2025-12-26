// rename a sequence
import { useEditorContext } from "CMGdatabaseeditorcontext";
import { JSX, useState } from "react";
import { MessageType, RESPONSETYPE, SequenceName } from "types";
import fetchData from "utils/fetchdata";
import toTitleCase from "utils/totitlecase";

interface SequenceRenameProps {
  setName: Function;
  name: string;
  sequenceList: SequenceName[];
}

export function SequenceRename(props: SequenceRenameProps): JSX.Element {
  const { name, setName, sequenceList } = props;
  const { sequenceType, setDbResponse, setMessage } = useEditorContext();
  const [newSequenceName, setNewSequenceName] = useState<string>("");
  const [editMessage, setEditMessage] = useState<MessageType>({
    type: RESPONSETYPE.info,
    message: "",
  });

  // rename the sequence
  function onRenameSequence() {
    // check that the new name is unique
    if (
      sequenceList.findIndex((s: SequenceName) => s.name == newSequenceName) >=
      0
    ) {
      setEditMessage({
        type: RESPONSETYPE.error,
        message: `A ${toTitleCase(
          sequenceType
        )} sequence with name '${newSequenceName}' already exists`,
      });
      return;
    }
    // issue the request to rename the sequence. response should be a new sequence list
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setEditMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    fetchData(
      `/${sequenceType}/rename/${name}?newname=${newSequenceName}`,
      "PUT",
      null,
      setDbResponse
    );
    setName('');
  }

  function onCancel() {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setName("");
  }

  return (
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
        <button className="submitbutton" onClick={() => onRenameSequence()}>
          Submit
        </button>
        <button className="cancelbutton" onClick={() => onCancel()}>
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
