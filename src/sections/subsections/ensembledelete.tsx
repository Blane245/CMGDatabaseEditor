// delete a named ensemble after user confirmation
import { useEditorContext } from "CMGdatabaseeditorcontext";
import { JSX } from "react";
import { RESPONSETYPE } from "types";
import fetchData from "utils/fetchdata";

interface DeleteProps {
  setName: Function;
  name: string;
}

export function EnsembleDelete(props: DeleteProps): JSX.Element {
  const { name, setName } = props;
  const { setDbResponse, setMessage } = useEditorContext();

  // delete the ensemble
  const onDelete = (name: string): void => {
    fetchData(`/ensemble/${name}`, "DELETE", null, setDbResponse);
    setName("");
  };
  function onCancel() {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setName("");
  }

  return (
    <>
    <div className="modal">
      <div className="modal-header">Confirm Ensemble Deletion</div>
      <div className="modal-body">
        {`Do you wish to delete the '${name}' ensemble`}
      </div>
      <div className="modal-footer">
        <button
          className="yesbutton"
          onClick={() => onDelete(name)}
        >
          Yes
        </button>
        <button className="nobutton" onClick={() => onCancel ()}>
          No
        </button>
      </div>
    </div>
    {}
    </>
  );
}
