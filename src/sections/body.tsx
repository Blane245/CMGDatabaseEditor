import { useEditorContext } from "CMGdatabaseeditorcontext";
import { JSX } from "react";
import { PARTITIONTYPE } from "types";
import Ensembles from "./subsections/ensembles";
import Sequences from "./subsections/sequences";
import Tags from "./subsections/tags";
import Voices from "./subsections/voices";

export default function Body(): JSX.Element {
  const { partition } = useEditorContext();
  return (
    <>
      {!!(partition == PARTITIONTYPE.sequencer) &&(
        <>
          <Sequences />
          <Tags />
        </>
      )}
      {!!(partition == PARTITIONTYPE.ensemble) &&(
        <>
          <Ensembles />
          <Voices />
        </>
      )}
    </>
  );
}
