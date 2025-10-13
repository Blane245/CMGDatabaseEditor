import { GridValidRowModel } from "@mui/x-data-grid";
import {
  AttackItem,
  DurationItem,
  Item,
  NoteItem,
  PanItem,
  SpeedItem,
  VolumeItem,
} from "classes/items";
import { Attribute, ErrorMessage, ErrorMessages } from "types";
import checkNote from "utils/checknote";
import toTitleCase from "utils/totitlecase";

// validate the note name and change it to title case.
// all other fields are restrained by the min/max values
export default function validateRow(
  sequenceType: Attribute,
  item: Partial<Item>
): ErrorMessage {
  switch (sequenceType) {
    case Attribute.note:
      {
        if (!checkNote((item as NoteItem).note))
          return "The note is not in proper format.";
        if ((item as NoteItem).beats <= 0) {
          return "The number of beats must be greater than zero.";
        }
      }
      break;
    case Attribute.speed:
      {
        const speedItem: SpeedItem = item as SpeedItem;
        if (speedItem.BPM < 0) return "BPM must be greater than zero";
        if (speedItem.time < 0) {
          return "The time must not be less than zero.";
        }
      }
      break;
    case Attribute.attack:
      {
        const attackItem: AttackItem = item as AttackItem;
        if (attackItem.attack < 0 || attackItem.attack > 127)
          return "attack must be in the range [0,127]";
        if (attackItem.time < 0) {
          return "The time must not be less than zero.";
        }
      }
      break;
    case Attribute.duration:
      {
        const durationItem: DurationItem = item as DurationItem;
        if (durationItem.duration < 0 || durationItem.duration > 100)
          return "duration must be in the range [0,100]";
        if (durationItem.time < 0) {
          return "The time must not be less than zero.";
        }
      }
      break;
    case Attribute.volume:
      {
        const volumeItem: VolumeItem = item as VolumeItem;
        if (volumeItem.volume < -10 || volumeItem.volume > 10)
          return "volume must be in the range [-10,+10]";
        if (volumeItem.time < 0) {
          return "The time must not be less than zero.";
        }
      }
      break;
    case Attribute.pan:
      {
        const panItem: PanItem = item as PanItem;
        if (panItem.pan < -1 || panItem.pan > 1)
          return "pan must be in the range [-1,+1]";
        if (panItem.time < 0) {
          return "The time must not be less than zero.";
        }
      }
      break;
    default:
      return `Invalid attribuite type ${sequenceType}`;
  }
  return "";
}
