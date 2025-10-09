import {
  AttackSequence,
  DurationSequence,
  NoteSequence,
  PanSequence,
  Sequence,
  SpeedSequence,
  VolumeSequence,
} from "classes/sequences";
import { Attribute } from "types";

export default function addSequence(
  sequenceType: Attribute,
  setSequenceObject: (value: React.SetStateAction<Sequence | null>) => void,
): void {
  switch (sequenceType) {
    case Attribute.note:
      setSequenceObject(new NoteSequence());
      break;
    case Attribute.speed:
      setSequenceObject(new SpeedSequence());
      break;
    case Attribute.attack:
      setSequenceObject(new AttackSequence());
      break;
    case Attribute.duration:
      setSequenceObject(new DurationSequence());
      break;
    case Attribute.volume:
      setSequenceObject(new VolumeSequence());
      break;
    case Attribute.pan:
      setSequenceObject(new PanSequence());
      break;
  }
}
