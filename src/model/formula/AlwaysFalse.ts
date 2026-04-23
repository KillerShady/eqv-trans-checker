import Formula from "./Formula.ts";

class AlwaysFalse extends Formula {
  constructor() {
    super([], "", "");
  }

  toString(): string {
    return `⊥`;
  }

  flatten() {
    return new AlwaysFalse();
  }

    /*eval(_structure: Structure, _e: Valuation): boolean {
      throw new Error("Method not implemented.");
    }
    getSignedType(_sign: boolean): SignedFormulaType {
      throw new Error("Method not implemented.");
    }
    getSignedSubFormulas(_: boolean): SignedFormula[] {
      throw [];
    }*/
}

export default AlwaysFalse;