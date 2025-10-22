// delete a named sequence after user confirmation
import { useEditorContext } from "CMGSequenceEditorContext";
import { JSX } from "react";
import { RESPONSETYPE } from "types";
import fetchData from "utils/fetchdata";
import toTitleCase from "utils/totitlecase";

interface SequenceDeleteProps {
  setName: Function;
  name: string;
}

export function SequenceDelete(props: SequenceDeleteProps): JSX.Element {
  const { name, setName } = props;
  const { sequenceType, setDbResponse, setMessage } = useEditorContext();

  // delete the sequence
  const onDeleteSequence = (name: string): void => {
    fetchData(`/${sequenceType}/${name}`, "DELETE", null, setDbResponse);
  };
  function onCancel() {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setName("");
  }

  return (
    <div className="modal">
      <div className="modal-header">{`Confirm ${toTitleCase(
        sequenceType
      )} Sequence Deletion`}</div>
      <div className="modal-body">
        {`Do you wish to delete the ${toTitleCase(
          sequenceType
        )} sequence '${name}'?`}
      </div>
      <div className="modal-footer">
        <button
          className="yesbutton"
          onClick={() => onDeleteSequence(name)}
        >
          Yes
        </button>
        <button className="nobutton" onClick={() => onCancel ()}>
          No
        </button>
      </div>
    </div>
  );
}
