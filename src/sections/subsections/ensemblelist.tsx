import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton, Tooltip } from "@mui/material";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import { JSX, useState } from "react";
import { EDITMODE, EnsembleType, RESPONSETYPE } from "types";
import fetchData from "utils/fetchdata";
import { EnsembleDelete } from "./ensembledelete";

interface EnsembleListProps {
  list: EnsembleType[];
}

export function EnsembleList(props: EnsembleListProps): JSX.Element {
  const { list: ensembleList } = props;
  const { setEditMode, setDbResponse, setMessage } = useEditorContext();
  const [deleteName, setDeleteName] = useState<string>("");

  function onEnsembleEditClick(name: string): void {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setEditMode(EDITMODE.Modify);
    fetchData(`/ensemble/${name}`, "GET", null, setDbResponse);
  }

  function onEnsembleDeleteClick(name: string): void {
    setMessage({
      type: RESPONSETYPE.info,
      message: "",
    });
    setDeleteName(name);
  }

  return (
    <>
    <table>
      <thead>
        <tr>
          <th style={{color:'red'}}>Delete</th>
          <th>Name</th>
          <th>Description</th>
          <th>Voices</th>
        </tr>
      </thead>
      <tbody>
        {ensembleList.map((ensemble: EnsembleType) => (
            <tr key={`ensemble-${ensemble.name}`}>
              <td>
                <Tooltip title={`Delete ${ensemble.name}`}>
                  <IconButton className="deletebutton"
                    onClick={() => onEnsembleDeleteClick(ensemble.name)}
                  >
                    <DeleteIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              </td>
              <td>
                <a
                  href="#"
                  className="editbutton"
                  onClick={() => onEnsembleEditClick(ensemble.name)}
                >
                  {ensemble.name}
                </a>
              </td>
              <td>{ensemble.description}</td>
              <td>{ensemble.voices}</td>
            </tr>
        ))}
      </tbody>
    </table>
    {!!(deleteName != '') &&
    <EnsembleDelete name={deleteName} setName={setDeleteName}/>
    }
    </>
  );
}
