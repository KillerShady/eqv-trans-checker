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
                "∃x∀y(cat(x) ∧ ¬cat(y))",
                "∃x∀y ⊥",
                "(cat(x)  ∧  ¬cat(y)) and ⊥ are neither equivalent nor identical according to the Tautology Creation rule!",
                "⊥ and (cat(x)  ∧  ¬cat(y)) are neither equivalent nor identical according to the Tautology Creation rule!"
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∨ ¬cat(x))",
                "∃x∀y ⊥",
                "(cat(x)  ∨  ¬cat(x)) and ⊥ are neither equivalent nor identical according to the Tautology Creation rule!",
                "⊥ and (cat(x)  ∨  ¬cat(x)) are neither equivalent nor identical according to the Tautology Creation rule!"
            );
        });
        it("Negation missing", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(x) ∧ cat(x))",
                "∃x∀y ⊥",
                "(cat(x)  ∧  cat(x)) and ⊥ are neither equivalent nor identical according to the Tautology Creation rule!",
                "⊥ and (cat(x)  ∧  cat(x)) are neither equivalent nor identical according to the Tautology Creation rule!"
            );
        });
    });

});