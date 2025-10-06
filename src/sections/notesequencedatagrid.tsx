import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import { Tooltip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridValidRowModel,
  Toolbar,
  ToolbarButton,
  useGridApiRef,
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { JSX, useEffect, useState } from "react";
import { MessageType, NoteItem, NoteSequence, RESPONSETYPE } from "../types";
declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    setMessage: (newMessage: MessageType) => void;
    setValue: (value: string) => void;
  }
}

const notePattern: RegExp = /[A-G,a-g][#,b]?\d([+-]\d\d)?/;
const checkNote = (note: string): boolean => {
  const match: RegExpExecArray | null = notePattern.exec(note);
  return match != null && match[0] == note;
};

const nullMessage: MessageType = { type: RESPONSETYPE.info, message: "" };

// convert the rows to a note sequence
const rowsToValue = (rows: GridRowsProp): string => {
  const noteSequence: NoteSequence = [];
  rows.forEach((r) => {
    noteSequence.push({
      note: r.note as string,
      duration: r.duration as number,
    });
  });
  return JSON.stringify(noteSequence);
};
const noteNametoUpperCase = (note: string): string => {
  if (note.length == 1) {
    return note.toUpperCase();
  } else if (note.length > 1) {
    return note.substring(0, 1).toUpperCase() + note.substring(1);
  } else return "";
};

interface NoteSequenceDataGridProps {
  value: string;
  setMessage: (message: MessageType) => void;
  setNewValue: Function;
  setEnableTransaction: Function;
}

// the editable datagrid for handle
// notesequence is a stringyfied version of the note sequence deinition
// it will be parsed to the data rows of the editable grid
// and then updated each time any element of the grid is changed
// if there is a parse error on input a message is returned
// and the grid is initialized with zero rows
export default function NoteSequenceDataGrid(
  props: NoteSequenceDataGridProps
): JSX.Element {
  const { value, setMessage, setNewValue, setEnableTransaction } = props;
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const apiRef = useGridApiRef();
  const columns: GridColDef[] = [
    {
      field: "note",
      headerName: "Note",
      type: "string",
      width: 200,
      align: "left",
      headerAlign: "left",
      disableColumnMenu: true,
      editable: true,
    },
    {
      field: "duration",
      headerName: "Beats",
      type: "number",
      width: 200,
      align: "left",
      headerAlign: "left",
      disableColumnMenu: true,
      editable: true,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              material={{ sx: { color: "primary.main" } }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }
        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  // this will occur when the dialog starts up and everytime
  // a row is modifed or deleted. No change occurs when a row is added until it
  // is updated
  useEffect(() => {
    // attempt to convert the value into a note sequence
    let error: boolean = false;
    let newArray: NoteSequence = [];
    if (value.trim() != "") {
      try {
        let newSequence: any = JSON.parse(value);
        // check that newSequence is an array of note items
        if (Array.isArray(newSequence)) {
          newArray = newSequence as Array<NoteItem>;
          for (let i = 0; i < newArray.length; i++) {
            if (
              typeof newArray[i].note != "string" ||
              typeof newArray[i].duration != "number"
            ) {
              // array entry has one or mote type errors
              error = true;
            } else {
              // check that the note is in proper format
              if (!checkNote(newArray[i].note)) {
                error = true;
              }
            }
          }
        } else {
          // value is not an array
          error = true;
        }
      } catch (e) {
        // value is not a json object
        error = true;
      }
    }
    if (error) {
      setMessage({
        type: RESPONSETYPE.error,
        message: "Error while reading current note sequence",
      });
      setRows([]);
      return;
    }
    // move the data into the grid
    // HOW to add the validator on the celleditstop event
    setMessage(nullMessage);
    let newRows: NoteSequence = [];
    for (let i = 0; i < newArray.length; i++) {
      const newRow: GridRowModel<NoteItem> = {
        id: randomId(),
        note: newArray[i].note,
        duration: newArray[i].duration,
      };
      newRows = newRows.concat(newRow);
    }
    setRows(newRows);
    setNewValue(rowsToValue(newRows));
  }, [value]);

  // TODO this and limit the number of note sequence to 10 per page and only scroll half a page - include a sequence number
  // disable the add/modify button while any row is in edit mode
  useEffect(() => {
    const editRow = rows.find(
      (row) => rowModesModel[row.id]?.mode == GridRowModes.Edit
    );
    setEnableTransaction(!editRow);
    if (!editRow) setNewValue(rowsToValue(rows));
  }, [rowModesModel]);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  // check the note and duration values before letting the row be saved
  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRows(rows.filter((row) => row.id !== id));
  };

  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow!.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const processRowUpdate = (newRow: GridValidRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    // validate the note for proper format
    if (!checkNote(updatedRow["note"])) {
      setMessage({
        type: RESPONSETYPE.error,
        message: `'${updatedRow["note"]}' is not in proper format`,
      });
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      setRows((rows) =>
        rows.map((row) => (row.id === newRow.id ? newRow : row))
      );
      return;
    }

    // validate the duration as a proper number
    const duration = updatedRow["duration"];
    if (duration <= 0) {
      setMessage({
        type: RESPONSETYPE.error,
        message: `The number of beats must be greater than zero`,
      });
      setRowModesModel({
        ...rowModesModel,
        [newRow.id]: { mode: GridRowModes.Edit },
      });
      setRows((rows) =>
        rows.map((row) => (row.id === newRow.id ? newRow : row))
      );
      return;
    }
    updatedRow["note"] = noteNametoUpperCase(updatedRow["note"]);
    const newRows = rows.map((row) =>
      row.id === newRow.id ? updatedRow : row
    );
    setRows(newRows);

    // notify the caller of the change
    setNewValue(JSON.stringify(rowsToValue(newRows)));
    setMessage(nullMessage);
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <div style={{ height: "75%", width: "100%" }}>
      <DataGrid
        // initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
        // pageSize={pageSize}
        // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        // rowsPerPageOptions={[5, 10, 20]}
        // pagination
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        // onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, setMessage },
        }}
        showToolbar
      />
    </div>
  );
}

interface EditToolbarProps {
  setRows: Function;
  setRowModesModel: Function;
  setMessage: Function;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, setMessage } = props;

  const handleClick = () => {
    const id = randomId();
    setRows((oldRows: GridRowsProp) => [
      ...oldRows,
      { id: id, note: "C4", duration: 1, isNew: true },
    ]);
    setRowModesModel((oldModel: GridRowModesModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" },
    }));
    setMessage(nullMessage);
  };
  return (
    <Toolbar>
      <Tooltip title="Add record">
        <ToolbarButton onClick={() => handleClick()}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}
