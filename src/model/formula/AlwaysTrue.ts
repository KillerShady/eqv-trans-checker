import Formula from "./Formula.ts";

class AlwaysTrue extends Formula {
  constructor() {
    super([], "", "");
  }

  toString(): string {
    return `⊤`;
  }

  flatten() {
    return new AlwaysTrue();
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

export default AlwaysTrue;