import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts"
import UnsatisfiableFormulaCreationChecker from "../error checkers/UnsatisfiableFormulaCreationChecker.ts";

describe("Quantifier Elimination Checker", () => {
    const checker = new UnsatisfiableFormulaCreationChecker();

    testIdentical(checker);
    describe("Correct", () => {
        it("Correct negated formula", () => {
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ ¬cat(x)",
                "⊥"
            );
            testEquivalentTwoDirectional(checker,
                "(∃x∀y(cat(y) →loves(x, y)) ∧ ∀x((cat(x)∨loves(x,kitty)) →loves(kitty, x))) ∧ ¬(∃x∀y(cat(y) →loves(x, y)) ∧ ∀x((cat(x)∨loves(x,kitty)) →loves(kitty, x)))",
                "⊥"
            );

            testEquivalentTwoDirectional(checker,
                "((cat(x) ∧ ¬cat(x)) ∨ ⊥)",
                "(⊥ ∨ (cat(x) ∧ ¬cat(x)))"
            );
        });
        it("Correct negated Tautology", () => {
            testEquivalentTwoDirectional(checker,
                "¬⊤",
                "⊥"
            );

            testEquivalentTwoDirectional(checker,
                "(¬⊤ ∧ ⊥)",
                "(⊥ ∧ ¬⊤)"
            );
        });
    });

    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∧ ¬cat(y)",
                "⊥",
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∨ ¬cat(x)",
                "⊥"
            );
        });
        it("Negation missing", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∧ cat(x)",
                "⊥"
            );
        });
    });

});