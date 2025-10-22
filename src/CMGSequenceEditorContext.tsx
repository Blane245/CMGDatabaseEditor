import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { Attribute, DbErrorType, DbResponseType, EDITMODE, MessageType, RESPONSETYPE } from "types";

interface CMGSequenceEditContextProps {
    message: MessageType;
    setMessage: Dispatch<SetStateAction<MessageType>>;
    dbResponse: DbResponseType;
    setDbResponse: Dispatch<SetStateAction<DbResponseType>>;
    sequenceType: Attribute;
    setSequenceType: Dispatch<SetStateAction<Attribute>>;
    mode: EDITMODE;
    setMode: Dispatch<SetStateAction<EDITMODE>>;
}

const EditContext = createContext<CMGSequenceEditContextProps | undefined>(undefined);

export const EditorProvider = ({children}: {children: ReactNode}) => {
  const [message, setMessage] = useState<MessageType>({
    type: RESPONSETYPE.error,
    message: "",
  });
    const [dbResponse, setDbResponse] = useState<DbResponseType>({
      type: RESPONSETYPE.error,
      message: "",
    } as DbErrorType);
    const [sequenceType, setSequenceType] = useState<Attribute>(Attribute.none); 
    const [mode, setMode] = useState<EDITMODE>(EDITMODE.None);
    
const contextValue = {
    message,
    setMessage,
    dbResponse,
    setDbResponse,
    sequenceType,
    setSequenceType,
    mode, setMode,
}
return (
    <EditContext.Provider value={contextValue}>{children}</EditContext.Provider>
)
}
export const useEditorContext = (): CMGSequenceEditContextProps => {
    const context = useContext(EditContext);

    if (context == undefined)
        throw new Error ('UseEditorContext must be used within an EditContext Provider');
    return context;
}
