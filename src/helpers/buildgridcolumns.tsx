import {
  GridActionsCellItem,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
} from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Tooltip } from "@mui/material";
import { AttributeProperty, ItemProperties } from "types";

export default function buildGridColumns(
  itemProperties: ItemProperties,
  rowModesModel: GridRowModesModel,
  handleSaveClick: (id: GridRowId) => () => void,
  handleDeleteClick: (id: GridRowId) => () => void,
  handleCancelClick: (id: GridRowId) => () => void,
  handleEditClick: (id: GridRowId) => () => void,
): GridColDef[] {
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
    // add getActions to the columns so that addressibility on the row model is achieved
    columns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: ({ id }) => {
        // let isInEditMode = false;
        // setRowModesModel((model) => {
        //   isInEditMode = model[id]?.mode === GridRowModes.Edit;
        //   return model;
        // })
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <Tooltip title={"Save Row"}>
              <GridActionsCellItem
                icon={<SaveIcon />}
                label="Save"
                className="textPrimary"
                material={{ sx: { color: "primary.main" } }}
                onClick={handleSaveClick(id)}
              />
            </Tooltip>,
            <Tooltip title={"Cancel Row"}>
              <GridActionsCellItem
                icon={<CancelIcon />}
                label="Cancel"
                className="textPrimary"
                onClick={handleCancelClick(id)}
                color="inherit"
              />
            </Tooltip>,
          ];
        }
        return [
          <Tooltip title={"Edit Row"}>
            <GridActionsCellItem
              icon={<EditIcon />}
              label="Edit"
              className="textPrimary"
              onClick={handleEditClick(id)}
              color="inherit"
            />
          </Tooltip>,
          <Tooltip title={"Delete Row"}>
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={handleDeleteClick(id)}
              color="inherit"
            />
          </Tooltip>,
        ];
      },
    });
  return columns;
}
