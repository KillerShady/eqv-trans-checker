import {describe, it} from "vitest";
import {testEquivalent, testError} from "../testUtils.ts"
import CNFChecker from "../../error checkers/CNFChecker.ts";

describe("CNF Checker", () => {
    const checker = new CNFChecker();

    describe("Correct", () => {
        it("Literal", () => {
            testEquivalent(checker,
                "cat(x)",
                "cat(x)"
            );
            testEquivalent(checker,
                "¬cat(x)",
                "cat(x)"
            );
            testEquivalent(checker,
                "x = y",
                "cat(x)"
            );
            testEquivalent(checker,
                "¬(x = y)",
                "cat(x)"
            );
        });
        it("Disjunction", () => {
            testEquivalent(checker,
                "cat(x) ∨ ¬cat(x)",
                "cat(x)"
            );
            testEquivalent(checker,
                "¬cat(x) ∨ cat(x)",
                "cat(x)"
            );
            testEquivalent(checker,
                "x = y ∨ ¬(x = y)",
                "cat(x)"
            );
            testEquivalent(checker,
                "¬(x = y) ∨ x = y",
                "cat(x)"
            );

            testEquivalent(checker,
                "(cat(x) ∨ ¬cat(x)) ∨ (x = y)",
                "cat(x)"
            );
            testEquivalent(checker,
                "(¬cat(x) ∨ cat(x)) ∨ (¬(x = y))",
                "cat(x)"
            );
            testEquivalent(checker,
                "(cat(x) ∨ ¬cat(x)) ∨ (x = y ∨ ¬(x = y))",
                "cat(x)"
            );
            testEquivalent(checker,
                "(¬cat(x) ∨ cat(x)) ∨ (¬(x = y) ∨ x = y)",
                "cat(x)"
            );
        });
        it("Conjunction and literal", () => {
            testEquivalent(checker,
                "cat(x) ∧ ¬cat(x)",
                "cat(x)"
            );
            testEquivalent(checker,
                "¬cat(x) ∧ cat(x)",
                "cat(x)"
            );
            testEquivalent(checker,
                "x = y ∧ ¬(x = y)",
                "cat(x)"
            );
            testEquivalent(checker,
                "¬(x = y) ∧ x = y",
                "cat(x)"
            );

            testEquivalent(checker,
                "(cat(x) ∧ ¬cat(x)) ∧ (x = y)",
                "cat(x)"
            );
            testEquivalent(checker,
                "(¬cat(x) ∧ cat(x)) ∧ (¬(x = y))",
                "cat(x)"
            );
            testEquivalent(checker,
                "(cat(x) ∧ ¬cat(x)) ∧ (x = y ∧ ¬(x = y))",
                "cat(x)"
            );
            testEquivalent(checker,
                "(¬cat(x) ∧ cat(x)) ∧ (¬(x = y) ∧ x = y)",
                "cat(x)"
            );
        });
        it("Conjunction", () => {
            testEquivalent(checker,
                "(cat(x) ∨ ¬cat(x)) ∧ ¬cat(x)",
                "cat(x)"
            );
            testEquivalent(checker,
                "cat(x) ∧ (cat(x) ∨ ¬cat(x))",
                "cat(x)"
            );
            testEquivalent(checker,
                "(cat(x) ∨ ¬cat(x)) ∧ ¬(x = y)",
                "cat(x)"
            );
            testEquivalent(checker,
                "x = y ∧ (cat(x) ∨ ¬cat(x))",
                "cat(x)"
            );

            testEquivalent(checker,
                "(cat(x) ∧ ¬cat(x)) ∧ (cat(x) ∨ ¬cat(x))",
                "cat(x)"
            );
            testEquivalent(checker,
                "(cat(x) ∧ (cat(x) ∨ ¬cat(x))) ∧ (x = y ∧ (cat(x) ∨ ¬cat(x)))",
                "cat(x)"
            );
            testEquivalent(checker,
                "((cat(x) ∨ ¬cat(x)) ∧ (cat(x) ∨ ¬cat(x))) ∧ (¬(x = y) ∧ (cat(x) ∨ ¬cat(x)))",
                "cat(x)"
            );
        });
        it("Full CNF", () => {
            testEquivalent(checker,
                "∀x((cat(x) ∨ ¬cat(x)) ∧ ¬cat(x))",
                "cat(x)"
            );
            testEquivalent(checker,
                "∀a∀b∀c∀d((cat(x) ∨ ¬cat(x)) ∧ ¬cat(x))",
                "cat(x)"
            );
            testEquivalent(checker,
                "∀x((cat(x) ∧ ¬cat(x)) ∧ (cat(x) ∨ ¬cat(x)))",
                "cat(x)"
            );
            testEquivalent(checker,
                "∀a∀b∀c∀d((cat(x) ∧ ¬cat(x)) ∧ (cat(x) ∨ ¬cat(x)))",
                "cat(x)"
            );
            testEquivalent(checker,
                "∀x((cat(x) ∧ (cat(x) ∨ ¬cat(x))) ∧ (x = y ∧ (cat(x) ∨ ¬cat(x))))",
                "cat(x)"
            );
            testEquivalent(checker,
                "∀a∀b∀c∀d((cat(x) ∧ (cat(x) ∨ ¬cat(x))) ∧ (x = y ∧ (cat(x) ∨ ¬cat(x))))",
                "cat(x)"
            );
            testEquivalent(checker,
                "∀x(((cat(x) ∨ ¬cat(x)) ∧ (cat(x) ∨ ¬cat(x))) ∧ (¬(x = y) ∧ (cat(x) ∨ ¬cat(x))))",
                "cat(x)"
            );
            testEquivalent(checker,
                "∀a∀b∀c∀d(((cat(x) ∨ ¬cat(x)) ∧ (cat(x) ∨ ¬cat(x))) ∧ (¬(x = y) ∧ (cat(x) ∨ ¬cat(x))))",
                "cat(x)"
            );
        });
    });

    describe("Incorrect", () => {
        it("Contains implication", () => {
            testError(checker,
                "(cat(x) → cat(x))",
                "cat(x)",
                "Implication is not allowed in CNF!"
            );
            testError(checker,
                "(cat(x) → cat(x)) ∨ ¬cat(x)",
                "cat(x)",
                "Implication is not allowed in CNF!"
            );
            testError(checker,
                "(cat(x) → cat(x)) ∧ ¬cat(x)",
                "cat(x)",
                "Implication is not allowed in CNF!"
            );
            testError(checker,
                "((cat(x) → cat(x)) ∨ ¬cat(x)) ∧ ¬cat(x)",
                "cat(x)",
                "Implication is not allowed in CNF!"
            );
        });
        it("Contains equivalence", () => {
            testError(checker,
                "(cat(x) ↔ cat(x))",
                "cat(x)",
                "Equivalence is not allowed in CNF!"
            );
            testError(checker,
                "(cat(x) ↔ cat(x)) ∨ ¬cat(x)",
                "cat(x)",
                "Equivalence is not allowed in CNF!"
            );
            testError(checker,
                "(cat(x) ↔ cat(x)) ∧ ¬cat(x)",
                "cat(x)",
                "Equivalence is not allowed in CNF!"
            );
            testError(checker,
                "((cat(x) ↔ cat(x)) ∨ ¬cat(x)) ∧ ¬cat(x)",
                "cat(x)",
                "Equivalence is not allowed in CNF!"
            );
        });
        it("Contains existential quant", () => {
            testError(checker,
                "∃x cat(x)",
                "cat(x)",
                "Existential quantifier is not allowed in CNF!"
            );
            testError(checker,
                "∃x cat(x) ∨ ¬cat(x)",
                "cat(x)",
                "Existential quantifier is not allowed in CNF!"
            );
            testError(checker,
                "∃x cat(x) ∧ ¬cat(x)",
                "cat(x)",
                "Existential quantifier is not allowed in CNF!"
            );
            testError(checker,
                "(∃x cat(x) ∨ ¬cat(x)) ∧ ¬cat(x)",
                "cat(x)",
                "Existential quantifier is not allowed in CNF!"
            );
        });
        it("Conjunction in disjunction", () => {
            testError(checker,
                "cat(x) ∨ (¬cat(x) ∧ ¬cat(x))",
                "cat(x)",
                "Disjunction cannot contain conjunction in CNF!"
            );
            testError(checker,
                "(cat(x) ∧ cat(x)) ∨ ¬cat(x)",
                "cat(x)",
                "Disjunction cannot contain conjunction in CNF!"
            );
            testError(checker,
                "(cat(x) ∧ ¬cat(x)) ∨ (cat(x) ∨ ¬cat(x))",
                "cat(x)",
                "Disjunction cannot contain conjunction in CNF!"
            );
            testError(checker,
                "(cat(x) ∨ ¬cat(x)) ∨ (cat(x) ∧ ¬cat(x))",
                "cat(x)",
                "Disjunction cannot contain conjunction in CNF!"
            );
        });
        it("Negation not next to atom", () => {
            testError(checker,
                "¬∀x((cat(x) ∨ ¬cat(x)) ∧ ¬cat(x))",
                "cat(x)",
                "Negation must be before an atomic formula!"
            );
            testError(checker,
                "∀x¬((cat(x) ∨ ¬cat(x)) ∧ ¬cat(x))",
                "cat(x)",
                "Negation must be before an atomic formula!"
            );
            testError(checker,
                "∀x(¬(cat(x) ∨ ¬cat(x)) ∧ ¬cat(x))",
                "cat(x)",
                "Negation must be before an atomic formula!"
            );
        });
        it("Universal quantifier not at start", () => {
            testError(checker,
                "(∀x(cat(x) ∨ ¬cat(x)) ∧ ¬cat(x))",
                "cat(x)",
                "Universal quantifiers must be at the start of the formula in CNF!"
            );
            testError(checker,
                "((cat(x) ∨ ¬cat(x)) ∧ ∀x¬cat(x))",
                "cat(x)",
                "Universal quantifiers must be at the start of the formula in CNF!"
            );
        });
    });

});