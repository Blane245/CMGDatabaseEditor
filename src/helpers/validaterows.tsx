import { GridValidRowModel } from "@mui/x-data-grid";
import { Attribute, DbErrorType } from "types";

// no multiple row validate is needed
export default function validateRows(
  _sequenceType: Attribute,
  _rows: GridValidRowModel[]
): DbErrorType[] {
  const errors: DbErrorType[] = [];
  return errors;
}
