import Expression from "../Expression.ts";

/**
 * Represent simple term.
 * @author Milan Cifra
 * @author Jozef Filip
 * @class
 * @abstract
 *
 */
abstract class Term extends Expression {
    abstract flatten(): Term;
}

export default Term;
