import {
  GridColDef,
  GridEditInputCell
} from "@mui/x-data-grid";
import { AttributeProperty } from "types";

export default function buildGridColumns(
  itemProperties: AttributeProperty[],
): GridColDef[] {
  const columns: GridColDef[] = [];
  itemProperties.forEach((property: AttributeProperty) => {
    columns.push({
      field: property.name,
      headerName: `${property.title} ${property.units}`,
      type: property.dataType,
      width: 200,
      align: "left",
      headerAlign: "left",
      disableColumnMenu: true,
      editable: true,
      sortable: false,
      renderEditCell: (params) => (
        <GridEditInputCell {...params}
        inputProps={{max:property.max, min:property.min}}
        />
      )
    });
  });
  return columns;
}
