import Term from "./Term.ts";
import type Expression from "../Expression.ts";

/**
 * Constant
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Term
 */
class Constant extends Term {
  /**
   *
   * @param {string} name Name of the constant
   */
  constructor(public name: string) {
    super();
  }

  /**
   * Return string representation of constant
   * @returns {string}
   */
  toString(): string {
    return this.name;
  }

  toTex(): string {
    return this.toString();
  }

  flatten() {
    return new Constant(this.name)
  }

  compare(other: Expression): number {
    if (! (other instanceof Constant)) {
      return this.constructor.name === other.constructor.name ? 0 :
             this.constructor.name < other.constructor.name ? -1 : 1;
    }
    return this.name === other.name ? 0 : this.name < other.name ? -1 : 1;
  }

    /*
    **
     * Return intepretation of the constant
     * @param {Structure} structure Structure
     * @param {Map} e variables valuation
     * @return {string} domain item
     *
    eval(structure: Structure, _: Valuation): DomainElement {
      const c = structure.iC.get(this.name);
      if (c === undefined || c === "") {
        throw new Error(
          `The interpretation of the constant ${this.name} is not defined`
        );
      }

      return c;
    }

    getVariables(): Set<Symbol> {
      return new Set();
    }

    equals(other: Term): boolean {
      return other instanceof Constant && this.name === other.name;
    }*/
}

export default Constant;
