import Formula, { type SignedFormula, SignedFormulaType } from "./Formula.ts";
import Term from "../term/Term.ts";
import Structure, { type Valuation } from "../Structure.ts";

/**
 * Represent predicate symbol
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Formula
 */
class PredicateAtom extends Formula {
  /**
   *
   * @param {string} name
   * @param {Term[]} terms
   */
  constructor(public name: string, public terms: Term[] = []) {
    super([], "", "");
  }

  /**
   *
   * @param {Structure} structure
   * @param {Map} e
   * @return {boolean}
   */
  eval(structure: Structure, e: Valuation): boolean {
    let translatedTerms: string[] = [];
    try {
      translatedTerms = this.terms.map((term) => term.eval(structure, e));
    } catch (error) {
      //console.log(error);
      throw error;
    }

    const interpretation = structure.iP.get(this.name);
    //console.log(translatedTerms);

    if (interpretation === undefined) {
      throw new Error(
        `The interpretation of the predicate symbol ${this.name} is not defined`
      );
    }
    //console.log();

    // const arr = ["a"];
    // const set = new Set();
    // set.add(arr);
    // console.log(`${set.has(["a"])}`);

    //sets compare elements by reference => arr !== ["a"] switch to arrays?
    // let tru = false;
    // interpretation.forEach((tuple) => {
    //   if (JSON.stringify(tuple) === JSON.stringify(translatedTerms)) {
    //     tru = true;
    //   }
    // });

    return structure.iPHas(this.name, translatedTerms);
    //return interpretation.has(translatedTerms);
  }

  /**
   *
   * @returns {string}
   */
  toString(): string {
    return `${this.name}(${this.terms.join(", ")})`;
  }

  toTex(): string {
    return this.toString();
  }

  getSubFormulas(): Formula[] {
    return [];
  }

  getSignedType(_: boolean): SignedFormulaType {
    return SignedFormulaType.ALPHA;
  }
  getSignedSubFormulas(_: boolean): SignedFormula[] {
    return [];
  }

  // createCopy(): PredicateAtom {
  //   return new PredicateAtom(
  //     this.name,
  //     this.terms.map((term) => term.createCopy())
  //   );
  // }

  // substitute(from, to, bound) {
  //   return new PredicateAtom(
  //     this.name,
  //     this.terms.map((term) => term.substitute(from, to, bound))
  //   );
  // }

  equals(other: Formula): boolean {
    if (! (other instanceof PredicateAtom) ||
        this.terms.length !== other.terms.length ||
        this.name !== other.name) return false;
    for (let i = 0; i < this.terms.length; i++) {
      if (!this.terms[i].equals(other.terms[i])) return false;
    }
    return true;
  }
}

export default PredicateAtom;
