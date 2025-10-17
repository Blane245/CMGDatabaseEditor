import { GridValidRowModel } from "@mui/x-data-grid";
import { Attribute } from "types";
import noteToMidi from "utils/notetomidi";
import Item from "../classes/item";
import Sequence from "../classes/sequences";

export default function moveToObjectandStringify(
  sequenceType: Attribute,
  rows: GridValidRowModel,
  sequenceObject: Sequence
): string {
  const items: Item[] = [];
  for (let i = 0; i < rows.length; i++) {
    const editItem = rows[i];
    const newItem: Item = new Item(editItem.id);
    newItem.value =
      sequenceType == Attribute.note
        ? noteToMidi(editItem.value)
        : editItem.value;
    newItem.beats = editItem.beats;
    items.push(newItem);
  }
  sequenceObject.items = [...items];
  const value: string = sequenceObject.encode();
  return value;
}
