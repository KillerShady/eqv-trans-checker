/**
 * Represent expression in logic
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @abstract
 */
abstract class Expression {
  abstract toString(): string;
  abstract toTex(): string;

 /* abstract eval(
    structure: Structure,
    e: Map<Symbol, DomainElement>
  ): DomainElement | boolean;

  abstract getVariables(): Set<Symbol>;*/

  abstract flatten(): Expression;

  abstract compare(other: Expression): number;
}

export default Expression;
