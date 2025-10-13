import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Alert, AlertProps, Snackbar, Tooltip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlotProps,
  GridValidRowModel,
  Toolbar,
  ToolbarButton,
} from "@mui/x-data-grid";

import { randomId } from "@mui/x-data-grid-generator";
import { Sequence } from "classes/sequences";
import buildGridColumns from "helpers/buildgridcolumns";
import buildRowsandModel from "helpers/buildrowsandmodel";
import getItemProperties from "helpers/getItemproperties";
import moveToObjectandEncode from "helpers/movetoobjecdtandencode";
import { JSX, useCallback, useEffect, useState } from "react";
import fetchData from "utils/fetchdata";
import toTitleCase from "utils/totitlecase";
import {
  Attribute,
  DbErrorType,
  EDITMODE,
  ErrorMessage,
  FocusField,
  RESPONSETYPE,
} from "../types";
// import validateRow from "helpers/validaterow";
import { GridActionsColDef } from "@mui/x-data-grid";
import { Item } from "classes/items";
import { newSequenceRecord } from "helpers/newsequencerecord";
import validateRow from "helpers/validaterow";
import validateRows from "helpers/validaterows";
declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    sequenceType: Attribute;
    setEditMessages: (
      newEditMessages: (prev: DbErrorType[]) => DbErrorType[]
    ) => void;
  }
}

