import AddIcon from "@mui/icons-material/Add";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Tooltip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
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
import fetchData from "../utils/fetchdata";
import {
  DbErrorType,
  DbResponseType,
  DbSequenceType,
  DbTagListType,
  EDITMODE,
  MessageType,
  NoteItem,
  NoteSequence,
  RESPONSETYPE,
  SequenceItem,
  TagItem,
} from "../types";
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

interface NoteSequenceDialogProps {
  mode: string;
  setMode: Function;
  dbResponse: DbResponseType;
  setDbResponse: Function;
}

// the editable datagrid for handle
// notesequence is a stringyfied version of the note sequence deinition
// it will be parsed to the data rows of the editable grid
// and then updated each time any element of the grid is changed
// if there is a parse error on input a message is returned
// and the grid is initialized with zero rows
export default function NoteSequenceDialog(
  props: NoteSequenceDialogProps
): JSX.Element {
  const { mode, setMode, dbResponse, setDbResponse } = props;
  const [name, setName] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [newValue, setNewValue] = useState<string>("");
  const [enableTransaction, setEnableTransaction] = useState<boolean>(false);
  const [editMessage, setEditMessage] = useState<MessageType>({
    type: RESPONSETYPE.error,
    message: "",
  });
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [tagList, setTagList] = useState<TagItem[]>([]);
  const apiRef = useGridApiRef();

  // handle the error, sequencevalue, and taglist responses
  useEffect(() => {
    console.log("notesequencedialog received response", dbResponse.type);
    switch (dbResponse.type) {
      case RESPONSETYPE.error:
        if ((dbResponse as DbErrorType).message != "") {
          setEditMessage(dbResponse as MessageType);
          console.log("error is ", (dbResponse as DbErrorType).message);
        }
        break;
      // this will display the add/modify dialog
      case RESPONSETYPE.sequencevalue:
        const item: SequenceItem = (dbResponse as DbSequenceType).value;
        setName(item.name);
        setValue(item.value); // the value is parsed to a note datagrid
        setNewValue(item.value); // the value returned from the note datagrid
        setTags(item.tags ? item.tags : "");
        // request a taglist for validation
        fetchData("/tags", "GET", null, setDbResponse);
        break;
      case RESPONSETYPE.taglist:
        setTagList((dbResponse as DbTagListType).value);
        break;
      default:
        console.log(
          "notesequencedialog not processing response",
          dbResponse.type
        );
    }
  }, [dbResponse]);

  // this will occur when the dialog starts up and everytime
  // a row is modifed or deleted. No change occurs when a row is added until it
  // is updated
  useEffect(() => {
    // attempt to convert the value into a note sequence
    let error: boolean = false;
    setEnableTransaction(true);
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
      setEditMessage({
        type: RESPONSETYPE.error,
        message: "Error while reading current note sequence",
      });
      setRows([]);
      return;
    }

    // move the data into the grid and prepare the grideditor value field
    setEditMessage(nullMessage);
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
    const newModesModel: GridRowModesModel = {};
    newRows.forEach((row) => {
      if (row.id)
      newModesModel[row.id] = { mode: GridRowModes.View };
    });
    setRowModesModel(newModesModel);
    setNewValue(rowsToValue(newRows));
  }, [value]);

  // when all rows are not in edit mode, copy them to the new value
  // and enable the add or modify transaction
  useEffect(() => {
    const editRow = rows.find(
      (row) => rowModesModel[row.id]?.mode == GridRowModes.Edit
    );
    if (!editRow) {
      setNewValue(rowsToValue(rows));
      setEnableTransaction(true);
    } else setEnableTransaction(false);
  }, [rowModesModel]);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  // on a delete remove the row and update the new value
  const handleDeleteClick = (id: GridRowId) => () => {
    const newRows: GridValidRowModel[] = rows.filter((row) => row.id !== id);
    setRows(newRows);
    setNewValue(rowsToValue(newRows));
  };

  // on a cancel revert to the previous row's value and if the row is
  // new, remove it
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow?.isNew) {
      const newRows: GridValidRowModel[] = rows.filter((row) => row.id !== id);
      setRows(newRows);
      setNewValue(rowsToValue(newRows));
    }
  };
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

  const validateRow = (row: GridValidRowModel): string => {
    if (!checkNote(row.note)) {
      return `'${row.note}' is not in proper format.`;
    }
    if (row.duration <= 0) {
      return "Duration must be greater that zero.";
    }
    // value has already been validated
    return "";
  };
  // whever a row changes, validate the note and duration, returning to
  // edit move if it is invalid
  const processRowUpdate = (
    newRow: GridValidRowModel,
    oldRow: GridValidRowModel,
    params: {
      rowId: GridRowId;
    }
  ) => {
    const updatedRow = { ...newRow };
    // validate the note for proper format
    const error: string = validateRow(newRow);
    if (error != "") {
      // on an error, return the row to edit mode,
      setEditMessage({
        type: RESPONSETYPE.error,
        message: error,
      });
    setRowModesModel((oldModel: GridRowModesModel) => 
      ({ ...oldModel, [params.rowId]: { mode: GridRowModes.Edit } }));
      setEnableTransaction(false);
      return updatedRow;
    }

    // all is well, update the row
    updatedRow["note"] = noteNametoUpperCase(updatedRow["note"]);
    const newRows = rows.map((row) =>
      row.id === newRow.id ? updatedRow : row
    );
    setRows(newRows);

    // notify the dialog of the change
    setNewValue(rowsToValue(newRows));
    setEditMessage(nullMessage);
    return updatedRow;
  };

  function handleSubmit() {
    // do the validation - datagrid has already validated the value
    if (name == "") {
      setEditMessage({
        type: RESPONSETYPE.error,
        message: "Sequence Name must not be blank",
      });
      return;
    }

    // tags are optional, but if specified, they all must be in the taglist

    // if (tags != "") {
    //   const tagSplit: string[] = tags.split(",");
    //   let errorTag: string = "";
    //   for (let i = 0; i < tagSplit.length && errorTag == ""; i++) {
    //     const tag: string = tagSplit[i];
    //     if (tagList.findIndex((t) => t.name == tag) < 0) {
    //       errorTag = tag;
    //     }
    //   }
    //   if (errorTag != "")
    //     setEditMessage({
    //       type: RESPONSETYPE.error,
    //       message: `'${errorTag}' is not a valid tag.`,
    //     });
    //     return;
    // }

    // datagrid has already validated the newvalue

    // all's well
    if (mode == EDITMODE.Add)
      // add the new record
      fetchData(
        `/sequence/${name}?value=${encodeURIComponent(newValue)}&tags=${encodeURIComponent(tags)}`,
        "POST",
        null,
        setDbResponse
      );
    else if (mode == EDITMODE.Modify)
      // modify the existing record
      fetchData(
        `/sequence/${name}?value=${encodeURIComponent(newValue)}&tags=${encodeURIComponent(tags)}`,
        "PUT",
        null,
        setDbResponse
      );
    // TODO update the taglist but not this quickly
      fetchData(
        `/tags/`,
        "GET",
        null,
        setDbResponse
      );

  }

  return (
    <div className="edit">
      <div className="edit-header">
        {`${mode} Note Sequence Editor`}
        <br />
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
          Tags:&nbsp;
          <input
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.currentTarget.value)}
          />
        </label>
        <br />
      </div>
      <div className="edit-body">
        <div>
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
            onRowModesModelChange={(newRowModesModel: GridRowModesModel) => {
              setRowModesModel(newRowModesModel);
            }}
            // onRowEditStop={handleRowEditStop}
            processRowUpdate={processRowUpdate}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: {
                setRows,
                setRowModesModel,
                setMessage: setEditMessage,
              },
            }}
            showToolbar
          />
        </div>
      </div>
      <div className="edit-footer">
        <button
          disabled={!enableTransaction}
          className="submitbutton"
          onClick={() => handleSubmit()}
        >
          {mode}
        </button>
        <button className="cancelbutton" onClick={() => setMode(EDITMODE.None)}>
          Cancel
        </button>
        <p
          className={
            editMessage.type == RESPONSETYPE.error
              ? "errormessage"
              : "infomessage"
          }
        >
          {editMessage.message}
        </p>
      </div>
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
