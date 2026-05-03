import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "../../testUtils.ts"
import UnsatisfiableFormulaEliminationChecker from "../../../error checkers/obsolete/UnsatisfiableFormulaEliminationChecker.ts";

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
                "∃x∀y(cat(x) ∨ ⊥)",
                "∃x∀y cat(y)",
                "cat(x) and cat(y) are neither equivalent nor identical according to the Tautology Creation rule!",
                "cat(y) and cat(x) are neither equivalent nor identical according to the Tautology Creation rule!"
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∧ ⊥)",
                "∃x∀y cat(x)",
                "(cat(x)  ∧  ⊥) and cat(x) are neither equivalent nor identical according to the Tautology Creation rule!",
                "cat(x) and (cat(x)  ∧  ⊥) are neither equivalent nor identical according to the Tautology Creation rule!"
            );
        });
    });

});