// component that provides the add row function
function EditToolbar(props: GridSlotProps["toolbar"]) {
  const { setRows, setRowModesModel, sequenceType, setEditMessages } = props;

  const handleAdd = () => {
    const id = randomId();
    setRows((oldRows: GridRowsProp) => {
      console.log(
        "sd add row id, oldRows, new record",
        id,
        oldRows,
        newSequenceRecord(sequenceType, id)
      );
      return [...oldRows, newSequenceRecord(sequenceType, id)];
    });
    setRowModesModel((oldModel: GridRowModesModel) => {
      const newModel: GridRowModesModel = {
        ...oldModel,
        [id]: {
          mode: GridRowModes.Edit,
          fieldToFocus: FocusField[sequenceType],
        },
      };
      console.log("sd add row id, newModel", id, newModel);
      return newModel;
    });
    setEditMessages((_prev) => [
      {
        type: RESPONSETYPE.info,
        message: `New ${toTitleCase(sequenceType)} item added`,
      },
    ]);
  };

  return (
    <Toolbar>
      <Tooltip title={`Add ${toTitleCase(sequenceType)} item`}>
        <ToolbarButton onClick={handleAdd}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}

const useValidation = () => {
  return useCallback(
    (item: Partial<Item>, sequenceType: Attribute) =>
      new Promise<Partial<Item>>((resolve, reject) => {
        // validate the attribute item
        const error: ErrorMessage = validateRow(sequenceType, item);
        if (error != "") reject(new Error(error));
        else resolve({ ...item });
      }),
    []
  );
};

interface SequenceDialogProps {
  sequenceType: Attribute;
  sequenceObject: Sequence;
  setSequenceObject: Function;
  mode: string;
  setMode: Function;
  setDbResponse: Function;
}

// the editable datagrid for maintenance of the sequence name, tags, and value (sequnce rows)
// the sequenceobject contains the array of sequenceitem objects that are used to build the rows
// the itemproperties contains the array of properties of the items that is used to build the column definitions
export default function SequenceDialog(
  props: SequenceDialogProps
): JSX.Element {
  const { sequenceType, sequenceObject, mode, setMode, setDbResponse } = props;
  const [name, setName] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  // whenever the rowmodelsmodel changes, the actions column need to change
  // to address this new one
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  
  // Check if any rows are currently in edit mode
  const hasRowsInEditMode = Object.values(rowModesModel).some(
    (rowMode) => rowMode.mode === GridRowModes.Edit
  );
  
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [disableTransaction, setDisableTransaction] = useState<boolean>(false);
  const [editMessages, setEditMessages] = useState<DbErrorType[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
    const validateRow = useValidation();


  // the popup after validating row edit
  const [snackbar, setSnackbar] = useState<Pick<
    AlertProps,
    "children" | "severity"
  > | null>(null);
  const handleCloseSnackbar = () => setSnackbar(null);

  // the handlers for the row actions
  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((oldModel) => {
      if (oldModel[id].mode == GridRowModes.Edit) return oldModel;
      const newModel = { ...oldModel, [id]: { mode: GridRowModes.Edit } };
      console.log("sd edit click new model", newModel);
      return newModel;
    });
    setEditMessages([]);
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setEditMessages([]);
    setRowModesModel((oldModel) => {
      if (oldModel[id].mode == GridRowModes.View) return oldModel;
      const newModel = { ...oldModel, [id]: { mode: GridRowModes.View, isNew: false } };
      console.log("sd save click id, newModel", newModel);
      return newModel;
    });
  };

  // on a delete remove the row and update the new value
  const handleDeleteClick = (id: GridRowId) => () => {
    setEditMessages([]);
    setRows((rows) => {
      const newRows: GridValidRowModel[] = rows.filter((row) => row.id !== id);
      console.log("sd delete click  newRows", newRows);
      return newRows;
    });
  };

  // on a cancel revert to the previous row's value and if the row is
  // new, remove it
  const handleCancelClick = (id: GridRowId) => () => {
    setEditMessages([]);
    setRowModesModel((oldModel) => {
      const newModel = {
        ...oldModel,
        [id]: { mode: GridRowModes.View, ignoreModifications: true },
      };
      console.log("sd cancel click id, newModel", newModel);
      return newModel;
    });

    const editedRow = rows.find((row) => row.id === id);

    if (editedRow!.isNew) {
      console.log("sd cancel removing new row");
      const newRows: GridValidRowModel[] = rows.filter((row) => row.id !== id);
      setRows(newRows);
    }
  };

  // set the grid rows, row models, and columns based on the sequence object
  useEffect(() => {
    if (!sequenceObject || sequenceType == Attribute.none) return;
    setName(sequenceObject.name);
    setTags(sequenceObject.tags ? sequenceObject.tags : "");
    const { rows: newRows, model: newModel } = buildRowsandModel(
      sequenceType,
      sequenceObject
    );
    setRows(newRows);
    setRowModesModel(newModel);
    // add the actions column
    const newColumns: GridColDef[] = buildGridColumns(
      getItemProperties(sequenceType)
    );

    console.log("sd: columns defined", newColumns);

    setColumns(newColumns);

    console.log(
      "sd: new sequenceobject or sequencetype, sequenceObject, newRows, newColumns, newmodel",
      sequenceType,
      sequenceObject,
      newRows,
      newModel
    );
  }, [sequenceType, sequenceObject]);

  // every time the rowmodes model changes, the actions column need to be redefined
  // to address the new model.
  // the Add/Modify button need to change state based on whether or not any of the
  // rows are in edit mode
  useEffect(() => {
    setColumns((columns: GridColDef[]) => {
      // elminate the actions column if it exists
      const newColumns: GridColDef[] = columns.filter(
        (c) => c.type != "actions"
      );

      // add the actions column using the current rowmodesmodel
      newColumns.push({
        field: "actions",
        type: "actions",
        headerName: "Actions",
        width: 200,
        cellClassName: "actions",

        getActions: ({ id }) => {
          const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
          console.log(
            "sd actions mode, rowmodesmodel, iseditmode, id",
            rowModesModel,
            isInEditMode,
            id
          );
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
      console.log("sd: action columns added when rowsmodesmodel changed");
      return newColumns;
    });

    // check the edit state if the row modes
    setDisableTransaction(hasRowsInEditMode)
    
  }, [rowModesModel]);

  const handleRowEditStop: GridEventListener<"rowEditStop"> = (
    params,
    event
  ) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  // when the row changes flag it as not new
  const processRowUpdate = useCallback(
    async (
      newRow: GridValidRowModel,
      _oldRow: GridValidRowModel,
      params: { rowId: GridRowId }
    ) => {
      const response = await validateRow(newRow, sequenceType);
      setSnackbar({ children: "Sequence entry accepted", severity: "success" });
      console.log('sd processrowupdate - response', {...response, isNew: false})
      
      // Update the rows state with the validated row
      setRows((prevRows) => {
        return prevRows.map((row) => 
          row.id === params.rowId ? { ...response, isNew: false } : row
        );
      });
      
      return { ...response, isNew: false };
    },
    [validateRow]
  );

  const handleProcessRowUpdateError = useCallback((error: Error) => {
    console.log("sd: rowupdateerror ", error);
    setSnackbar({ children: error.message, severity: "error" });
  }, []);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    console.log("sd on rowmodelsmodelchange newrowmodesmode", newRowModesModel);
    setRowModesModel((oldModel: GridRowModesModel) => {
      const newModel: GridRowModesModel = {...oldModel, ...newRowModesModel }
      return newModel;
    })
    // setRowModesModel(newRowModesModel);
  };

  function handleApply() {
    // do the validation of the value and the time sequence
    setRows((oldRows) => {
      console.log(' sd apply rows', oldRows);
      return oldRows;
    })
    const value: string = moveToObjectandEncode(
      sequenceType,
      [...rows],
      sequenceObject
    );
    console.log("sd apply for sequence name, tags, value", name, tags, value);
    // validate the attribute values and times
    console.log("sd handle apply validating rows", rows);
    const errors: DbErrorType[] = validateRows(sequenceType, [...rows]);
    setEditMessages(errors);
    if (errors.length > 0) {
      console.log("sd apply click, errors found");
      return;
    }

    // add or modify the new record
    fetchData(
      `/${sequenceType}/${name}?value=${encodeURIComponent(
        value
      )}&tags=${encodeURIComponent(tags)}`,
      mode == EDITMODE.Add ? "POST" : "PUT",
      null,
      setDbResponse
    );
  }

  return (
    <>
      <div className="edit-header">{`${mode} Note Sequence Editor`}</div>
      <div className="edit-body">
        <label>
          Name:&nbsp;
          <input
            name="name"
            value={name}
            disabled={mode == EDITMODE.Modify}
            onChange={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <br />
        <label>
          Tags:&nbsp;&nbsp;&nbsp;
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.currentTarget.value)}
          />
        </label>
        <br />
        <div>
          <div style={{width: '100%'}}>
          <DataGrid
            // pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[5, 10, 15, 20]}
            editMode="row"
            rows={rows}
            columns={columns}
            rowModesModel={rowModesModel}
            onRowEditStop={handleRowEditStop}
            // onRowModesModelChange={handleRowModesModelChange}
            onProcessRowUpdateError={handleProcessRowUpdateError}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: {
                setRows,
                setRowModesModel,
                sequenceType: sequenceType,
                setEditMessages,
              },
            }}
            showToolbar
          />
          </div>
          {!!snackbar && (
            <Snackbar
              open
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              onClose={handleCloseSnackbar}
              autoHideDuration={6000}
            >
              <Alert {...snackbar} onClose={handleCloseSnackbar} />
            </Snackbar>
          )}
        </div>
      </div>
      <div className="edit-footer">
        <button className="submitbutton" onClick={() => handleApply()} disabled={disableTransaction}>
          {mode}
        </button>
        <button className="cancelbutton" onClick={() => setMode(EDITMODE.None)}>
          Cancel
        </button>
        <br />
        {editMessages.map((message, i) => (
          <>
            <div
              className={
                message.type == RESPONSETYPE.error
                  ? "errormessage"
                  : "infomessage"
              }
              key={`errormessage-${i}`}
            >
              {message.message}
            </div>
            <br />
          </>
        ))}
      </div>
    </>
  );
}
