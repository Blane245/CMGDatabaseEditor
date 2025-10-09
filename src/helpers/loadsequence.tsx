import {
  AttackItem,
  DurationItem,
  NoteItem,
  PanItem,
  SpeedItem,
  VolumeItem,
} from "classes/items";
import {
  AttackSequence,
  DurationSequence,
  NoteSequence,
  PanSequence,
  Sequence,
  SpeedSequence,
  VolumeSequence
} from "classes/sequences";
import { Attribute, DbResponseType, DbSequenceType, MessageType, RESPONSETYPE } from "types";

export default function loadSequence (
    sequenceType: Attribute,
    dbResponse: DbResponseType,
    setEditMessage: (value: React.SetStateAction<MessageType>) => void,
    setSequenceObject: (value: React.SetStateAction<Sequence | null>) => void,
    
): void {
      switch (sequenceType) {
        case Attribute.note:
          {
            const obj: NoteSequence = new NoteSequence();
            obj.name = (dbResponse as DbSequenceType).value.name;
            obj.tags = (dbResponse as DbSequenceType).value.tags;
            const { error, values } = obj.decode(
              (dbResponse as DbSequenceType).value.value
            );
            if (error)
              setEditMessage({
                type: RESPONSETYPE.error,
                message: `Error while loading sequence items for sequence ${obj.name}`,
              });
            else {
              obj.items = [];
              values.forEach((v) => {
                const newItem = new NoteItem(v.note, v.beats);
                obj.items.push(newItem);
              });
              setSequenceObject(obj);
            }
          }
          break;
        case Attribute.speed:
          {
            const obj: SpeedSequence = new SpeedSequence();
            obj.name = (dbResponse as DbSequenceType).value.name;
            obj.tags = (dbResponse as DbSequenceType).value.tags;
            const { error, values } = obj.decode(
              (dbResponse as DbSequenceType).value.value
            );
            if (error)
              setEditMessage({
                type: RESPONSETYPE.error,
                message: `Error while loading sequence items for sequence ${obj.name}`,
              });
            else {
              obj.items = [];
              values.forEach((v) => {
                const newItem = new SpeedItem(v.BPM, v.time);
                obj.items.push(newItem);
              });
              setSequenceObject(obj);
            }
          }
          break;
        case Attribute.attack:
          {
            const obj: AttackSequence = new AttackSequence();
            obj.name = (dbResponse as DbSequenceType).value.name;
            obj.tags = (dbResponse as DbSequenceType).value.tags;
            const { error, values } = obj.decode(
              (dbResponse as DbSequenceType).value.value
            );
            if (error)
              setEditMessage({
                type: RESPONSETYPE.error,
                message: `Error while loading sequence items for sequence ${obj.name}`,
              });
            else {
              obj.items = [];
              values.forEach((v) => {
                const newItem = new AttackItem(v.attack, v.time);
                obj.items.push(newItem);
              });
              setSequenceObject(obj);
            }
          }
          break;
        case Attribute.duration:
          {
            const obj: DurationSequence = new DurationSequence();
            obj.name = (dbResponse as DbSequenceType).value.name;
            obj.tags = (dbResponse as DbSequenceType).value.tags;
            const { error, values } = obj.decode(
              (dbResponse as DbSequenceType).value.value
            );
            if (error)
              setEditMessage({
                type: RESPONSETYPE.error,
                message: `Error while loading sequence items for sequence ${obj.name}`,
              });
            else {
              obj.items = [];
              values.forEach((v) => {
                const newItem = new DurationItem(v.duration, v.time);
                obj.items.push(newItem);
              });
              setSequenceObject(obj);
            }
          }
          break;
        case Attribute.volume:
          {
            const obj: VolumeSequence = new VolumeSequence();
            obj.name = (dbResponse as DbSequenceType).value.name;
            obj.tags = (dbResponse as DbSequenceType).value.tags;
            const { error, values } = obj.decode(
              (dbResponse as DbSequenceType).value.value
            );
            if (error)
              setEditMessage({
                type: RESPONSETYPE.error,
                message: `Error while loading sequence items for sequence ${obj.name}`,
              });
            else {
              obj.items = [];
              values.forEach((v) => {
                const newItem = new VolumeItem(v.volume, v.time);
                obj.items.push(newItem);
              });
              setSequenceObject(obj);
            }
          }
          break;
        case Attribute.pan:
          {
            const obj: PanSequence = new PanSequence();
            obj.name = (dbResponse as DbSequenceType).value.name;
            obj.tags = (dbResponse as DbSequenceType).value.tags;
            const { error, values } = obj.decode(
              (dbResponse as DbSequenceType).value.value
            );
            if (error)
              setEditMessage({
                type: RESPONSETYPE.error,
                message: `Error while loading sequence items for sequence ${obj.name}`,
              });
            else {
              obj.items = [];
              values.forEach((v) => {
                const newItem = new PanItem(v.pan, v.time);
                obj.items.push(newItem);
              });
              setSequenceObject(obj);
            }
          }
          break;
      }
    }