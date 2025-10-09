import { Attribute, ItemProperties } from "types";
import {
    Item,
    NoteItem,
    SpeedItem
} from "classes/items";

export default function getItemProperties(
  sequenceType: Attribute,
): ItemProperties {
  switch (sequenceType) {
    case Attribute.note:
      return NoteItem.getProperties();
    case Attribute.speed:
      return SpeedItem.getProperties();
    case Attribute.attack:
      return SpeedItem.getProperties();
    case Attribute.duration:
      return SpeedItem.getProperties();
    case Attribute.volume:
      return SpeedItem.getProperties();
    case Attribute.pan:
      return SpeedItem.getProperties();
    default:
         return Item.getProperties();
  }
}
