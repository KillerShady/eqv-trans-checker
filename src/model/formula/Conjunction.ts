import Formula from "./Formula.ts";

/**
 * Represent conjunction
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Formula
 */
class Conjunction extends Formula {
  /**
   *
   * @param {Formula} subLeft
   * @param {Formula} subRight
   */
  constructor(public subLeft: Formula, public subRight: Formula) {
    super([subLeft, subRight], " ∧ ", "\\land");
  }

  private flattenInplace(): void {
    if (this.subLeft instanceof Conjunction && this.subRight instanceof Conjunction) {
      this.subFormulas = [...this.subFormulas[0].getSubFormulas(), ...this.subFormulas[1].getSubFormulas()]
    } else if (this.subLeft instanceof Conjunction) {
      this.subFormulas = [...this.subFormulas[0].getSubFormulas(), this.subFormulas[1]]
    } else if (this.subRight instanceof Conjunction) {
      this.subFormulas = [this.subFormulas[0], ...this.subFormulas[1].getSubFormulas()]
    }
    this.subFormulas.sort((a, b) => a.compare(b));
  }

  flatten() {
    const flat = new Conjunction(this.subLeft.flatten(), this.subRight.flatten());
    flat.flattenInplace()
    return flat;
  }

  /*
  **
   *
   * @param {Structure} structure
   * @param {Map} e variables valuation
   * @return {boolean}
   *
  eval(structure: Structure, e: Valuation): boolean {
    const left = this.subLeft.eval(structure, e);
    const right = this.subRight.eval(structure, e);
    return left && right;
  }

  getSignedType(sign: boolean): SignedFormulaType {
    return sign ? SignedFormulaType.ALPHA : SignedFormulaType.BETA;
  }
  getSignedSubFormulas(sign: boolean): SignedFormula[] {
    return [
      { sign: sign, formula: this.subLeft },
      { sign: sign, formula: this.subRight },
    ];
  }*/
}

export default Conjunction;
