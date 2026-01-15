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
import { toNote } from "utils/tonote";
import { bankPresettoName, presetNameToPreset } from "sfcomponents/util";
import { Preset } from "sfcomponents/types";
import { SFPool } from "sfcomponents/sfpool";
import { SoundFont2 } from "soundfont2";

interface VoiceDialogProps {
  voice: Voice;
  allVoices: VoiceType[];
  setVoice: Function;
}
  type SFDataType = {
    soundFont: SoundFont2 | undefined;
    presets: Preset[];
    preset: Preset | undefined;
    presetName: string;
  };

export default function VoiceDialog(props: VoiceDialogProps): JSX.Element {
  const { voice, allVoices, setVoice } = props;
  const { editMode, setEditMode, SFFileList} = useEditorContext();
  const { dbResponse, setDbResponse } = useEditorContext();
  const [formData, setFormData] = useState<Voice | null>(null);
  const [editMessages, setEditMessages] = useState<DbResponseType[]>([]);
  const [presets, setPresets] = useState<Preset[]> ([]);
    const [soundFontData, setSoundFontData] = useState<SFDataType>({
    soundFont: undefined,
    presets: [],
    preset: undefined,
    presetName: "",
  });


  // set the grid rows, row models, and columns based on the voice object
  useEffect(() => {
    setFormData(voice);
    loadSoundFontandUpdate(voice.soundFontFile);
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

  useEffect(()=> {
    setPresets(soundFontData.presets);
  }, [soundFontData]);

    function loadSoundFontandUpdate(fileName: string) {
    try {
      LoadFile(fileName);
      // load the soundfont file and set the presets
      async function LoadFile(fileName: string) {
        const { soundFont } = await SFPool(fileName);
        setSoundFontData(() => {
          const presets: Preset[] = (soundFont.presets as Preset[]).sort(
            (a, b) => {
              if (a.header.bank < b.header.bank) return -1;
              if (a.header.bank > b.header.bank) return 1;
              return a.header.preset - b.header.preset;
            }
          );
          const preset: Preset = presets[0] as Preset;
          const presetName: string = bankPresettoName(preset);
          const newSoundFontData: SFDataType = {
            soundFont: soundFont,
            presets: presets,
            preset: preset,
            presetName: presetName,
          };
          return newSoundFontData;
        });
      }
    } catch (e: any) {
      setEditMessages([{type: RESPONSETYPE.error, message: e }]);
    }
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
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
        case "soundFontFile" :
          n.soundFontFile = eventValue;
          loadSoundFontandUpdate(eventValue);
          n.presetName = '';
          n.preset = undefined;
          break;
        case "presetName" :
          n.presetName = eventValue;
          const {preset} = presetNameToPreset(n.presetName, presets);
          n.preset = preset;
          break;
        case "duration":
          n.duration = parseFloat(eventValue);
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
    uri+=`&soundFontFile=${formData.soundFontFile}`;
    uri+=`&presetName=${formData.presetName}`;
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
          Soundfont File:&nbsp;
          <select
            name="soundFontFile"
            onChange={(e) => handleChange(e)}
            value={formData ? formData.soundFontFile : ""}
          >
            <option key="SF-none" value="None">
              &nbsp;
            </option>
            {SFFileList.map((p) => {
              return (
                <option key={`SF-${p}`} value={p}>
                  {p}
                </option>
              );
            })}
          </select>
        </label>
        <br />
        <label>
          &nbsp;Preset:&nbsp;
          <select
            name="presetName"
            onChange={(e) => handleChange(e)}
            value={formData ? formData.presetName : ""}
          >
            <option key="preset-none" value="None">
              &nbsp;
            </option>
            {presets.map((p) => {
              return (
                <option key={`preset-${p.header.name}`} value={bankPresettoName(p)}>
                  {bankPresettoName(p)}
                </option>
              );
            })}
          </select>
        </label>
        <br />
        <label>
          Timbre:&nbsp;
          <select
            name="timbre"
            value={formData ? formData.timbre : ""}
            onChange={(e) => handleChange(e)}
          >
            <option value={"glissando"}>glissando</option>
            <option value={"sustained"}>sustained</option>
          </select>
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
          <span>&nbsp;{formData? toNote(formData?.registerLo):''}</span>
        </label>
        <label>
          &nbsp;Hi:&nbsp;
          <input
            name="registerHi"
            value={formData ? formData.registerHi : ""}
            onChange={(e) => handleChange(e)}
            min={0}
          />
          <span>&nbsp;{formData? toNote(formData?.registerHi):''}</span>
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
