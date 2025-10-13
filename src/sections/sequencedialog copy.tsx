import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridEventListener,
  GridRowEditStartReasons,
  GridRowEditStopReasons,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridSlotProps,
  GridValidRowModel,
  Toolbar,
  ToolbarButton,
  useGridApiRef,
} from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

import { randomId } from "@mui/x-data-grid-generator";
import { Sequence } from "classes/sequences";
import buildGridColumns from "helpers/buildgridcolumns";
import buildRowsandModel from "helpers/buildrowsandmodel";
import getItemProperties from "helpers/getItemproperties";
import moveToObjectandEncode from "helpers/movetoobjecdtandencode";
import validateRows from "helpers/validaterows";
import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react";
import fetchData from "utils/fetchdata";
import toTitleCase from "utils/totitlecase";
import {
  Attribute,
  DbErrorType,
  DbResponseType,
  DbTagListType,
  EDITMODE,
  ErrorMessages,
  FocusField,
  MessageType,
  RESPONSETYPE,
  TagItem,
} from "../types";
// import validateRow from "helpers/validaterow";
import { newSequenceRecord } from "helpers/newsequencerecord";
declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    sequenceType: Attribute;
  }
}

// component that provides the add row function
function EditToolbar(props: GridSlotProps['toolbar']) {
  const { setRows, setRowModesModel, sequenceType } = props;

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
        [id]: { mode: GridRowModes.Edit, fieldToFocus: FocusField[sequenceType] },
      };
      console.log("sd add row id, newModel", id, newModel);
      return newModel;
    });
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

interface SequenceDialogProps {
  sequenceType: Attribute;
  sequenceObject: Sequence;
  setSequenceObject: Function;
  mode: string;
  setMode: Function;
  dbResponse: DbResponseType;
  setDbResponse: Function;
}

