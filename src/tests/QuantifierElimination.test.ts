import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts"
import QuantifierEliminationChecker from "../error checkers/QuantifierEliminationChecker.ts";

describe("Quantifier Elimination Checker", () => {
    const checker = new QuantifierEliminationChecker();

    testIdentical(checker);

    describe("Correct", () => {
        it("Correct nested", () => {
            testEquivalentTwoDirectional(checker,
                "∀x∃x cat(y)",
                "cat(y)"
            );
            testEquivalentTwoDirectional(checker,
                "∀x (∃x cat(y) ∨ cat(z))",
                "cat(y) ∨ cat(z)"
            );
        });
        it("Correct", () => {
            testEquivalentTwoDirectional(checker,
                "∃x cat(y)",
                "cat(y)"
            );
            testEquivalentTwoDirectional(checker,
                "∀x cat(y)",
                "cat(y)"
            );
            testEquivalentTwoDirectional(checker,
                "∀x∃x cat(x)",
                "∃x cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "∀x(∃x cat(x) ∨ cat(y))",
                "∃x cat(x) ∨ cat(y)"
            );
        });
    });
    describe("Incorrect", () => {
        it("Free variable was found", () => {
            testErrorTwoDirectional(checker,
                "∃x cat(x)",
                "cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );
            testErrorTwoDirectional(checker,
                "∀x cat(x)",
                "cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );
            testErrorTwoDirectional(checker,
                "∀x(∃x cat(x) ∨ cat(x))",
                "∃x cat(x) ∨ cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );
            testErrorTwoDirectional(checker,
                "∀x(∃x cat(x) ∨ cat(x))",
                "∃x cat(x) ∨ cat(x)",
                "Cannot apply rule, because free variable x was found!"
            );
        });
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x cat(y)",
                "cat(x)"
            );
        });
        it("Incorrect quantifier", () => {
            testErrorTwoDirectional(checker,
                "∃x cat(y)",
                "∀x cat(x)"
            );
        });
    });

});