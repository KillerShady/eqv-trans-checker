import Formula from "./Formula.ts";
import QuantifiedFormula from "./QuantifiedFormula.ts";

/**
 * Represent universal quantificator
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Formula
 */
class UniversalQuant extends QuantifiedFormula {
  /**
   *
   * @param {string} variableName
   * @param {Formula} subFormula
   */
  constructor(public variableName: string, public subFormula: Formula) {
    super(variableName, subFormula, "∀", "\\forall");
  }

  flatten() {
    return new UniversalQuant(this.variableName, this.subFormula.flatten());
  }

  /*
  **
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   *
  eval(structure: Structure, e: Valuation): boolean {
    let eCopy = new Map(e);
    for (let item of structure.domain) {
      eCopy.set(this.variableName, item);
      try {
        if (!this.subFormula.eval(structure, eCopy)) {
          return false;
        }
      } catch (error) {
        throw error;
      }
    }
    return true;
  }

  getSignedType(sign: boolean): SignedFormulaType {
    return sign ? SignedFormulaType.GAMMA : SignedFormulaType.DELTA;
  }*/
}

export default UniversalQuant;
