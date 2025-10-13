import { GridValidRowModel } from "@mui/x-data-grid";
import { Attribute, DbErrorType, RESPONSETYPE } from "types";

// check that all the times for all seuencetypes except note are in increasing order
export default function validateRows(
  sequenceType: Attribute,
  rows: GridValidRowModel[]
): DbErrorType[] {
  const errors: DbErrorType[] = [];
  if (sequenceType == Attribute.none || sequenceType == Attribute.note)
    return [];
  for (let i = 1; i < rows.length; i++) {
    if (rows[i].time <= rows[i - 1].time) {
      errors.push({
        type: RESPONSETYPE.error,
        message: `Row ${
          i + 1
        } has time less than or equal to the previous row's time`,
      });
    }
  }
  return errors;
}
