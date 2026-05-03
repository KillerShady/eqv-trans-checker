import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "../testUtils.ts"
import IdentityChecker from "../../error checkers/IdentityChecker.ts";

describe("Unsatisfiable Formula Elimination Checker", () => {
    const checker = new IdentityChecker();

    testIdentical(checker);

    describe("Correct", () => {
        it("Disjunction", () => {
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
        it("Conjunction", () => {
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ ⊤",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "⊤ ∧ cat(x)",
                "cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "(⊤ ∧ cat(x)) ∧ ⊤",
                "cat(x)"
            );

            testEquivalentTwoDirectional(checker,
                "((⊤ ∧ cat(x)) ∨ cat(x))",
                "(cat(x) ∨ (⊤ ∧ cat(x)))"
            );
        });
    });
    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∨ ⊥)",
                "∃x∀y cat(y)",
                "cat(x) and cat(y) are neither equivalent nor identical according to the Tautology Creation rule!",
                "cat(y) and cat(x) are neither equivalent nor identical according to the Tautology Creation rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∧ ⊤)",
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
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∨ ⊤)",
                "∃x∀y cat(x)",
                "(cat(x)  ∨  ⊤) and cat(x) are neither equivalent nor identical according to the Tautology Creation rule!",
                "cat(x) and (cat(x)  ∨  ⊤) are neither equivalent nor identical according to the Tautology Creation rule!"
            );
        });
    });

});