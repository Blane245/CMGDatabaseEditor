import { GridRowModes, GridRowModesModel, GridValidRowModel } from "@mui/x-data-grid";
import { Attribute, ErrorMessages } from "types";
import checkNote from "utils/checknote";

// the datagrid has contrained teh numeric data to their proper ranges
// what is needed here is to validate the note names for note sequences and time sequence of the rows
// when an eror is detected, set to the back to edit mode
export default function validateRows(
  sequenceType: Attribute,
  rows: GridValidRowModel[],
  setRowModesModel: React.Dispatch<React.SetStateAction<GridRowModesModel>>
): ErrorMessages {
  const errors: ErrorMessages = [];
  if (sequenceType == Attribute.note) {
    rows.forEach((row) => {
      const error = checkNote(row.note);
      if (error) {
        errors.push(`${row.note} is not in proper format`);
        setRowModesModel((oldModel: GridRowModesModel) => ({
          ...oldModel,
          [row.rowId]: { mode: GridRowModes.Edit },
        }));
      }
    });
  } else if (sequenceType != Attribute.none) {
    for (let i = 1; i < rows.length; i++) {
      if (rows[i].time <= rows[i - 1].time) {
        errors.push(
          `$Row ${i} has time less than or equal to the previous row's time`
        );
        setRowModesModel((oldModel: GridRowModesModel) => ({
          ...oldModel,
          [rows[i].rowId]: { mode: GridRowModes.Edit },
        }));
      }
    }
  }

  return errors;
}
