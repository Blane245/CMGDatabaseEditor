import Item from "classes/item";
import { Attribute, EditItem, ErrorMessage } from "types";
import checkNote from "utils/checknote";

// validate the attribute fields.
// all other fields are restrained by the min/max values
export default function validateRow(
  sequenceType: Attribute,
  editItem: Partial<EditItem>
): ErrorMessage {

  // datagrid hooks are not doing range validation as expected
  const error = Item.validate(sequenceType, editItem)
  return error;
}
