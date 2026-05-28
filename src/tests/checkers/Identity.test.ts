import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "../testUtils.ts"
import IdentityChecker from "../../error_checkers/IdentityChecker.ts";

describe("Identity Checker", () => {
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
                "cat(x) and cat(y) are neither equivalent nor identical according to the Identity rule!",
                "cat(y) and cat(x) are neither equivalent nor identical according to the Identity rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∧ ⊤)",
                "∃x∀y cat(y)",
                "cat(x) and cat(y) are neither equivalent nor identical according to the Identity rule!",
                "cat(y) and cat(x) are neither equivalent nor identical according to the Identity rule!"
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∧ ⊥)",
                "∃x∀y cat(x)",
                "(cat(x)  ∧  ⊥) and cat(x) are neither equivalent nor identical according to the Identity rule!",
                "cat(x) and (cat(x)  ∧  ⊥) are neither equivalent nor identical according to the Identity rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∨ ⊤)",
                "∃x∀y cat(x)",
                "(cat(x)  ∨  ⊤) and cat(x) are neither equivalent nor identical according to the Identity rule!",
                "cat(x) and (cat(x)  ∨  ⊤) are neither equivalent nor identical according to the Identity rule!"
            );
        });
    });

});