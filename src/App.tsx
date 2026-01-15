import "App.css";
import { useEditorContext } from "CMGdatabaseeditorcontext";
import Body from "sections/body";
import Header from "sections/header";
import {
  DEFAULTLOCALSFURI,
  MessageType,
  RESPONSETYPE,
  SFFILELOCATION,
} from "./types";
import { useEffect, useState } from "react";
import Footer from "sections/footer";
import { getDirectoryList } from "utils/getdirectorylist";

function App() {
  const { setSFLocalDirectory, setSFFileList, dbResponse, setMessage } =
    useEditorContext();
  const [status, setStatus] = useState<string>("");
  useEffect(() => {
    let SFFileLocation: string | null =
      window.localStorage.getItem(SFFILELOCATION);
    if (!SFFileLocation) {
      window.localStorage.setItem(SFFILELOCATION, DEFAULTLOCALSFURI);
      SFFileLocation = DEFAULTLOCALSFURI;
      setSFLocalDirectory(SFFileLocation);
    } else setSFLocalDirectory(SFFileLocation);

    // load the soundfont file list
    try {
      getDirectoryList(
        SFFileLocation,
        ["sf2", "SF2"],
        setSFFileList,
        setStatus
      );
    } catch (error) {
      setStatus(error as string);
    }
  }, []);
  useEffect(() => {
    if (dbResponse.type == RESPONSETYPE.error) {
      setMessage(dbResponse as MessageType);
    }
  }, [dbResponse]);

  return (
    <div className="layout">
      <div className="header">
        <Header name={import.meta.env.NAME} version={import.meta.env.VERSION} />
      </div>
      <div className="body">
        <Body />
      </div>
      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}

export default App;
