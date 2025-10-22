import { JSX } from "react";
import Sequences from "sections/sequences";
import { Attribute, DbResponseType } from "types";
import Tags from "./tags";
import { useEditorContext } from "CMGSequenceEditorContext";

export default function Body(): JSX.Element {
  const { sequenceType, setMessage, setDbResponse, dbResponse } = useEditorContext();
  return (
    <>
      {sequenceType != Attribute.none ? (
        <>
          <Sequences/>
          <Tags/>
        </>
      ) : null}
    </>
  );
}
