/**
 * Represent expression in logic
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @abstract
 */
import type { Symbol } from "./Language.ts";
import { type DomainElement, Structure } from "./Structure.ts";

abstract class Expression {
  abstract toString(): string;
  abstract toTex(): string;

  abstract eval(
    structure: Structure,
    e: Map<Symbol, DomainElement>
  ): DomainElement | boolean;

  abstract getVariables(): Set<Symbol>;
}

export default Expression;
