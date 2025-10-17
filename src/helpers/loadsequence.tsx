import Sequence from "classes/sequences";
import {
  Attribute,
  DbResponseType,
  DbSequenceType,
} from "types";

export default function loadSequence(
  sequenceType: Attribute,
  dbResponse: DbResponseType,
  setSequenceObject: (value: React.SetStateAction<Sequence | null>) => void
): void {
  const sequenceObject:Sequence =  new Sequence(sequenceType);
  sequenceObject.name = (dbResponse as DbSequenceType).value.name;
  sequenceObject.tags = (dbResponse as DbSequenceType).value.tags;
  sequenceObject.decode((dbResponse as DbSequenceType).value.items);
  setSequenceObject(sequenceObject);
}
