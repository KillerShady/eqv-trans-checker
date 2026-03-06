import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts"
import UnsatisfiableFormulaEliminationChecker from "../error checkers/UnsatisfiableFormulaEliminationChecker.ts";

describe("Unsatisfiable Formula Elimination Checker", () => {
    const checker = new UnsatisfiableFormulaEliminationChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "cat(x) ∨ ⊥",
            "cat(x)"
        );
        testEquivalentTwoDirectional(checker,
            "⊥ ∨ cat(x)",
            "cat(x)"
        );
        testEquivalentTwoDirectional(checker,
            "(⊥ ∨ cat(x)) ∨ ⊥",
            "cat(x)"
        );

        testEquivalentTwoDirectional(checker,
            "((⊥ ∨ cat(x)) ∧ cat(x))",
            "(cat(x) ∧ (⊥ ∨ cat(x)))"
        );
    });
    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∨ ⊥",
                "cat(y)"
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
            "cat(x) ∧ ⊥",
                "cat(x)"
            );
        });
    });

});