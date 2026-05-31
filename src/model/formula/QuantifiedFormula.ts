import Formula from "./Formula.ts";
import type Expression from "../Expression.ts";

abstract class QuantifiedFormula extends Formula {
  constructor(
    public variableName: string,
    public subFormula: Formula,
    public connective: string,
    public connectiveTex: string
  ) {
    super([subFormula], connective, connectiveTex);
  }

  toString(): string {
    return `${this.connective}${
      this.variableName
    } ${this.subFormula.toString()}`;
  }

  toTex(): string {
    return `${this.connectiveTex} ${
      this.variableName
    } ${this.subFormula.toTex()}`;
  }

  compare(other: Expression): number {
    const constructorA = this.constructor.name;
    const constructorB = other.constructor.name;
    if (! (other instanceof QuantifiedFormula)) {
      return constructorA === constructorB ? 0 :
             constructorA < constructorB ? -1 : 1;
    }
    if (constructorA !== constructorB) {
      return constructorA < constructorB ? -1 : 1;
    }
    if (this.variableName !== other.variableName) {
       return this.variableName < other.variableName ? -1 : 1;
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

/*
  abstract eval(structure: Structure, e: Valuation): boolean;

  abstract getSignedType(sign: boolean): SignedFormulaType;

  getVariableName(): string {
    return this.variableName;
  }

  winningElements(
    sign: boolean,
    structure: Structure,
    e: Valuation
  ): DomainElement[] {
    const signedFormula = this.getSignedSubFormulas(sign)[0];

    let cpy = new Map(e);

    let winning: DomainElement[] = [];

    for (const element of structure.domain) {
      cpy.set(this.variableName, element);
      if (signedFormula.formula.eval(structure, cpy) !== signedFormula.sign) {
        winning.push(element);
      }
    }

    if (winning.length === 0) {
      winning = Array.from(structure.domain);
    }

    return winning;
  }

  getSignedSubFormulas(sign: boolean): SignedFormula[] {
    return [{ sign: sign, formula: this.subFormula }];
  }

  getVariables(): Set<Symbol> {
    let variables = this.subFormula.getVariables();
    variables.add(this.variableName);
    return variables;
  }

  equals(other: Formula): boolean {
    if (this.constructor !== other.constructor ||
        ! (other instanceof QuantifiedFormula) ||
        this.variableName !== other.variableName ||
        this.subFormulas.length !== other.subFormulas.length) return false;
    for (let i = 0; i < this.subFormulas.length; i++) {
      if (!this.subFormulas[i].equals(other.subFormulas[i])) return false;
    }
    return true;
  }*/
}

export default QuantifiedFormula;
