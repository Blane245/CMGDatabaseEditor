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

export const toNote = (pitch: number): string => {
  if (pitch < 0) return "REST";
  const baseMidi:number = Math.round(pitch);
  const cents: number = Math.round((pitch - baseMidi) * 100);
  const octave = Math.trunc(baseMidi / 12) - 1;
  const noteNumber = baseMidi - 12 * (octave + 1);
  const extra: string = cents == 0 ? "" : Intl.NumberFormat("en-US", {
    signDisplay: "exceptZero"}).format(cents);
  const noteName: string =
    noteNumber >= 0 && noteNumber < 12 ? noteNames[noteNumber] : "?";
  return noteName.concat(octave.toString().concat(extra));
};
