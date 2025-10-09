import { JSX } from "react";
import Sequences from "sections/sequences";
import Tags from "sections/tags";
import { Attribute, DbResponseType } from "types";

interface BodyProps {
  sequenceType: Attribute;
    setMessage: Function;
    dbResponse:DbResponseType;
    setDbResponse: Function;
}
export default function Body (props: BodyProps): JSX.Element {
    const {sequenceType, setMessage, setDbResponse, dbResponse} = props;
    return (
        <>
        {sequenceType != Attribute.none? 
        <>
            <Sequences 
            sequenceType={sequenceType}
            setMessage={setMessage}
            setDbResponse={setDbResponse}
            dbResponse={dbResponse}
            />
            {/* TODO move to Sequences */}
          {/* <div className="tag">
            <Tags 
            sequenceType={sequenceType}
            setMessage={setMessage}
            setDbResponse={setDbResponse}
            dbResponse={dbResponse}
            />
          </div> */}
          </>
        : null}
        </>
    )
}
