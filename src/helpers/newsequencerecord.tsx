import { GridRowId, GridValidRowModel } from "@mui/x-data-grid";
import { Attribute } from "types";

export function newSequenceRecord (sequenceType: Attribute, id: GridRowId): GridValidRowModel {
    switch (sequenceType) {
      case Attribute.note:
        return { id: id as string, note: "C4", beats: 1, isNew: true };
      case Attribute.speed:
        return { id: id as string, BPM: 60, time: 0, isNew: true };
      case Attribute.attack:
        return { id: id as string, attack: 63, time: 0, isNew: true };
      case Attribute.duration:
        return { id: id as string, duration: 100, time: 0, isNew: true };
      case Attribute.volume:
        return { id: id as string, volume: 0, time: 0, isNew: true };
      case Attribute.pan:
        return { id: id as string, pan: 0, time: 0, isNew: true };
      default:
        return { id: id };
    }
  };

