const notePattern: RegExp = /[A-G,a-g][#,b]?\d([+-]\d\d)?/;
export default function checkNote(note: string): boolean {
  const match: RegExpExecArray | null = notePattern.exec(note);
  return match != null && match[0] == note;
}
