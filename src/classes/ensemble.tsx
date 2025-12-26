import { DbErrorType, EnsembleType, ErrorMessages, RESPONSETYPE } from "types";

// contains the name, description, and voices ensemble
export default class Ensemble {
  name: string = "";
  description: string = "";
  voices: string[] = [];

  copy(): Ensemble {
    const n: Ensemble = new Ensemble();
    n.name = this.name;
    n.description = this.description;
    n.voices = [...this.voices];
    return n;
  }
  static validate(e: Ensemble, allEnsembles: EnsembleType[]): DbErrorType[] {
    const errors: DbErrorType[] = [];
    if (e.name.trim() == "")
      errors.push({
        type: RESPONSETYPE.error,
        message: `Ensemble name must not be blank`,
      });
    // if (allEnsembles.findIndex((ensemble) => e.name == ensemble.name) >= 0)
    //   errors.push({
    //     type: RESPONSETYPE.error,
    //     message: `An emsemble with that name already exists`,
    //   });
    return errors;
  }
}
