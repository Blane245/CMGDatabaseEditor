import { GridColType } from "@mui/x-data-grid";

// the type that represent responses from the note_sequences database
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
}
// export enum FocusField {
//   "none" = "",
//   "note" = "note",
//   "speed" = "BPM",
//   "attack" = "attack",
//   "duration" = "duration",
//   "volume" = "volume",
//   "pan" = "pan",
// }
export enum EDITMODE {
  "None" = "None",
  "Add" = "Add",
  "Modify" = "Modify",
}
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
export type SequenceType = {
  id: string;
  name: string;
  items: string;
  tags: string;
};
export type DbSequenceType = {
  type: RESPONSETYPE;
  value: SequenceType;
};
export type DbSequenceListType = {
  type: RESPONSETYPE;
  value: SequenceName[];
};
export type DbResponseType =
  | DbErrorType
  | DbTagListType
  | DbSequenceNamesType
  | DbSequenceListType
  | DbSequenceType
  | MessageType;

// type for messages on the UI
export type MessageType = {
  type: RESPONSETYPE;
  message: string;
};

export type AttributeProperty = {
  name: string;
  dataType: GridColType;
  title: string;
  units: string;
  min: number;
  max: number;
};
// export type ItemProperties = {
//   type: Attribute;
//   name: string;
//   attributes: AttributeProperty[];
// };
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
export type ErrorMessage = string;
export type ErrorMessages = ErrorMessage[];
