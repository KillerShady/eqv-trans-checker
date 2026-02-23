import Structure, { type DomainElement, type Valuation } from "../Structure.ts";
import type { Symbol } from "../Language.ts";
import Term from "./Term.ts";
import {Variable} from "../index.ts";

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
   * Return intepretation of the constant
   * @param {Structure} structure Structure
   * @param {Map} e variables valuation
   * @return {string} domain item
   */
  eval(structure: Structure, _: Valuation): DomainElement {
    const c = structure.iC.get(this.name);
    if (c === undefined || c === "") {
      throw new Error(
        `The interpretation of the constant ${this.name} is not defined`
      );
    }

    return c;
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

  getVariables(): Set<Symbol> {
    return new Set();
  }

  equals(other: Term): boolean {
    return other instanceof Variable && this.name === other.name;
  }
}

export default Constant;
