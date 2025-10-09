import "App.css";
import { useState } from "react";
import Body from "sections/body";
import Header from "sections/header";
import {
  Attribute,
  DbErrorType,
  DbResponseType,
  MessageType,
  RESPONSETYPE,
} from "./types";

function App() {
  const [message, setMessage] = useState<MessageType>({
    type: RESPONSETYPE.error,
    message: "",
  });
  const [dbResponse, setDbResponse] = useState<DbResponseType>({
    type: RESPONSETYPE.error,
    message: "",
  } as DbErrorType);
  const [sequenceType, setSequenceType] = useState<Attribute>(Attribute.none);

  return (
    <div className="layout">
      <div className="header">
        <Header 
        setSequenceType={setSequenceType}
        name={import.meta.env.NAME} 
        version={import.meta.env.VERSION} />
      </div>
      <div className="body">
        <Body
        sequenceType={sequenceType}
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
