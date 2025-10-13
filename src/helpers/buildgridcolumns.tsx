import {
  GridActionsCellItem,
  GridColDef,
  GridEditInputCell,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import { AttributeProperty, ItemProperties } from "types";

export default function buildGridColumns(
  itemProperties: ItemProperties,
): GridColDef[] {
  console.log('building columns');
  const columns: GridColDef[] = [];
  itemProperties.attributes.forEach((attr: AttributeProperty) => {
    columns.push({
      field: attr.name,
      headerName: `${attr.title} (${attr.units})`,
      type: attr.dataType,
      width: 200,
      align: "left",
      headerAlign: "left",
      disableColumnMenu: true,
      editable: true,
    });
  });
  return columns;
}
