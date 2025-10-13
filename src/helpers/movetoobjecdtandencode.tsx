import { GridValidRowModel } from "@mui/x-data-grid";
import {
  AttackItem,
  DurationItem,
  NoteItem,
  PanItem,
  SpeedItem,
  VolumeItem,
} from "../classes/items";
import {
  AttackSequence,
  DurationSequence,
  NoteSequence,
  PanSequence,
  Sequence,
  SpeedSequence,
  VolumeSequence,
} from "../classes/sequences";
import { Attribute } from "types";
import toTitleCase from "utils/totitlecase";

export default function moveToObjectandEncode (
    sequenceType: Attribute,
    rows:GridValidRowModel,
    sequenceObject: Sequence,

): string {

    switch (sequenceType) {
        case Attribute.note: {
            const items: NoteItem[] = [];
            for (let i = 0; i < rows.length; i++) {
                const newItem:NoteItem = new NoteItem(toTitleCase(rows[i].note), rows[i].beats, rows[i].id);
                items.push(newItem);
            }
            (sequenceObject as NoteSequence).items = [...items];
        }
        break;
        case Attribute.speed: {
            const items: SpeedItem[] = [];
            for (let i = 0; i < rows.length; i++) {
                const newItem:SpeedItem = new SpeedItem(rows[i].BPM, rows[i].time, rows[i].id);
                items.push(newItem);
            }
            (sequenceObject as SpeedSequence).items = [...items];
        }
        break;
        case Attribute.attack: {
            const items: AttackItem[] = [];
            for (let i = 0; i < rows.length; i++) {
                const newItem:AttackItem = new AttackItem(rows[i].attack, rows[i].time, rows[i].id);
                items.push(newItem);
            }
            (sequenceObject as AttackSequence).items = [...items];
        }
        break;
        case Attribute.duration: {
            const items: DurationItem[] = [];
            for (let i = 0; i < rows.length; i++) {
                const newItem:DurationItem = new DurationItem(rows[i].duration, rows[i].time, rows[i].id);
                items.push(newItem);
            }
            (sequenceObject as DurationSequence).items = [...items];
        }
        break;
        case Attribute.volume: {
            const items: VolumeItem[] = [];
            for (let i = 0; i < rows.length; i++) {
                const newItem:VolumeItem = new VolumeItem(rows[i].volume, rows[i].time, rows[i].id);
                items.push(newItem);
            }
            (sequenceObject as VolumeSequence).items = [...items];
        }
        break;
        case Attribute.pan: {
            const items: PanItem[] = [];
            for (let i = 0; i < rows.length; i++) {
                const newItem:PanItem = new PanItem(rows[i].pan, rows[i].time, rows[i].id);
                items.push(newItem);
            }
            (sequenceObject as PanSequence).items = [...items];
        }
        break;
    }

    const value: string = sequenceObject.encode();
    return value;
}