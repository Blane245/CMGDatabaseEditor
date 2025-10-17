// convert a midi number to a note string
// if the midi number is outside the range 0-127, NaN is returned
const noteNames: string[] = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
export default function midiToNote(midi: number): string {
  if (midi == null || midi < 0 || midi > 127) return "NaN";
  const baseMidi:number = Math.round(midi);
  const cents: number = Math.round((midi - baseMidi) * 100);
  const octave = Math.trunc(baseMidi / 12);
  const noteNumber = baseMidi - 12 * (octave);
  const extra: string = cents == 0 ? "" : Intl.NumberFormat("en-US", {
    signDisplay: "exceptZero"}).format(cents);
  const noteName: string =
    noteNumber >= 0 && noteNumber < 12 ? noteNames[noteNumber] : "?";
  return noteName.concat((octave-1).toString().concat(extra));
}
