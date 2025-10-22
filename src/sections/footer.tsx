import { useEditorContext } from "CMGSequenceEditorContext";
import { JSX } from "react";
import { RESPONSETYPE } from "types";

export default function Footer(): JSX.Element {
  const { message } = useEditorContext();
  return (
    <div
      className={
        message.type == RESPONSETYPE.error ? "errormessage" : "infomessage"
      }
    >
      {message.message}
    </div>
  );
}
