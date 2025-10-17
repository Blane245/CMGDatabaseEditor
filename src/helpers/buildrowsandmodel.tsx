import {
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import Item from "classes/item";
import Sequence from "classes/sequences";
import midiToNote from "utils/miditonote";
import { Attribute, EditItem } from "types";

export default function buildRowsandModel(
  sequenceType: Attribute,
  sequenceObject: Sequence
): { rows: GridRowModel<EditItem>[]; model: GridRowModesModel } {
  const newRows: GridRowModel<EditItem>[] = [];
  const newModel: GridRowModesModel = {};
  const items: Item[] = sequenceObject.items;
  for (let i = 0; i < items.length; i++) {
    const item: Item = items[i];
    const value: number | string =
      sequenceType == Attribute.note ? midiToNote(item.value) : item.value;
    const newRow: GridRowModel<EditItem> = {
      id: item.id,
      value: value,
      beats: item.beats,
    };
    newRows.push(newRow);
    newModel[item.id] = { mode: GridRowModes.View };
  }
  return { rows: newRows, model: newModel };
}
