import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts"
import QuantifierEliminationChecker from "../error checkers/QuantifierEliminationChecker.ts";

describe("Quantifier Elimination Checker", () => {
    const checker = new QuantifierEliminationChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct nested", () => {
            testEquivalent(checker,
                "∀x∃x cat(y)",
                "cat(y)"
            );
            testEquivalent(checker,
                "∀x (∃x cat(y) ∨ cat(z))",
                "cat(y) ∨ cat(z)"
            );
        });
        it("Correct", () => {
            testEquivalent(checker,
                "∃x cat(y)",
                "cat(y)"
            );
            testEquivalent(checker,
                "∀x cat(y)",
                "cat(y)"
            );
            testEquivalent(checker,
                "∀x∃x cat(x)",
                "∃x cat(x)"
            );
            testEquivalent(checker,
                "∀x(∃x cat(x) ∨ cat(y))",
                "∃x cat(x) ∨ cat(y)"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x cat(x)",
                "cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );
            testError(checker,
                "∃x cat(y)",
                "cat(x)"
            );
            testError(checker,
                "∃x cat(y)",
                "∀x cat(x)"
            );
            testError(checker,
                "∀x(∃x cat(x) ∨ cat(x))",
                "∃x cat(x) ∨ cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );
        });
    });

    describe("Reverse Direction", () => {
        it("Correct nested", () => {
            testEquivalent(checker,
                "cat(y)",
                "∀x∃x cat(y)"
            );
            testEquivalent(checker,
                "cat(y) ∨ cat(z)",
                "∀x (∃x cat(y) ∨ cat(z))"
            );
            testEquivalent(checker,
                "∃x cat(x) ∨ cat(y)",
                "∀x(∃x cat(x) ∨ cat(y))"
            );
        });
        it("Correct", () => {
            testEquivalent(checker,
                "cat(y)",
                "∃x cat(y)"
            );
            testEquivalent(checker,
                "cat(y)",
                "∀x cat(y)"
            );
            testEquivalent(checker,
                "∃x cat(x)",
                "∀x∃x cat(x)"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "cat(x)",
                "∃x cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );
            testError(checker,
                "cat(x)",
                "∃x cat(y)"
            );
            testError(checker,
                "∀x cat(x)",
                "∃x cat(y)"
            );
            testError(checker,
                "∃x cat(x) ∨ cat(x)",
                "∀x(∃x cat(x) ∨ cat(x))",
                "Cannot apply rule, because free variable x was found!"
            );
        });
    });

});