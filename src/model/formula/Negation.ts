import Formula from "./Formula.ts";

/**
 * Represent negation
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Formula
 */
class Negation extends Formula {
  /**
   *
   * @param {Formula} subFormula
   */
  constructor(public subFormula: Formula) {
    super([subFormula], "", "");
    this.subFormula = subFormula;
  }

  /**
   *
   * @returns {string}
   */

  toString(): string {
    return `¬${this.subFormula.toString()}`;
  }

  toTex(): string {
    return `\\lnot ${this.subFormula.toString()}`;
  }

  flatten() {
    return new Negation(this.subFormula.flatten());
  }

/*
  **
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   *
  eval(structure: Structure, e: Valuation): boolean {
    return !this.subFormula.eval(structure, e);
  }

  getVariables(): Set<Symbol> {
    return this.subFormula.getVariables();
  }

  getSignedType(_: boolean): SignedFormulaType {
    return SignedFormulaType.ALPHA;
  }
  getSignedSubFormulas(sign: boolean): SignedFormula[] {
    return [{ sign: !sign, formula: this.subFormula }];
  }*/
}

export default Negation;
