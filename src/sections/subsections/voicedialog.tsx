import Voice from "classes/voice";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import React, { ChangeEvent, JSX, useEffect, useState } from "react";
import fetchData from "utils/fetchdata";
import {
  DbErrorType,
  DbResponseType,
  EDITMODE,
  RESPONSETYPE,
  VoiceType,
} from "../../types";

interface VoiceDialogProps {
  voice: Voice;
  allVoices: VoiceType[];
  setVoice: Function;
}

export default function VoiceDialog(props: VoiceDialogProps): JSX.Element {
  const { voice, allVoices, setVoice } = props;
  const { editMode, setEditMode} = useEditorContext();
  const { dbResponse, setDbResponse } = useEditorContext();
  const [formData, setFormData] = useState<Voice | null>(null);
  const [editMessages, setEditMessages] = useState<DbResponseType[]>([]);

  // set the grid rows, row models, and columns based on the voice object
  useEffect(() => {
    setFormData(voice.copy());
    setEditMessages([]);
  }, [voice]);

  useEffect(() => {
    if (dbResponse.type == RESPONSETYPE.error)
      setEditMessages([
        {
          type: RESPONSETYPE.error,
          message: (dbResponse as DbErrorType).message,
        },
      ]);
  }, [dbResponse]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    event.stopPropagation();
    event.preventDefault();
    const eventName: string = event.currentTarget.name;
    const eventValue: string = event.currentTarget.value;
    setFormData((prev: Voice | null) => {
      let n: Voice = new Voice();
      if (prev) n = prev.copy();
      switch (eventName) {
        case "name":
          n.name = eventValue;
          break;
        case "description":
          n.description = eventValue;
          break;
        case "duration":
          n.duration = parseFloat(eventValue);
          break;
        case "intervalMean":
          n.intervalMean = parseFloat(eventValue);
          break;
        case "noiseAmplitude":
          n.noiseAmplitude = parseFloat(eventValue);
          break;
        case "noiseFrequency":
          n.noiseFrequency = parseFloat(eventValue);
          break;
        case "registerHi":
          n.registerHi = parseFloat(eventValue);
          break;
        case "registerLo":
          n.registerLo = parseFloat(eventValue);
          break;
        case "timbre":
          n.timbre = eventValue;
          break;
      }
      return n;
    });
  };

  const handleTimbreChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const option: string = event.currentTarget.selectedOptions[0].value;
    setFormData((prev) => {
      if (!prev) return prev;
      const n: Voice = prev.copy();
      n.timbre = option;
      return n;
    });
  };

  const handleApply = () => {
    if (!formData) return;
    const e: DbErrorType[] = Voice.validate(formData, allVoices);
    if (e.length != 0) {
      setEditMessages(e);
      return;
    }

    // either add or modify the voice record
    let uri: string = `/voice/${formData.name}?`;
    uri+=`description=${formData.description}`;
    uri+=`&timbre=${formData.timbre}`
    uri+=`&duration=${formData.duration}`;
    uri+=`&intervalMean=${formData.intervalMean}`;
    uri+=`&noiseAmplitude=${formData.noiseAmplitude}`;
    uri+=`&noiseFrequency=${formData.noiseFrequency}`;
    uri+=`&registerHi=${formData.registerHi}`;
    uri+=`&registerLo=${formData.registerLo}`;
    fetchData(uri, editMode == EDITMODE.Add ? "POST" : "PUT", null, setDbResponse);
    quit();
  };

  const quit = () => {setEditMode(EDITMODE.None); setVoice(null);}

  return (
    <>
      <div className="edit-header">{`${editMode} Voice`}</div>
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
          Timbre:&nbsp;
          <select
            name="timbre"
            value={formData ? formData.timbre : ""}
            onChange={(e) => handleTimbreChange(e)}
          >
            <option value={"glissando"}>glissando</option>
            <option value={"sustained"}>sustained</option>
          </select>
        </label>
        <br />
        <label>
          Interval Mean (sec):&nbsp;
          <input
            name="intervalMean"
            value={formData ? formData.intervalMean : ""}
            onChange={(e) => handleChange(e)}
            min={0}
          />
        </label>
        <br />
        <label>
          Register (midi) Lo:&nbsp;
          <input
            name="registerLo"
            value={formData ? formData.registerLo : ""}
            onChange={(e) => handleChange(e)}
            min={0}
          />
        </label>
        <label>
          &nbsp;Hi:&nbsp;
          <input
            name="registerHi"
            value={formData ? formData.registerHi : ""}
            onChange={(e) => handleChange(e)}
            min={0}
          />
        </label>
        <br />
        <label>
          Duration (sec):&nbsp;
          <input
            name="duration"
            value={formData ? formData.duration : ""}
            onChange={(e) => handleChange(e)}
            min={0}
          />
        </label>
        <br />
        <label>
          Noise Frequency (Hz):&nbsp;
          <input
            name="noiseFrequency"
            value={formData ? formData.noiseFrequency : ""}
            onChange={(e) => handleChange(e)}
            min={0}
          />
        </label>
        <label>
          &nbsp;Amplitude (dB):&nbsp;
          <input
            name="noiseAmplitude"
            value={formData ? formData.noiseAmplitude : ""}
            onChange={(e) => handleChange(e)}
            min={0}
          />
        </label>
        <br />
        <button type="button" onClick={handleApply}>
          {editMode}
        </button>
        <button
          className="cancelbutton"
          type="button"
          onClick={() => quit()}
        >
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
