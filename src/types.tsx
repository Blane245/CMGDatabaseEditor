// the type that represent responses from the note_sequences database
export enum RESPONSETYPE {
  "error" = "error",
  "info" = "info",
  "sequencenamelist" = "sequencenamelist",
  "tagsequencelist" = "tagsequencelist",
  "taglist" = "taglist",
  "sequencevalue" = "sequencevalue",
  "sequencelist" = "sequencelist",
  "sequencesearchlist" = "sequencesearchlist"
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
  count: number;
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

// a note sequence item
export type NoteItem = {
  id?: string;
  note: string; // the extended name of a note, e.g., C#4+13
  duration: number; // the number of beats that the note is played
}

// a sequence of notes
export type NoteSequence = NoteItem[];