// the editable datagrid for maintenance of the sequence name, tags, and value (sequnce rows)
// the sequenceobject contains the array of sequenceitem objects that are used to build the rows
// the itemproperties contains the array of properties of the items that is used to build the column definitions
export default function SequenceDialog(
  props: SequenceDialogProps
): JSX.Element {
  const {
    sequenceType,
    sequenceObject,
    mode,
    setMode,
    dbResponse,
    setDbResponse,
  } = props;
  const [name, setName] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  // const [enableTransaction, setEnableTransaction] = useState<boolean>(false);
  // const [editMessages, setEditMessages] = useState<ErrorMessages>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rows, setRows] = useState<GridRowsProp>([]);
  // const [tagList, setTagList] = useState<TagItem[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  // set the grid rows, and row models based on the sequence object
  useEffect(() => {
    if (!sequenceObject || sequenceType == Attribute.none) return;
    setName(sequenceObject.name);
    setTags(sequenceObject.tags ? sequenceObject.tags : "");
    // setEditMessages([]);
    const { rows: newRows, model: newModel } = buildRowsandModel(
      sequenceType,
      sequenceObject
    );
    setRows(newRows);
    setRowModesModel(newModel);

    console.log(
      "sd: new sequenceobject or sequencetype, sequenceObject, newRows, newColumns, newmodel",
      sequenceType,
      sequenceObject,
      newRows,
      newModel
    );
  }, [sequenceType, sequenceObject]);
  useEffect(() => {
    console.log(
      `${sequenceType}sequencedialog received response`,
      dbResponse.type
    );
    switch (dbResponse.type) {
      case RESPONSETYPE.error:
        if ((dbResponse as DbErrorType).message != "") {
          setEditMessages((oldMessages) => [
            ...oldMessages,
            (dbResponse as MessageType).message,
          ]);
          console.log("error is ", (dbResponse as DbErrorType).message);
        }
        break;
      case RESPONSETYPE.taglist:
        setTagList((dbResponse as DbTagListType).value);
        break;
      default:
        console.log(
          `${sequenceType}sequencedialog not processing response`,
          dbResponse.type
        );
    }
  }, [dbResponse]);
  useEffect(() => {
    const editRow = rows.find(
      (row) => rowModesModel[row.id]?.mode == GridRowModes.Edit
    );
    setEnableTransaction(!editRow);
    console.log(
      "sd rowmodesmodel change enable transaction, rows, rowModesModel",
      !editRow,
      rows,
      rowModesModel
    );
  }, [rows, rowModesModel]);



  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((oldModel) => {
      if (oldModel[id].mode == GridRowModes.Edit) return oldModel;
      const newModel = { ...oldModel, [id]: { mode: GridRowModes.Edit } };
      console.log("sd edit click new model", newModel);
      return newModel;
    });
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel((oldModel) => {
      if (oldModel[id].mode == GridRowModes.View) return oldModel;
      const newModel = { ...oldModel, [id]: { mode: GridRowModes.View } };
      console.log("sd save click id, newModel", newModel);
      return newModel;
    });
  };

  // on a delete remove the row and update the new value
  const handleDeleteClick = (id: GridRowId) => () => {
    setRows((rows) => {
      const newRows: GridValidRowModel[] = rows.filter((row) => row.id !== id);
      console.log("sd delete click  newRows", newRows);
      return newRows;
    });
  };

  // on a cancel revert to the previous row's value and if the row is
  // new, remove it
  const handleCancelClick = (id: GridRowId) => () => {
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

  // when the row changes flag it as not new
  const processRowUpdate = (
    newRow: GridValidRowModel,
    _oldRow: GridValidRowModel,
    _params: { rowId: GridRowId }
  ): GridValidRowModel => {
    const updatedRow = {...newRow, isNew: false};
    console.log('sd processrowupdate updated row', updatedRow);
    return updatedRow;
    // try {
    //   console.log("sd processrow update - validate");
    //   const updatedRow = { ...newRow, isNew: false };
    //   const errors: ErrorMessages = validateRow(sequenceType, updatedRow);

    //   // on an error put the row back in edit mode and put the new row into the rows collection
    //   if (errors.length > 0) {
    //     setRowModesModel((oldModel: GridRowModesModel) => {
    //       const newModel = {
    //         ...oldModel,
    //         [newRow.id]: { mode: GridRowModes.Edit },
    //       };
    //       console.log("sd processupdate on error newmodel", newModel);
    //       return newModel;
    //     });
    //     setRows((rows) => {
    //       const newRows = rows.map((row) =>
    //         row.id == newRow.id ? newRow : row
    //       );
    //       console.log("sd processupdate on error newrow", newRows);
    //       return newRows;
    //     });
    //     setEditMessages(errors);
    //     return newRow;
    //   }

    //   //otherwise set it to the updated one
    //   setRows((rows) => {
    //     const newRows = rows.map((row) =>
    //       row.id == newRow.id ? updatedRow : row
    //     );
    //     console.log("sd processupdate updated row", newRows);
    //     return newRows;
    //   });
    //   setEditMessages([]);
    //   return updatedRow;
    // } catch (e) {
    //   console.log("ad process update exception", e);
    //   return newRow;
    // }
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    console.log("sd onerowmodelsmodelchange newrowmodesmode", newRowModesModel);
    setRowModesModel(newRowModesModel);
  };

  // define the columns for this sequencetype 
      const columns: GridColDef[] = buildGridColumns(
      getItemProperties(sequenceType)
    );

    // add the actions column
        // add getActions to the columns so that addressibility on the row model is achieved
    columns.push({
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 200,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
        console.log('sd actions are in edit mode, rowmodel, iseditmode, id', rowModesModel, isInEditMode, id)
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



  // update the columns when a new rows model is provided
  // useEffect(()=> {
  //   // skip this if the rowmodesmodel has not yet been defined
  //   if (Object.keys(rowModesModel).length === 0) return;

  //   console.log('sd columns being defined for rowmodesmodel ', rowModesModel);
  //   const newColumns: GridColDef[] = buildGridColumns(
  //     getItemProperties(sequenceType),
  //     rowModesModel,
  //     handleSaveClick,
  //     handleDeleteClick,
  //     handleCancelClick,
  //     handleEditClick
  //   );
  //   setColumns(newColumns);

  // }, [rowModesModel])

  // handle the error and taglist responses from the db
  // the db is only used here to get the most recent tag list
  // for use in validating tags (maybe remove)
  // when all rows are not in edit mode enable the apply button

  //   const handleEditClick = useCallback((id: GridRowId) => () => {
  //     setRowModesModel((oldModel) => {
  //       const newModel = {...oldModel, [id]: { mode: GridRowModes.Edit }};
  //       console.log("sd edit click new model", newModel);
  //       return newModel;
  //     });
  //   },[]
  // );

  //   const handleSaveClick = useCallback(
  //     (id: GridRowId) => () => {
  //       setRowModesModel((oldModel) => {
  //       const newModel = {...oldModel, [id]: { mode: GridRowModes.View }};
  //         console.log("sd save click id, newModel", newModel);
  //         return newModel;
  //       });
  //     },
  //     []
  //   );

  //   // on a delete remove the row and update the new value
  //   const handleDeleteClick = useCallback(
  //     (id: GridRowId) => () => {
  //       const newRows: GridValidRowModel[] = rows.filter((row) => row.id !== id);
  //       console.log("sd delete click  newRows", newRows);
  //       setRows(newRows);
  //     },
  //     []
  //   );

  //   // on a cancel revert to the previous row's value and if the row is
  //   // new, remove it
  //   const handleCancelClick = useCallback(
  //     (id: GridRowId) => () => {
  //       setRowModesModel((oldModel) => {
  //       const newModel = {...oldModel, [id]: { mode: GridRowModes.View, ignoreModifications: true }};
  //         console.log("sd cancel click id, newModel", newModel);
  //         return newModel;
  //       });

  //       const editedRow = rows.find((row) => row.id === id);

  //       if (editedRow?.isNew) {
  //         console.log("sd cancel removing new row");
  //         const newRows: GridValidRowModel[] = rows.filter(
  //           (row) => row.id !== id
  //         );
  //         setRows(newRows);
  //       }
  //     },
  //     []
  //   );

  function handleApply() {
    // do the validation of the value and the time sequence
    console.log("sd handleapply entered");
    if (name == "") {
      setEditMessages((oldMessages) => [
        ...oldMessages,
        "Sequence Name must not be blank",
      ]);
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
    //     setEditMessage((oldMessages) => ([...oldMessages, `'${errorTag}' is not a valid tag.`])
    //     return;
    // }

    // validate the attribute values and times0
    // console.log("sd handle apply validating rows", rows);
    // const errors: ErrorMessages = validateRows(
    //   sequenceType,
    //   [...rows],
    //   setRowModesModel
    // );
    // const allErrors: ErrorMessages = [...editMessages, ...errors];
    // setEditMessages(allErrors);
    // if (allErrors.length > 0) {
    //   console.log("sd apply click, errors found");
    //   return;
    // }

    console.log(
      "sd apply no errors, rows, sequencetype, sequenceobject",
      rows,
      sequenceType,
      sequenceObject
    );
    // all's well so move the rows to the sequence object and encode
    // the items as a JSON object to send to the database
    const value: string = moveToObjectandEncode(
      sequenceType,
      [...rows],
      sequenceObject
    );
    console.log("sd apply for sequence name, tags, value", name, tags, value);
    // add or modify the new record
    fetchData(
      `/${sequenceType}/${name}?value=${encodeURIComponent(
        value
      )}&tags=${encodeURIComponent(tags)}`,
      mode == EDITMODE.Add ? "POST" : "PUT",
      null,
      setDbResponse
    );

    // request a new tag list as the tags may have been updated
    // need to wait for the previous fetch to complete
    // setTimeout(() => {
    // fetchData(`/tag`, "GET", null, setDbResponse);
    // });
    // setMode(EDITMODE.None);
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
          <DataGrid
            // pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[5, 10, 15, 20]}
            editMode="row"
            rows={rows}
            columns={columns}
            rowModesModel={rowModesModel}
            onRowModesModelChange={handleRowModesModelChange}
            processRowUpdate={processRowUpdate}
            onProcessRowUpdateError={(e) => {
              console.log("sd processrowupdate error", e);
            }}
            slots={{
              toolbar: EditToolbar,
            }}
            slotProps={{
              toolbar: {
                setRows,
                setRowModesModel,
                setEditMessages: setEditMessages,
                sequenceType: sequenceType,
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
          onClick={() => handleApply()}
        >
          {mode}
        </button>
        <button className="cancelbutton" onClick={() => setMode(EDITMODE.None)}>
          Cancel
        </button>
        <br />
        {editMessages.map((message, i) => (
          <>
            <div className="errormessage" key={`errormessage-${i}`}>
              {message}
            </div>
            <br />
          </>
        ))}
      </div>
    </>
  );
}

