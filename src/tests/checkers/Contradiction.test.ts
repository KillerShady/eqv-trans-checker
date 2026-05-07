import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "../testUtils.ts"
import ContradictionChecker from "../../error checkers/ContradictionChecker.ts";

describe("Quantifier Elimination Checker", () => {
    const checker = new ContradictionChecker();

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
    });

    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∧ ¬cat(y))",
                "∃x∀y ⊥",
                "(cat(x)  ∧  ¬cat(y)) and ⊥ are neither equivalent nor identical according to the Contradiction rule!",
                "⊥ and (cat(x)  ∧  ¬cat(y)) are neither equivalent nor identical according to the Contradiction rule!"
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∨ ¬cat(x))",
                "∃x∀y ⊥",
                "(cat(x)  ∨  ¬cat(x)) and ⊥ are neither equivalent nor identical according to the Contradiction rule!",
                "⊥ and (cat(x)  ∨  ¬cat(x)) are neither equivalent nor identical according to the Contradiction rule!"
            );
        });
        it("Negation missing", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∧ cat(x))",
                "∃x∀y ⊥",
                "(cat(x)  ∧  cat(x)) and ⊥ are neither equivalent nor identical according to the Contradiction rule!",
                "⊥ and (cat(x)  ∧  cat(x)) are neither equivalent nor identical according to the Contradiction rule!"
            );
        });
    });

});