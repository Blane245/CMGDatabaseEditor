import { Preset } from "sfcomponents/types";
import { DbErrorType, RESPONSETYPE, VoiceType } from "types";

export default class Voice {
  name: string = "";
  description: string = "";
  timbre: string = "sustained";
  registerLo: number = 0;
  registerHi: number = 0;
  duration: number = 0;
  soundFontFile: string = "";
  presetName: string = "";
  preset: Preset | undefined = undefined;

  copy(): Voice {
    const n: Voice = new Voice();
    n.name = this.name;
    n.description = this.description;
    n.duration = this.duration;
    n.registerHi = this.registerHi;
    n.registerLo = this.registerLo;
    n.timbre = this.timbre;
    n.presetName = this.presetName;
    n.soundFontFile = this.soundFontFile
    n.preset = this.preset;
    return n;
  }
  static validate(v: Voice, _voices: VoiceType[]): DbErrorType[] {
    const e: DbErrorType[] = [];
    if (v.name.trim() == "" || v.name.includes(","))
      e.push({
        type: RESPONSETYPE.error,
        message: "Voice name must not be blank or contain commas",
      });
    if (v.registerLo < 0 || v.registerHi < v.registerLo)
      e.push({
        type: RESPONSETYPE.error,
        message: "Voice register is illformed",
      });
    if (v.soundFontFile.trim() == "")
      e.push({
        type: RESPONSETYPE.error,
        message: "Soundfont File must be specified",
      });
    if (v.presetName.trim() == "")
      e.push({
        type: RESPONSETYPE.error,
        message: "Preset must be specified",
      });
   // if (voices.findIndex((voice) => v.name == voice.name) >= 0)
    //   e.push({
    //     type: RESPONSETYPE.error,
    //     message: "Voice name must be unique",
    //   });
    return e;
  }
}
