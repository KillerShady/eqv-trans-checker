import type { Symbol } from "../Language.ts";
import { type DomainElement } from "../Structure.ts";
import Term from "./Term.ts";
import type Expression from "../Expression.ts";

/**
 * Variable
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @extends Term
 */
class Variable extends Term {
  /**
   *
   * @param {string} name
   */
  constructor(public name: Symbol) {
    super();
  }

  /**
   * Return string representation of variable
   * @returns {DomainElement}
   */
  toString(): DomainElement {
    return this.name;
  }

  toTex(): string {
    return this.toString();
  }

  flatten() {
    return new Variable(this.name)
  }

  compare(other: Expression): number {
    if (! (other instanceof Variable)) {
      return this.constructor.name === other.constructor.name ? 0 :
             this.constructor.name < other.constructor.name ? -1 : 1;
    }
    return this.name === other.name ? 0 : this.name < other.name ? -1 : 1;
  }

    /*
      **
       * Return intepretation of variable.
       * @param {Structure} structure
       * @param {Map} e variables valuation
       * @return {DomainElement} domain item
       *
      eval(_: Structure, e: Valuation): DomainElement {
        const v = e.get(this.name);
        if (v === undefined) {
          throw new Error(`The variable ${this.name} is free,
            but it is not assigned any value by the variable assignment 𝑒.`);
        }
        return v;
      }

      createCopy(): Variable {
        return new Variable(this.name);
      }

      getVariables(): Set<Symbol> {
        return new Set([this.name]);
      }

      equals(other: Term): boolean {
        return other instanceof Variable && this.name === other.name;
      }*/
}

export default Variable;
