import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts"
import FormulaEliminationChecker from "../error checkers/FormulaEliminationChecker.ts";

describe("Tautology Elimination Checker", () => {
    const checker = new FormulaEliminationChecker();

    testIdentical(checker);

    describe("Correct", () => {
        it("Correct conjunction", () => {
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ cat(x)",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ (cat(x) ∨ cat(y))",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ (cat(y) ∨ cat(x))",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "(cat(x) ∨ cat(y)) ∧ cat(x)",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "(cat(y) ∨ cat(x)) ∧ cat(x)",
                "cat(x)"
            );
        });
        it("Correct disjunction", () => {
            testEquivalentTwoDirectional(checker,
                "cat(x) ∨ cat(x)",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∨ (cat(x) ∧ cat(y))",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∨ (cat(y) ∧ cat(x))",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "(cat(x) ∧ cat(y)) ∨ cat(x)",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "(cat(y) ∧ cat(x)) ∨ cat(x)",
                "cat(x)"
            );
        });
        it("Correct complex", () => {
            testEquivalentTwoDirectional(checker,
                "(cat(x) ∧ (cat(y) ∨ (cat(x) ∧ cat(z)))) ∧ (cat(x) ∧ (cat(y) ∨ (cat(x) ∧ cat(z))))",
                "cat(x) ∧ (cat(y) ∨ (cat(x) ∧ cat(z)))"
            );
            testEquivalentTwoDirectional(checker,
                "((cat(x) ∧ (cat(y) ∨ (cat(x) ∧ cat(z)))) ∧ (cat(a) ∨ (cat(x) ∧ (cat(y) ∨ (cat(x) ∧ cat(z))))))",
                "cat(x) ∧ (cat(y) ∨ (cat(x) ∧ cat(z)))"
            );
        });
        it("Correct nested", () => {
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ cat(x) ∧ cat(x) ∧ cat(x) ∧ cat(x)",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ cat(x) ∧ cat(x) ∧ cat(x) ∧ cat(x) ∧ cat(x)",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ cat(x) ∧ cat(x) ∧ cat(x) ∧ cat(x) ∧ cat(y)",
                "cat(x) ∧ cat(y)"
            );
            testErrorTwoDirectional(checker,
                "cat(x) ∧ (cat(x) ∧ cat(y))",
                "cat(x) ∧ cat(y)"
            );
            testErrorTwoDirectional(checker,
                "cat(x) ∨ (cat(x) ∨ cat(y))",
                "cat(x) ∨ cat(y)"
            );
        });
    });

    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∧ cat(y)",
                "cat(x)"
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∧ (cat(x) ∧ cat(y))",
                "cat(x)"
            );
            testErrorTwoDirectional(checker,
                "(cat(x) ∨ cat(y)) ∨ cat(x)",
                "cat(x)"
            );
        });
    });

});