import { GridColDef, GridColType } from "@mui/x-data-grid";

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
export enum Attribute {
  'none' = 'none',
  'note' = 'note',
  'speed' = 'speed',
  'attack' = 'attack',
  'duration' = 'duration',
  'volume' = 'volume',
  'pan' = 'pan',
}
export const Attributes: Attribute[] = [Attribute.none,Attribute.note, Attribute.speed, Attribute.attack, Attribute.duration, Attribute.volume, Attribute.pan];
export enum FocusField {
  'none' = '',
  'note' = 'note',
  'speed' = 'BPM',
  'attack' = 'attack',
  'duration' = 'duration',
  'volume' = 'volume',
  'pan' = 'pan',

}
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
export type SequenceItem = {
  name: string;
  value: string;
  tags: string;
};
export type DbSequenceType = {
    type: RESPONSETYPE;
    value: SequenceItem;
}
export type DbSequenceListType = {
  type: RESPONSETYPE;
  value: SequenceItem[];
};
export type DbResponseType =
  | DbErrorType
  | DbTagListType
  | DbSequenceNamesType
  | DbSequenceListType
  | DbSequenceType
  | MessageType

// type for messages on the UI
  export type MessageType = {
  type: RESPONSETYPE;
  message: string;
};

export type ItemClass = {}
export type AttributeProperty = {
    name: string,
      dataType: GridColType;
      title: string,
      units: string,
      min?: number,
      max?: number,
}
export type ItemProperties = {
  type: Attribute;
  name: string;
  class: ItemClass;
  attributes: AttributeProperty[],
}

export type ErrorMessage = string;
export type ErrorMessages = ErrorMessage[];

export type NoneValue = {
  id: string;
  type: Attribute;
}
export type NoteValue = {
  id:string;
  note: string;
  beats: number;
}
export type SpeedValue = {
  id:string;
  BPM: number;
  time: number;
}
export type AttackValue = {
  id:string;
  attack: number;
  time: number;
}
export type DurationValue = {
  id:string;
  duration: number;
  time: number;
}
export type VolumeValue = {
  id:string;
  volume: number;
  time: number;
}
export type PanValue = {
  id:string;
  pan: number;
  time: number;
}
export type AttributeValue = NoneValue | NoteValue | SpeedValue | AttackValue | DurationValue | VolumeValue | PanValue;
