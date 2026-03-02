import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts"
import QuantifierEliminationPropositionalChecker from "../error checkers/QuantifierEliminationPropositionalChecker.ts";

describe("Quantifier Elimination Checker", () => {
    const checker = new QuantifierEliminationPropositionalChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct nested", () => {
            testEquivalent(checker,
                "∀x (∃x (cat(x) ∧ cat(y)) ∨ cat(z))",
                "∀x(∃x cat(x) ∧ cat(y)) ∨ cat(z)"
            );
        });
        it("Correct", () => {
            testEquivalent(checker,
                "∃x(cat(x) ∨ cat(y))",
                "∃x cat(x) ∨ cat(y)"
            );
            testEquivalent(checker,
                "∃x(cat(y) ∨ cat(x))",
                "cat(y) ∨ ∃x cat(x)"
            );
            testEquivalent(checker,
                "∃x(cat(x) ∧ cat(y))",
                "∃x cat(x) ∧ cat(y)"
            );
            testEquivalent(checker,
                "∃x(cat(y) ∧ cat(x))",
                "cat(y) ∧ ∃x cat(x)"
            );
            testEquivalent(checker,
                "∀x(cat(x) ∨ cat(y))",
                "∀x cat(x) ∨ cat(y)"
            );
            testEquivalent(checker,
                "∀x(cat(y) ∨ cat(x))",
                "cat(y) ∨ ∀x cat(x)"
            );
            testEquivalent(checker,
                "∀x(cat(x) ∧ cat(y))",
                "∀x cat(x) ∧ cat(y)"
            );
            testEquivalent(checker,
                "∀x(cat(y) ∧ cat(x))",
                "cat(y) ∧ ∀x cat(x)"
            );

            testEquivalent(checker,
                "∀x∃x(cat(x) ∧ cat(y))",
                "∀x(∃x cat(x) ∧ cat(y))"
            );
            testEquivalent(checker,
                "∀x∃x(cat(y) ∧ cat(x))",
                "∀x(cat(y) ∧ ∃x cat(x))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x(cat(x) ∨ cat(x))",
                "∃x cat(x) ∨ cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );

            testError(checker,
                "∃x(cat(x) ∨ cat(y))",
                "∃x cat(x) ∧ cat(y)"
            );
            testError(checker,
                "∃x(cat(x) ∧ cat(y))",
                "∃x cat(x) ∨ cat(y)"
            );
            testError(checker,
                "∀x(cat(x) ∨ cat(y))",
                "∀x cat(x) ∧ cat(y)"
            );
            testError(checker,
                "∀x(cat(x) ∧ cat(y))",
                "∀x cat(x) ∨ cat(y)"
            );
        });
    });

    describe("Reverse Direction", () => {
        it("Correct nested", () => {
            testEquivalent(checker,
            "∀x(∃x cat(x) ∧ cat(y)) ∨ cat(z)",
                "∀x (∃x (cat(x) ∧ cat(y)) ∨ cat(z))"
            );
        });
        it("Correct", () => {
            testEquivalent(checker,
            "∃x cat(x) ∨ cat(y)",
                "∃x(cat(x) ∨ cat(y))"
            );
            testEquivalent(checker,
                "cat(y) ∨ ∃x cat(x)",
                "∃x(cat(y) ∨ cat(x))"
            );
            testEquivalent(checker,
            "∃x cat(x) ∧ cat(y)",
                "∃x(cat(x) ∧ cat(y))"
            );
            testEquivalent(checker,
                "cat(y) ∧ ∃x cat(x)",
                "∃x(cat(y) ∧ cat(x))"
            );
            testEquivalent(checker,
            "∀x cat(x) ∨ cat(y)",
                "∀x(cat(x) ∨ cat(y))"
            );
            testEquivalent(checker,
                "cat(y) ∨ ∀x cat(x)",
                "∀x(cat(y) ∨ cat(x))"
            );
            testEquivalent(checker,
            "∀x cat(x) ∧ cat(y)",
                "∀x(cat(x) ∧ cat(y))"
            );
            testEquivalent(checker,
                "cat(y) ∧ ∀x cat(x)",
                "∀x(cat(y) ∧ cat(x))"
            );

            testEquivalent(checker,
                "∀x(∃x cat(x) ∧ cat(y))",
                "∀x∃x(cat(x) ∧ cat(y))"
            );
            testEquivalent(checker,
                "∀x(cat(y) ∧ ∃x cat(x))",
                "∀x∃x(cat(y) ∧ cat(x))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x cat(x) ∨ cat(x)",
                "∃x(cat(x) ∨ cat(x))",
                "Cannot apply rule, because free variable x was found!"
            );

            testError(checker,
                "∃x cat(x) ∧ cat(y)",
                "∃x(cat(x) ∨ cat(y))"
            );
            testError(checker,
                "∃x cat(x) ∨ cat(y)",
                "∃x(cat(x) ∧ cat(y))"
            );
            testError(checker,
                "∀x cat(x) ∧ cat(y)",
                "∀x(cat(x) ∨ cat(y))"
            );
            testError(checker,
                "∀x cat(x) ∨ cat(y)",
                "∀x(cat(x) ∧ cat(y))"
            );
        });
    });

});