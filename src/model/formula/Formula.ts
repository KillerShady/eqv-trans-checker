import Expression from "../Expression.ts";

export enum SignedFormulaType {
  ALPHA = "alpha",
  BETA = "beta",
  GAMMA = "gamma",
  DELTA = "delta",
}

export type SignedFormula = {
  sign: boolean;
  formula: Formula;
};

/**
 * Represent simple formula
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @abstract
 * @extends Expression
 */
abstract class Formula extends Expression {
  constructor(
    protected subFormulas: Formula[],
    protected connective: string,
    protected connectiveTex: string
  ) {
    super();
  }

  getSubFormulas(): Formula[] {
    return this.subFormulas;
  }

  toString(): string {
    return `(${this.getSubFormulas().join(` ${this.connective} `)})`;
  }

  toTex(): string {
    return `(${this.getSubFormulas().join(` ${this.connectiveTex} `)})`;
  }

  abstract flatten(): Formula;

  compare(other: Expression): number {
    const constructorA = this.constructor.name;
    const constructorB = other.constructor.name;
    if (! (other instanceof Formula)) {
      return constructorA === constructorB ? 0 :
             constructorA < constructorB ? -1 : 1;
    }
    if (constructorA !== constructorB) {
      return constructorA < constructorB ? -1 : 1;
    }

    if (this.subFormulas.length !== other.subFormulas.length) {
      return this.subFormulas.length < other.subFormulas.length ? -1 : 1;
    }
    for (let i = 0; i < this.subFormulas.length; i++) {
        const comparison = this.subFormulas[i].compare(other.subFormulas[i]);
        if (comparison !== 0) {
            return comparison;
        }
    }
    return 0;
  }

  /*gameDepth(sign: boolean): number {
    return Math.max(
      ...this.getSignedSubFormulas(sign).map(({ formula: f }) =>
        f.gameDepth(sign)
      )
    ) +
      this.getSignedType(sign) ===
      SignedFormulaType.BETA ||
      this.getSignedType(sign) === SignedFormulaType.DELTA
      ? 2
      : 1;
  }

  signedFormulaToString(sign: boolean): string {
    return `${sign === true ? "T" : "F"} ${this.toString()}`;
  }

  winningSubformulas(
    sign: boolean,
    structure: Structure,
    e: Valuation
  ): SignedFormula[] {
    const formulas = this.getSignedSubFormulas(sign);

    let shortest = undefined;
    let winning: SignedFormula[] = [];

    for (const { sign, formula } of formulas) {
      let current = { sign: sign, formula: formula };
      if (formula.eval(structure, e) !== sign) {
        if (!shortest) {
          shortest = current;
          winning.push(shortest);
        }

        if (
          shortest.formula.gameDepth(shortest.sign) > formula.gameDepth(sign)
        ) {
          shortest = current;
          winning = [shortest];
        } else if (
          shortest.formula.gameDepth(shortest.sign) === formula.gameDepth(sign)
        ) {
          winning.push(current);
        }
      }
    }

    if (winning.length === 0) {
      return formulas;
    }

    return winning;
  }

  abstract eval(structure: Structure, e: Valuation): boolean;

  getVariables(): Set<Symbol> {
    const vars: Set<Symbol> = new Set();
    this.subFormulas.forEach((formula) =>
      formula.getVariables().forEach((variable) => vars.add(variable))
    );
    return vars;
  }

  abstract getSignedType(sign: boolean): SignedFormulaType;

  abstract getSignedSubFormulas(sign: boolean): SignedFormula[];

  equals(other: Formula): boolean {
    if (this.constructor !== other.constructor ||
        this.subFormulas.length !== other.subFormulas.length) return false;
    for (let i = 0; i < this.subFormulas.length; i++) {
      if (!this.subFormulas[i].equals(other.subFormulas[i])) return false;
    }
    return true;
  }*/

}

export default Formula;
