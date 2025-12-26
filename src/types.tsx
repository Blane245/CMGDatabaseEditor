import { GridColType } from "@mui/x-data-grid";

/**
 * type to partition editing dialog
 */
export enum PARTITIONTYPE {
  'none' = 'none,',
  'ensemble' = 'ensemble',
  'sequencer' ='sequencer'
}
/**
 * Types matching the database table element structures
 */
export type EnsembleType = {
    name: string;
    description: string;
    voices: string;

}

export type VoiceType = {
    name: string;
    description: string;
    timbre: string;
      registerLo: number;
  registerHi: number;
  intervalMean: number;
  duration: number;
  noiseFrequency: number;
  noiseAmplitude: number;
}

export type EnsembleVoiceType = {
  ensemble_name: string;
  voice_name: string;
}

export type SequenceType = {
  id: string;
  name: string;
  items: string;
  tags: string;
};

export type TagType = {
  name: string;
}

export type SequenceTagType = {
  sequence_name: string;
  sequence_type: string;
  tag_name: string;
}

/**
 * The type representing the responses from the CMG database server
 */
export enum RESPONSETYPE {
  "error" = "error",
  "info" = "info",
  "notesequencenamelist" = "notesequencenamelist",
  "speedsequencenamelist" = "speedsequencenamelist",
  "attacksequencenamelist" = "attacksequencenamelist",
  "durationsequencenamelist" = "durationsequencenamelist",
  "volumesequencenamelist" = "volumesequencenamelist",
  "pansequencenamelist" = "pansequencenamelist",
  "tagnotesequencelist" = "tagnotesequencelist",
  "tagspeedsequencelist" = "tagspeedsequencelist",
  "tagattacksequencelist" = "tagattacksequencelist",
  "tagdurationsequencelist" = "tagdurationsequencelist",
  "tagvolumesequencelist" = "tagvolumesequencelist",
  "tagpansequencelist" = "tagpansequencelist",
  "taglist" = "taglist",
  "notesequencevalue" = "notesequencevalue",
  "speedsequencevalue" = "speedsequencevalue",
  "attacksequencevalue" = "attacksequencevalue",
  "durationequencevalue" = "durationequencevalue",
  "volumesequencevalue" = "volumesequencevalue",
  "pansequencevalue" = "pansequencevalue",
  "notesequencelist" = "notesequencelist",
  "speedsequencelist" = "speedsequencelist",
  "attacksequencelist" = "attacksequencelist",
  "durationsequencelist" = "durationsequencelist",
  "volumesequencelist" = "volumesequencelist",
  "pansequencelist" = "pansequencelist",
  "notesequencesearchlist" = "notesequencesearchlist",
  "speedsequencesearchlist" = "speedsequencesearchlist",
  "attacksequencesearchlist" = "attacksequencesearchlist",
  "durationsequencesearchlist" = "durationsequencesearchlist",
  "volumesequencesearchlist" = "volumesequencesearchlist",
  "pansequencesearchlist" = "pansequencesearchlist",
  "ensemblelist" = "ensemblelist",
  "ensemble" = "ensemble",
  "voicelist" = "voicelist",
  "voice" = "voice",
}

export enum EDITMODE {
  "None" = "None",
  "Add" = "Add",
  "Modify" = "Modify",
}

/**
 * database response structures
 */
export type DbErrorType = {
  type: RESPONSETYPE;
  message: string;
};

export type TagItem = {
  name: string;
  note_count: number;
  speed_count: number;
  attack_count: number;
  duration_count: number;
  volume_count: number;
  pan_count: number;
};

export type DbTagListType = {
  type: RESPONSETYPE;
  value: TagItem[];
};

export type SequenceName = {
  name: string;
};

export type DbSequenceNamesType = {
  type: RESPONSETYPE;
  value: SequenceName[];
};

export type DbSequenceType = {
  type: RESPONSETYPE;
  value: SequenceType;
};

export type DbSequenceListType = {
  type: RESPONSETYPE;
  value: SequenceName[];
};

