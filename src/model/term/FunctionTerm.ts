import Term from "./Term.ts";
import type Expression from "../Expression.ts";

/**
 * Represent function term
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Term
 */
class FunctionTerm extends Term {
  /**
   *
   * @param {string} name name of the function
   * @param {Term[]} terms parameters of function
   */
  constructor(public name: string, public terms: Term[]) {
    super();
  }

  /**
   * Return string representation of function term
   * @returns {string}
   */
  toString(): string {
    let res = this.name + "(";
    for (let i = 0; i < this.terms.length; i++) {
      if (i > 0) {
        res += ", ";
      }
      res += this.terms[i].toString();
    }
    res += ")";
    return res;
  }

  toTex(): string {
    return this.toString();
  }

  flatten() {
    const copiedTerms: Term[] = [];
    for (let i = 0; i < this.terms.length; i++) {
      copiedTerms.push(this.terms[i].flatten());
    }
    return new FunctionTerm(this.name, copiedTerms);
  }

  compare(other: Expression): number {
    if (! (other instanceof FunctionTerm)) {
      return this.constructor.name === other.constructor.name ? 0 :
             this.constructor.name < other.constructor.name ? -1 : 1;
    }
    if (this.name !== other.name) {
       return this.name < other.name ? -1 : 1;
    }
    if (this.terms.length !== other.terms.length) {
      return this.terms.length < other.terms.length ? -1 : 1;
    }
    for (let i = 0; i < this.terms.length; i++) {
        const comparison = this.terms[i].compare(other.terms[i]);
        if (comparison !== 0) {
            return comparison;
        }
    }
    return 0;
  }

    /*
    **
     * Return intepretation of function.
     * @param {Structure} structure
     * @param {Map} e variables valuation
     * @returns {string} domain item
     *
    eval(structure: Structure, e: Valuation): DomainElement {
      let interpretedParams: string[] = [];
      this.terms.forEach((term) => {
        interpretedParams.push(term.eval(structure, e));
      });

      const interpretation = structure.iF.get(this.name);

      if (interpretation === undefined) {
        throw new Error(
          `The interpretation of the function symbol ${this.name} is not defined.`
        );
      }

      const interpretedValue = structure.iFGet(this.name, interpretedParams);

      if (interpretedValue === undefined) {
        throw new Error(
          `The interpretation of the function symbol ${this.name} for ${
            interpretedParams.length > 1
              ? `(${interpretedParams})`
              : interpretedParams
          } is not defined`
        );
      }
      return interpretedValue;
    }

    getVariables(): Set<Symbol> {
      const vars: Set<Symbol> = new Set();
      this.terms.forEach((term) =>
        term.getVariables().forEach((variable) => vars.add(variable))
      );
      return vars;
    }

    equals(other: Term): boolean {
      if (! (other instanceof FunctionTerm) ||
        this.name === other.name) return false;
      for (let i = 0; i < this.terms.length; i++) {
        if (!this.terms[i].equals(other.terms[i])) return false;
      }
      return true;
    }*/
}

export default FunctionTerm;
