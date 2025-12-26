import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import {
  Attribute,
  DbErrorType,
  DbResponseType,
  EDITMODE,
  MessageType,
  PARTITIONTYPE,
  RESPONSETYPE,
} from "types";

interface CMGDatabaseEditContextProps {
  message: MessageType;
  setMessage: Dispatch<SetStateAction<MessageType>>;
  dbResponse: DbResponseType;
  setDbResponse: Dispatch<SetStateAction<DbResponseType>>;
  sequenceType: Attribute;
  setSequenceType: Dispatch<SetStateAction<Attribute>>;
  editMode: EDITMODE;
  setEditMode: Dispatch<SetStateAction<EDITMODE>>;
  partition: PARTITIONTYPE;
  setPartition: Dispatch<SetStateAction<PARTITIONTYPE>>;
}

const EditContext = createContext<CMGDatabaseEditContextProps | undefined>(
  undefined
);

export const EditorProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<MessageType>({
    type: RESPONSETYPE.error,
    message: "",
  });
  const [dbResponse, setDbResponse] = useState<DbResponseType>({
    type: RESPONSETYPE.error,
    message: "",
  } as DbErrorType);
  const [sequenceType, setSequenceType] = useState<Attribute>(Attribute.none);
  const [editMode, setEditMode] = useState<EDITMODE>(EDITMODE.None);
  const [partition, setPartition] = useState<PARTITIONTYPE>(PARTITIONTYPE.none);

  const contextValue = {
    message,
    setMessage,
    dbResponse,
    setDbResponse,
    sequenceType,
    setSequenceType,
    editMode,
    setEditMode,
    partition,
    setPartition,
  };
  return (
    <EditContext.Provider value={contextValue}>{children}</EditContext.Provider>
  );
};
export const useEditorContext = (): CMGDatabaseEditContextProps => {
  const context = useContext(EditContext);

  if (context == undefined)
    throw new Error(
      "UseEditorContext must be used within an EditContext Provider"
    );
  return context;
};
