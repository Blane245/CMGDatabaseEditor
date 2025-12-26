import "App.css";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import Body from "sections/body";
import Header from "sections/header";
import {
  MessageType,
  RESPONSETYPE
} from "./types";
import { useEffect } from "react";
import Footer from "sections/footer";

function App() {
  const {
    setMessage,
    dbResponse
  } = useEditorContext();
  useEffect(() => {
    if (dbResponse.type == RESPONSETYPE.error) {
          setMessage(dbResponse as MessageType);
  }
}, [dbResponse]);

  return (
    <div className="layout">
      <div className="header">
        <Header
          name={import.meta.env.NAME}
          version={import.meta.env.VERSION}
        />
      </div>
      <div className="body">
        <Body/>
      </div>
      <div className="footer">
        <Footer/>
      </div>
    </div>
  );
}

export default App;
