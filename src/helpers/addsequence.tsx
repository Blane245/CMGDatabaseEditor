import Sequence from "classes/sequences";
import { Attribute } from "types";

export default function addSequence(
  sequenceType: Attribute,
  setSequenceObject: (value: React.SetStateAction<Sequence | null>) => void
): void {
  const sequenceObject = new Sequence(sequenceType);
  setSequenceObject(sequenceObject);
}
