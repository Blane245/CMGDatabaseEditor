import {
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import {
  AttackValue,
  Attribute,
  AttributeValue,
  DurationValue,
  NoteValue,
  PanValue,
  SpeedValue,
  VolumeValue,
} from "types";
import {
  AttackSequence,
  DurationSequence,
  NoteSequence,
  PanSequence,
  Sequence,
  SpeedSequence,
  VolumeSequence,
} from "classes/sequences";

export default function buildRowsandModel(
  sequenceType: Attribute,
  sequenceObject: Sequence
): { rows: GridRowModel<AttributeValue>[]; model: GridRowModesModel } {
  switch (sequenceType) {
    case Attribute.note: {
      const newRows: GridRowModel<NoteValue>[] = [];
      const newModel: GridRowModesModel = {};
      (sequenceObject as NoteSequence).items.forEach((i) => {
        const newRow: GridRowModel<NoteValue> = {
          id: i.id,
          note: i.note,
          beats: i.beats,
        };
        newRows.push(newRow);
        newModel[i.id] = { mode: GridRowModes.View };
      });
      return { rows: newRows, model: newModel };
    }
    case Attribute.speed: {
      const newRows: GridRowModel<SpeedValue>[] = [];
      const newModel: GridRowModesModel = {};
      (sequenceObject as SpeedSequence).items.forEach((i) => {
        const newRow: GridRowModel<SpeedValue> = {
          id: i.id,
          BPM: i.BPM,
          time: i.time,
        };
        newRows.push(newRow);
        newModel[i.id] = { mode: GridRowModes.View };
      });
      return { rows: newRows, model: newModel };
    }
    case Attribute.attack: {
      const newRows: GridRowModel<AttackValue>[] = [];
      const newModel: GridRowModesModel = {};
      (sequenceObject as AttackSequence).items.forEach((i) => {
        const newRow: GridRowModel<AttackValue> = {
          id: i.id,
          attack: i.attack,
          time: i.time,
        };
        newRows.push(newRow);
        newModel[i.id] = { mode: GridRowModes.View };
      });
      return { rows: newRows, model: newModel };
    }
    case Attribute.duration: {
      const newRows: GridRowModel<DurationValue>[] = [];
      const newModel: GridRowModesModel = {};
      (sequenceObject as DurationSequence).items.forEach((i) => {
        const newRow: GridRowModel<DurationValue> = {
          id: i.id,
          duration: i.duration,
          time: i.time,
        };
        newRows.push(newRow);
        newModel[i.id] = { mode: GridRowModes.View };
      });
      return { rows: newRows, model: newModel };
    }
    case Attribute.volume: {
      const newRows: GridRowModel<VolumeValue>[] = [];
      const newModel: GridRowModesModel = {};
      (sequenceObject as VolumeSequence).items.forEach((i) => {
        const newRow: GridRowModel<VolumeValue> = {
          id: i.id,
          volume: i.volume,
          time: i.time,
        };
        newRows.push(newRow);
        newModel[i.id] = { mode: GridRowModes.View };
      });
      return { rows: newRows, model: newModel };
    }
    case Attribute.pan: {
      const newRows: GridRowModel<PanValue>[] = [];
      const newModel: GridRowModesModel = {};
      (sequenceObject as PanSequence).items.forEach((i) => {
        const newRow: GridRowModel<PanValue> = {
          id: i.id,
          pan: i.pan,
          time: i.time,
        };
        newRows.push(newRow);
        newModel[i.id] = { mode: GridRowModes.View };
      });
      return { rows: newRows, model: newModel };
    }
    default: {
      const newRows: GridRowModel<AttributeValue>[] = [];
      const newModel: GridRowModesModel = {};
      return { rows: newRows, model: newModel };
    }
  }
}
