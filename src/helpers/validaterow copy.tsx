import {
  GridValidRowModel
} from "@mui/x-data-grid";
import { Attribute, ErrorMessages } from "types";
import checkNote from "utils/checknote";
import toTitleCase from "utils/totitlecase";

// validate the note name and change it to title case.
// all other fields are restrained by the min/max values
export default function validateRow(
  sequenceType: Attribute,
  updatedRow: GridValidRowModel,
): ErrorMessages {
  const errors: ErrorMessages = [];
  if (sequenceType == Attribute.note) {
    const error: boolean = checkNote(updatedRow.note);
    if (error) {
      errors.push(`${updatedRow.note} is not in proper format`);
      return errors;
    }
    // beats is kept in range by the column definition

    // change the case of the note name
    updatedRow.note = toTitleCase(updatedRow.note);
  }
  return [];
}
