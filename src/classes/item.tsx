import { randomId } from "@mui/x-data-grid-generator";
import {
  Attribute,
  AttributeProperty,
  EditItem,
  ErrorMessage,
  itemProperties,
} from "types";
import checkNote from "utils/checknote";

export default class Item {
  id: string;
  value: number = 0;
  beats: number = 0;
  constructor(id?: string) {
    if (id) this.id = id;
    else this.id = randomId();
  }
  getAttributes(): {} {
    return {};
  }

  //
  static validate(
    sequenceType: Attribute,
    editItem: Partial<EditItem>
  ): ErrorMessage {
    // one property for each of the columns in the row
    const attributeProperty: AttributeProperty[] = itemProperties[sequenceType];

    // validate the value part of the row
    if (editItem.value != undefined) {
      // handling is different for the note attribute
      if (sequenceType == Attribute.note) {
        if (!checkNote(editItem.value as string))
          return `${editItem.value as string} is not a valid note name`;
      } else {
        // check that value is between its minimum and maximum inclusively
        const value: number = editItem.value as number;
        const min: number = attributeProperty[0].min;
        const max: number = attributeProperty[0].max;
        if (value < min || value > max)
          return `${attributeProperty[0].title}: ${editItem.value} must be in the range [${min} , ${max}]`;
      }
    }

    // check the beats part of the row
    if (editItem.beats != undefined) {
      // check that value is between its minimum and maximum inclusively
      const beats: number = editItem.beats;
      const min: number = attributeProperty[1].min;
      const max: number = attributeProperty[1].max;
      if (beats < min || beats > max)
        return `${attributeProperty[1].title}: ${editItem.beats} must be in the range [${min} , ${max}]`;
    }
    return "";
  }
}
