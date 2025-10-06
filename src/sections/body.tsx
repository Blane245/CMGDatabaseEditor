import { type Connection } from "mysql2";
import { JSX, useState } from "react"
import Tags from "./tags";
import NoteSequences from "./notesequences";
import { DbResponseType } from "types";

interface BodyProps {
    setMessage: Function;
    dbResponse:DbResponseType;
    setDbResponse: Function;
}
export default function Body (props: BodyProps): JSX.Element {
    const {setMessage, setDbResponse, dbResponse} = props;
    return (
        <>
            <NoteSequences 
            setMessage={setMessage}
            setDbResponse={setDbResponse}
            dbResponse={dbResponse}
            />
          <div className="tag">
            <Tags setMessage={setMessage}
            setDbResponse={setDbResponse}
            dbResponse={dbResponse}
            />
          </div>
        </>
    )
}
