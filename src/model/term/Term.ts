import Expression from "../Expression.ts";
import type { Symbol } from "../Language.ts";
import Structure, { type DomainElement } from "../Structure.ts";

/**
 * Represent simple term.
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @abstract
 *
 */
abstract class Term extends Expression {
  abstract eval(
    structure: Structure,
    e: Map<Symbol, DomainElement>
  ): DomainElement;
}

export default Term;