export type DbEnsembleListType = {
  type: RESPONSETYPE;
  value: EnsembleType[];
};

export type DbEnsembleType = {
  type: RESPONSETYPE;
  value: EnsembleType;
};

export type DbVoiceListType = {
  type: RESPONSETYPE;
  value: VoiceType[];
};
export type DbVoiceType = {
  type: RESPONSETYPE;
  value: VoiceType;
};

// type for messages on the UI
export type MessageType = {
  type: RESPONSETYPE;
  message: string;
};

export type DbResponseType =
  | DbErrorType
  | DbTagListType
  | DbSequenceNamesType
  | DbSequenceListType
  | DbSequenceType
  | DbEnsembleListType
  | DbEnsembleType
  | DbVoiceListType
  | DbVoiceType
  | MessageType;

/**
 * structures for sequence editing UI
 */
  export type AttributeProperty = {
  name: string;
  dataType: GridColType;
  title: string;
  units: string;
  min: number;
  max: number;
};

export enum Attribute {
  "none" = "none",
  "note" = "note",
  "speed" = "speed",
  "attack" = "attack",
  "duration" = "duration",
  "volume" = "volume",
  "pan" = "pan",
}

export const Attributes: Attribute[] = [
  Attribute.none,
  Attribute.note,
  Attribute.speed,
  Attribute.attack,
  Attribute.duration,
  Attribute.volume,
  Attribute.pan,
];

export const itemProperties: Record<Attribute, AttributeProperty[]> = {
  none: [
    { name: "value", title: "", units: "", min: 0, max: 0, dataType: "string" },
    { name: "beats", title: "", units: "", min: 0, max: 0, dataType: "string" },
  ],
  note: [
    {
      name: "value",
      title: "Note",
      units: "",
      min: 0,
      max: 127,
      dataType: "string",
    },
    {
      name: "beats",
      title: "Beats",
      units: "(0, 1000]",
      min: Number.EPSILON,
      max: 1000,
      dataType: "number",
    },
  ],
  speed: [
    {
      name: "value",
      title: "BPM",
      units: "(0,1000]",
      min: Number.EPSILON,
      max: 1000,
      dataType: "number",
    },
    {
      name: "beats",
      title: "Beats",
      units: "(0, 1000]",
      min: Number.EPSILON,
      max: 1000,
      dataType: "number",
    },
  ],
  attack: [
    {
      name: "value",
      title: "Attack",
      units: "[0,127]",
      min: 0,
      max: 127,
      dataType: "number",
    },
    {
      name: "beats",
      title: "Beats",
      units: "(0, 1000]",
      min: Number.EPSILON,
      max: 1000,
      dataType: "number",
    },
  ],
  duration: [
    {
      name: "value",
      title: "Duration",
      units: "(0,100]%",
      min: Number.EPSILON,
      max: 100,
      dataType: "number",
    },
    {
      name: "beats",
      title: "Beats",
      units: "(0, 1000]",
      min: Number.EPSILON,
      max: 1000,
      dataType: "number",
    },
  ],
  volume: [
    {
      name: "value",
      title: "Volume",
      units: "[-10,+10] dB",
      min: -10,
      max: 10,
      dataType: "number",
    },
    {
      name: "beats",
      title: "Beats",
      units: "(0, 1000]",
      min: Number.EPSILON,
      max: 1000,
      dataType: "number",
    },
  ],
  pan: [
    {
      name: "value",
      title: "Pan",
      units: "[-1,+1]",
      min: -1,
      max: 1,
      dataType: "number",
    },
    {
      name: "beats",
      title: "Beats",
      units: "(0, 1000]",
      min: Number.EPSILON,
      max: 1000,
      dataType: "number",
    },
  ],
};
export type EditItem = {
  id: string;
  value: number | string;
  beats: number;
}

/**
 * UI Error messages
 */
export type ErrorMessage = string;
export type ErrorMessages = ErrorMessage[];
