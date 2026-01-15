import Ensemble from "classes/ensemble";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import React, {
  ChangeEvent,
  JSX,
  MouseEvent,
  useEffect,
  useState,
} from "react";
import fetchData from "utils/fetchdata";
import {
  DbErrorType,
  DbResponseType,
  EDITMODE,
  EnsembleType,
  RESPONSETYPE,
  VoiceType,
} from "../../types";

interface EnsembleDialogProps {
  ensemble: Ensemble;
  allEnsembles: EnsembleType[];
  allVoices: VoiceType[];
  setEnsemble: Function;
}

export default function EnsembleDialog(
  props: EnsembleDialogProps
): JSX.Element {
  const { ensemble, allVoices, allEnsembles, setEnsemble } = props;
  const { dbResponse, setDbResponse, editMode, setEditMode } =
    useEditorContext();
  const [formData, setFormData] = useState<Ensemble | null>(null);
  const [editMessages, setEditMessages] = useState<DbResponseType[]>([]);
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  // set the grid rows, row models, and columns based on the ensemble object
  useEffect(() => {
    const n: Ensemble = ensemble.copy();
    setFormData(n);
    setEditMessages([]);

    //Set selected for each of the voices in the ensemble
    const selectList: HTMLElement | null =
      document.getElementById("ensemblevoicelist");
    if (!selectList) return;
    const options: HTMLOptionsCollection = (selectList as HTMLSelectElement)
      .options;
    for (let i = 0; i < options.length; i++) {
      const value: string = options[i].value;
      const index: number = n.voices.findIndex((v) => v == value);
      options[i].selected = index >= 0;
    }
  }, [ensemble]);

  useEffect(() => {
    if (dbResponse.type == RESPONSETYPE.error)
      setEditMessages([
        {
          type: RESPONSETYPE.error,
          message: (dbResponse as DbErrorType).message,
        },
      ]);
  }, [dbResponse]);

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    event.stopPropagation();
    event.preventDefault();
    const eventName: string = event.currentTarget.name;
    const eventValue: string = event.currentTarget.value;
    setFormData((prev: Ensemble | null) => {
      let n: Ensemble = new Ensemble();
      if (prev) n = prev.copy();
      if (eventName == "name") {
        n.name = eventValue;
      } else if (eventName == "description") {
        n.description = eventValue;
      }
      return n;
    });
  };

  const handleListChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const options: HTMLOptionsCollection = event.target.options;
    const newList: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) newList.push(options[i].value);
    }
    setFormData((prev: Ensemble | null) => {
      let n: Ensemble = new Ensemble();
      if (prev) n = prev.copy();
      n.voices = newList;
      return n;
    });
  };

  const handleApply = () => {
    if (!formData) return;
    const e: DbErrorType[] = Ensemble.validate(formData, allEnsembles);
    if (e.length != 0) {
      setEditMessages(e);
      return;
    }

    // either add or modify the ensemble record
    let uri: string = `/ensemble/${formData.name}?`;
    uri += `description=${formData.description}&`;
    uri += `voices=${formData.voices.join(",")}`;
    fetchData(
      uri,
      editMode == EDITMODE.Add ? "POST" : "PUT",
      null,
      setDbResponse
    );
    quit();
  };
  const quit = () => {
    setEditMode(EDITMODE.None);
    setEnsemble(null);
  };
  const move = (event: MouseEvent<HTMLDivElement>) => {
    if (mouseDown) {
      const x: number = event.clientX;
      const y: number = event.clientY;
      const elem: HTMLElement | null = document.getElementById("dialog");
      if (!elem) return;
      elem.style.top = `${x}px`;
      elem.style.left = `${y}px`;
    }
  };
  return (
    // <div style={{position:'relative',top:'0%',left:'0%'}} id='dialog'>
    <>
      <div
        className="edit-header"
        onMouseDown={() => setMouseDown(true)}
        onMouseMove={(e) => move(e)}
        onMouseUp={() => setMouseDown(false)}
      >
        {`${editMode} Ensemble`}
      </div>
      <div className="edit-body">
        <label>
          Name:&nbsp;
          <input
            name="name"
            value={formData ? formData.name : ""}
            disabled={editMode == EDITMODE.Modify}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <br />
        <label>
          Description:&nbsp;
          <input
            name="description"
            value={formData ? formData.description : ""}
            onChange={(e) => handleChange(e)}
          />
        </label>
        <br />
        <label>
          Voices:&nbsp;&nbsp;&nbsp;
          <select
            name="voices"
            id="ensemblevoicelist"
            multiple
            size={allVoices.length}
            value={formData ? formData.voices : []}
            onChange={(e) => handleListChange(e)}
          >
            {allVoices.map((v) => (
              <option key={`voice-${v.name}`} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button type="button" onClick={handleApply}>
          {editMode}
        </button>
        <button className="cancelbutton" type="button" onClick={() => quit()}>
          Cancel
        </button>
      </div>
      <div className="edit-footer">
        {editMessages.map((em, i) => (
          <React.Fragment key={`errormessage-${i}`}>
            {(em as DbErrorType).message}
            <br />
          </React.Fragment>
        ))}
      </div>
    </>
  );
}
