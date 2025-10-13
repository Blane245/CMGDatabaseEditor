import { Attribute, ItemProperties } from "types";
import {
  AttackItem,
    DurationItem,
    Item,
    NoteItem,
    PanItem,
    SpeedItem,
    VolumeItem
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
      return AttackItem.getProperties();
    case Attribute.duration:
      return DurationItem.getProperties();
    case Attribute.volume:
      return VolumeItem.getProperties();
    case Attribute.pan:
      return PanItem.getProperties();
    default:
         return Item.getProperties();
  }
}
