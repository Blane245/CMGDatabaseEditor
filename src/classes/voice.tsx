import { DbErrorType, ErrorMessage, RESPONSETYPE, VoiceType } from "types";

export default class Voice {
  name: string = "";
  description: string = "";
  timbre: string = "sustained";
  registerLo: number = 0;
  registerHi: number = 0;
  intervalMean: number = 0;
  duration: number = 0;
  noiseFrequency: number = 0;
  noiseAmplitude: number = 0;

  copy(): Voice {
    const n: Voice = new Voice();
    n.name = this.name;
    n.description = this.description;
    n.duration = this.duration;
    n.intervalMean = this.intervalMean;
    n.noiseAmplitude = this.noiseAmplitude;
    n.noiseFrequency = this.noiseFrequency;
    n.registerHi = this.registerHi;
    n.registerLo = this.registerLo;
    n.timbre = this.timbre;
    return n;
  }
  static validate(v: Voice, voices: VoiceType[]): DbErrorType[] {
    const e: DbErrorType[] = [];
    if (v.name == "" || v.name.includes(","))
      e.push({
        type: RESPONSETYPE.error,
        message: "Voice name must not be blank or contain commas",
      });
    if (v.registerLo < 0 || v.registerHi < v.registerLo)
      e.push({
        type: RESPONSETYPE.error,
        message: "Voice register is illformed",
      });
    // if (voices.findIndex((voice) => v.name == voice.name) >= 0)
    //   e.push({
    //     type: RESPONSETYPE.error,
    //     message: "Voice name must be unique",
    //   });
    return e;
  }
}
