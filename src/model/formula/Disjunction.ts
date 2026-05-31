import Formula from "./Formula.ts";
/**
 * Represent disjunction
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Formula
 */
class Disjunction extends Formula {
  /**
   *
   * @param {Formula} subLeft
   * @param {Formula} subRight
   */
  constructor(public subLeft: Formula, public subRight: Formula) {
    super([subLeft, subRight], " ∨ ", "\\lor");
  }

  private flattenInplace(): void {
    if (this.subLeft instanceof Disjunction && this.subRight instanceof Disjunction) {
      this.subFormulas = [...this.subFormulas[0].getSubFormulas(), ...this.subFormulas[1].getSubFormulas()]
    } else if (this.subLeft instanceof Disjunction) {
      this.subFormulas = [...this.subFormulas[0].getSubFormulas(), this.subFormulas[1]]
    } else if (this.subRight instanceof Disjunction) {
      this.subFormulas = [this.subFormulas[0], ...this.subFormulas[1].getSubFormulas()]
    }
    this.subFormulas.sort((a, b) => a.compare(b));
  }

  flatten() {
    const flat = new Disjunction(this.subLeft.flatten(), this.subRight.flatten());
    flat.flattenInplace()
    return flat;
  }

  /*
  **
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   *
  eval(structure: Structure, e: Valuation): boolean {
    const left = this.subLeft.eval(structure, e);
    const right = this.subRight.eval(structure, e);
    return left || right;
  }

  getSignedType(sign: boolean): SignedFormulaType {
    return sign ? SignedFormulaType.BETA : SignedFormulaType.ALPHA;
  }
  getSignedSubFormulas(sign: boolean): SignedFormula[] {
    return [
      { sign: sign, formula: this.subLeft },
      { sign: sign, formula: this.subRight },
    ];
  }*/
}

export default Disjunction;
