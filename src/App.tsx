import { useEffect, useState } from "react";
import {
  DbErrorType,
  DbResponseType,
  MessageType,
  RESPONSETYPE,
} from "./types";
import "./App.css";
import Header from "./sections/header";
import Tags from "./sections/tags";
import NoteSequenceDialog from "./sections/notesequencedialog";
import NoteSequences from "./sections/notesequences";
import Body from "./sections/body";

function App() {
  const [message, setMessage] = useState<MessageType>({
    type: RESPONSETYPE.error,
    message: "",
  });
  const [mode, setMode] = useState<string>("");
  const [dbResponse, setDbResponse] = useState<DbResponseType>({
    type: RESPONSETYPE.error,
    message: "",
  } as DbErrorType);
  const [showEdit, setShowEdit] = useState<boolean>(false);

  return (
    <div className="layout">
      <div className="header">
        <Header name={import.meta.env.NAME} version={import.meta.env.VERSION} />
      </div>
      <div className="body">
        <Body
          setMessage={setMessage}
          dbResponse={dbResponse}
          setDbResponse={setDbResponse}
        />
      </div>
      <div className="footer">
        <p
          className={
            message.type == RESPONSETYPE.error ? "errormessage" : "infomessage"
          }
        >
          {message.message}
        </p>
      </div>
    </div>
  );
}

export default App;
