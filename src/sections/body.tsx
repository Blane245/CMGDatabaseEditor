import { JSX } from "react";
import Sequences from "sections/sequences";
import { Attribute, DbResponseType } from "types";
import Tags from "./tags";

interface BodyProps {
  sequenceType: Attribute;
  setMessage: Function;
  dbResponse: DbResponseType;
  setDbResponse: Function;
}
export default function Body(props: BodyProps): JSX.Element {
  const { sequenceType, setMessage, setDbResponse, dbResponse } = props;
  return (
    <>
      {sequenceType != Attribute.none ? (
        <>
          <Sequences
            sequenceType={sequenceType}
            setMessage={setMessage}
            setDbResponse={setDbResponse}
            dbResponse={dbResponse}
          />
          <Tags
            sequenceType={sequenceType}
            setMessage={setMessage}
            setDbResponse={setDbResponse}
            dbResponse={dbResponse}
          />
        </>
      ) : null}
    </>
  );
}
