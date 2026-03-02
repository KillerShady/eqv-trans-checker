import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts"
import TautologyCreationChecker from "../error checkers/TautologyCreationChecker.ts";

describe("Quantifier Elimination Checker", () => {
    const checker = new TautologyCreationChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct", () => {
            testEquivalent(checker,
                "cat(x) ∨ ¬cat(x)",
                "⊤"
            );
            testEquivalent(checker,
                "(∃x∀y(cat(y) →loves(x, y)) ∧ ∀x((cat(x)∨loves(x,kitty)) →loves(kitty, x))) ∨ ¬(∃x∀y(cat(y) →loves(x, y)) ∧ ∀x((cat(x)∨loves(x,kitty)) →loves(kitty, x)))",
                "⊤"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "cat(x) ∨ ¬cat(y)",
                "⊤",
                "Cannot apply Tautology Creation rule, because cat(x) and cat(y) are not identical!"
            );
            testError(checker,
                "cat(x) ∧ ¬cat(x)",
                "⊤"
            );
            testError(checker,
                "cat(x) ∨ cat(x)",
                "⊤"
            );
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            testEquivalent(checker,
                "⊤",
                "cat(x) ∨ ¬cat(x)"
            );
            testEquivalent(checker,
                "⊤",
                "(∃x∀y(cat(y) →loves(x, y)) ∧ ∀x((cat(x)∨loves(x,kitty)) →loves(kitty, x))) ∨ ¬(∃x∀y(cat(y) →loves(x, y)) ∧ ∀x((cat(x)∨loves(x,kitty)) →loves(kitty, x)))"            );
        });
        it("Incorrect", () => {
            testError(checker,
                "⊤",
                "cat(x) ∨ ¬cat(y)",
                "Cannot apply Tautology Creation rule, because cat(x) and cat(y) are not identical!"
            );
            testError(checker,
                "⊤",
                "cat(x) ∧ ¬cat(x)"
            );
            testError(checker,
                "⊤",
                "cat(x) ∨ cat(x)"
            );
        });
    });

});