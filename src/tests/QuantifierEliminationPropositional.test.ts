import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts"
import QuantifierEliminationPropositionalChecker from "../error checkers/QuantifierEliminationPropositionalChecker.ts";

describe("Quantifier Elimination Checker", () => {
    const checker = new QuantifierEliminationPropositionalChecker();

    testIdentical(checker);

    describe("Correct", () => {
        it("Correct nested", () => {
            testEquivalentTwoDirectional(checker,
                "∀x (∃x (cat(x) ∧ cat(y)) ∨ cat(z))",
                "∀x(∃x cat(x) ∧ cat(y)) ∨ cat(z)"
            );
        });
        it("Correct", () => {
            testEquivalentTwoDirectional(checker,
                "∃x(cat(x) ∨ cat(y))",
                "∃x cat(x) ∨ cat(y)"
            );
            testEquivalentTwoDirectional(checker,
                "∃x(cat(y) ∨ cat(x))",
                "cat(y) ∨ ∃x cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "∃x(cat(x) ∧ cat(y))",
                "∃x cat(x) ∧ cat(y)"
            );
            testEquivalentTwoDirectional(checker,
                "∃x(cat(y) ∧ cat(x))",
                "cat(y) ∧ ∃x cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "∀x(cat(x) ∨ cat(y))",
                "∀x cat(x) ∨ cat(y)"
            );
            testEquivalentTwoDirectional(checker,
                "∀x(cat(y) ∨ cat(x))",
                "cat(y) ∨ ∀x cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "∀x(cat(x) ∧ cat(y))",
                "∀x cat(x) ∧ cat(y)"
            );
            testEquivalentTwoDirectional(checker,
                "∀x(cat(y) ∧ cat(x))",
                "cat(y) ∧ ∀x cat(x)"
            );

            testEquivalentTwoDirectional(checker,
                "∀x∃x(cat(x) ∧ cat(y))",
                "∀x(∃x cat(x) ∧ cat(y))"
            );
            testEquivalentTwoDirectional(checker,
                "∀x∃x(cat(y) ∧ cat(x))",
                "∀x(cat(y) ∧ ∃x cat(x))"
            );
        });
    });
    describe("Incorrect", () => {
        it("Free variable was found", () => {
            testErrorTwoDirectional(checker,
                "∃x(cat(x) ∨ cat(x))",
                "∃x cat(x) ∨ cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
                "∃x(cat(x) ∨ cat(y))",
                "∃x cat(x) ∧ cat(y)"
            );
            testErrorTwoDirectional(checker,
                "∃x(cat(x) ∧ cat(y))",
                "∃x cat(x) ∨ cat(y)"
            );
            testErrorTwoDirectional(checker,
                "∀x(cat(x) ∨ cat(y))",
                "∀x cat(x) ∧ cat(y)"
            );
            testErrorTwoDirectional(checker,
                "∀x(cat(x) ∧ cat(y))",
                "∀x cat(x) ∨ cat(y)"
            );
        });
    });

});