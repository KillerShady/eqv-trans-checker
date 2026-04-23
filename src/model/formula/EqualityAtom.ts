import Term from "../term/Term.ts";
import Formula from "./Formula.ts";
import type Expression from "../Expression.ts";

/**
 * Represent equality symbol
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Formula
 */
class EqualityAtom extends Formula {
  /**
   *
   * @param {Term} subLeft
   * @param {Term} subRight
   */
  constructor(public subLeft: Term, public subRight: Term) {
    super([], "=", "=");
  }

  /**
   *
   * @returns {string}
   */
  toString(): string {
    return `${this.subLeft.toString()} = ${this.subRight.toString()}`;
  }

  toTex(): string {
    return this.toString();
  }

  flatten() {
    return new EqualityAtom(this.subLeft.flatten(), this.subRight.flatten());
  }

  compare(other: Expression): number {
    const constructorA = this.constructor.name;
    const constructorB = other.constructor.name;
    if (! (other instanceof EqualityAtom)) {
      return constructorA === constructorB ? 0 :
             constructorA < constructorB ? -1 : 1;
    }
    const comparisonLeft = this.subLeft.compare(other.subLeft);
    if (comparisonLeft !== 0) {
      return comparisonLeft;
    }
    return this.subRight.compare(other.subRight);
  }

  /*
  **
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   *
  eval(structure: Structure, e: Valuation): boolean {
    return this.subLeft.eval(structure, e) === this.subRight.eval(structure, e);
  }


  getSignedType(_sign: boolean): SignedFormulaType {
    return SignedFormulaType.ALPHA;
  }

  getSignedSubFormulas(_sign: boolean): SignedFormula[] {
    return [];
  }*/
}

export default EqualityAtom;
