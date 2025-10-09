import AddIcon from "@mui/icons-material/Add";
import { Tooltip } from "@mui/material";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridRowModes,
  GridRowModesModel,
  GridRowsProp,
  GridValidRowModel,
  Toolbar,
  ToolbarButton,
  useGridApiRef
} from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import { Sequence } from "classes/sequences";
import buildGridColumns from "helpers/buildgridcolumns";
import buildRowsandModel from "helpers/buildrowsandmodel";
import getItemProperties from "helpers/getItemproperties";
import moveToObjectandEncode from "helpers/movetoobjecdtandencode";
import validateRows from "helpers/validaterows";
import { JSX, useEffect, useState } from "react";
import fetchData from "utils/fetchdata";
import {
  Attribute,
  DbErrorType,
  DbResponseType,
  DbTagListType,
  EDITMODE,
  ErrorMessages,
  ItemProperties,
  MessageType,
  RESPONSETYPE,
  TagItem
} from "../types";
import toTitleCase from "utils/totitlecase";
declare module "@mui/x-data-grid" {
  interface ToolbarPropsOverrides {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
    setEditMessages: (newMessages: ErrorMessages) => void;
    setValue: (value: string) => void;
    seqType: Attribute;
  }
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

// the editable datagrid for handle
// the sequenceobject contains the array of sequenceitem objects that are used to build the rows
// the itemproperties contains the array of properties of the items that is used to build the column definitions
// the sequenceitems are loaded into the rows of the data grid
// when all row updating is done, the sequence object is rebuild with the new data
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
  const [seqType, setSeqType] = useState<Attribute>(Attribute.none);
  const [name, setName] = useState<string>("");
  const [columns, setColumns] = useState<GridColDef[]>([]);
  const [tags, setTags] = useState<string>("");
  const [enableTransaction, setEnableTransaction] = useState<boolean>(false);
  const [editMessages, setEditMessages] = useState<ErrorMessages>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [tagList, setTagList] = useState<TagItem[]>([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const apiRef = useGridApiRef();
  useEffect(()=> {
    setSeqType(sequenceType);
  },[sequenceType]);
  // set the grid rows, columns, and row models based on the sequence object
  useEffect(() => {
    setName(sequenceObject.name);
    setTags(sequenceObject.tags);
    setEditMessages([]);
    const { rows: newRows, model: newModel } = buildRowsandModel(
      seqType,
      sequenceObject
    );
    setRows(newRows);
    setRowModesModel(newModel);
    const itemProperties: ItemProperties = getItemProperties(sequenceType);
        const newColumns: GridColDef[] = buildGridColumns(
      itemProperties,
      rowModesModel,
      handleSaveClick,
      handleDeleteClick,
      handleCancelClick,
      handleEditClick
    );
    
    setColumns(newColumns);
    console.log('sd: sequenceobject fired, columns:', newColumns);
  }, [seqType,sequenceObject]);

  // handle the error and taglist responses from the db
  // the db is only used here to get the most recent tag list
  // for use in validating tags (maybe remove)
  useEffect(() => {
    console.log(
      `${seqType}sequencedialog received response`,
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
          `${seqType}sequencedialog not processing response`,
          dbResponse.type
        );
    }
  }, [dbResponse]);

  // when all rows are not in edit mode enable the apply button
  useEffect(() => {
    const editRow = rows.find(
      (row) => rowModesModel[row.id]?.mode == GridRowModes.Edit
    );
    setEnableTransaction(!editRow);
    console.log('sd rowmodesmodel fired enable transaction, rowModesModel', !editRow, rowModesModel);
  }, [rowModesModel]);

  const handleEditClick = (id: GridRowId) => () => {
    setRowModesModel((oldModel) => { 
      console.log('sd edit click old model', oldModel);
      return {
      ...oldModel,
      [id]: { mode: GridRowModes.Edit },
    }});
  };

  const handleSaveClick = (id: GridRowId) => () => {
    setRowModesModel((oldModel) => { 
      console.log('sd save click id, oldModel', id, oldModel);
      return{
      ...oldModel,
      [id]: { mode: GridRowModes.View },
    }});
  };

  // on a delete remove the row and update the new value
  const handleDeleteClick = (id: GridRowId) => () => {
    const newRows: GridValidRowModel[] = rows.filter((row) => row.id !== id);
    console.log('sd delete click id , neewRows', id, newRows);

    setRows(newRows);
  };

  // on a cancel revert to the previous row's value and if the row is
  // new, remove it
  const handleCancelClick = (id: GridRowId) => () => {
    setRowModesModel((oldModel) => {
      console.log('sd cancel click id, oldModel', id, oldModel);
      return {
      ...oldModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }});;

    const editedRow = rows.find((row) => row.id === id);

    if (editedRow?.isNew) {
      console.log('sd cancel removing new row');
      const newRows: GridValidRowModel[] = rows.filter((row) => row.id !== id);
      setRows(newRows);
    }
  };

  function handleApply() {
    // do the validation of the value and the time sequence
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

    // validate the attribute values and times
    const errors: ErrorMessages = validateRows(
      seqType,
      [...rows],
      setRowModesModel
    );
    const allErrors: ErrorMessages = [...editMessages, ...errors];
    setEditMessages(allErrors);
    if (allErrors.length > 0) {
      console.log('sd apply click, errors found');
      return;
    } 

    // all's well so move the rows to the sequence object and encode
    // the items as a JSON object to send to the database
    const value: string = moveToObjectandEncode(
      seqType,
      [...rows],
      sequenceObject
    );
    console.log('sd apply for sequence name, tags, value', name, tags, value);
    // add or moodify the new record
    fetchData(
      `/${seqType}/${name}?value=${encodeURIComponent(
        value
      )}&tags=${encodeURIComponent(tags)}`,
      mode == EDITMODE.Add ? "POST" : "PUT",
      null,
      setDbResponse
    );

    // request a new tag list as the tags may have been updated
   fetchData(`/tag`, "GET", null, setDbResponse);
  }
  const processRowUpdate = (updatedRow) => {
    console.log('sd processrow update - no action');
    return updatedRow;
  };

  return (
    <>
      <div className="edit-header">
        {`${mode} Note Sequence Editor`}
      </div>
      <div className="edit-body">
        <label >
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
            // initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => setPaginationModel(model)}
            pageSizeOptions={[5, 10, 15, 20]}
            // pagination
            apiRef={apiRef}
            rows={rows}
            getRowId={(row) => row.id}
            columns={columns}
            rowModesModel={rowModesModel}
            onRowModesModelChange={(newRowModesModel: GridRowModesModel) => {
              console.log('sd rowmodelsmodelchange newmodels', newRowModesModel);
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
                setEditMessages: setEditMessages,
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

interface EditToolbarProps {
  setRows: Function;
  setRowModesModel: Function;
  setEditMessages: Function;
  seqType: Attribute;
}

function EditToolbar(props: EditToolbarProps) {
  const { setRows, setRowModesModel, setEditMessages, seqType } = props;

  const newSequenceRecord = (seqType: Attribute, id: GridRowId): {} => {
    switch (seqType) {
      case Attribute.note:
        return { id: id as string, note: "C4", beats: 1, isNew: true };
      case Attribute.speed:
        return { id: id as string, BPM: 60, time: 0, isNew: true };
      case Attribute.attack:
        return { id: id as string, attack: 63, time: 0, isNew: true };
      case Attribute.duration:
        return { id: id as string, duration: 100, time: 0, isNew: true };
      case Attribute.volume:
        return { id: id as string, volume: 0, time: 0, isNew: true };
      case Attribute.pan:
        return { id: id as string, pan: 0, time: 0, isNew: true };
      default:
        return { id: id };
    }
  };

  const handleAdd = () => {
    const id = randomId();
    setRows((oldRows: GridRowsProp) => { 
      console.log('sd add row id, oldRows, new record', id, oldRows, newSequenceRecord(seqType, id));
      return [
      ...oldRows,
      newSequenceRecord(seqType, id),
    ]});
    setRowModesModel((oldModel: GridRowModesModel) => {
      console.log('sd add row id, oldModel', id, oldModel);
      return {
      ...oldModel,
      [id]: { mode: GridRowModes.Edit },
    }});
    setEditMessages([]);
  };

  return (
    <Toolbar>
      <Tooltip title={`Add ${toTitleCase(seqType)} item`}>
        <ToolbarButton onClick={handleAdd}>
          <AddIcon fontSize="small" />
        </ToolbarButton>
      </Tooltip>
    </Toolbar>
  );
}
