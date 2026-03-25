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

            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ ⊥",
                "⊥"
            );
            testEquivalentTwoDirectional(checker,
                "⊥ ∧ cat(x)",
                "⊥"
            );
            testEquivalentTwoDirectional(checker,
                "(∃x∀y(cat(y) →loves(x, y)) ∧ ∀x((cat(x)∨loves(x,kitty)) →loves(kitty, x))) ∧ ⊥",
                "⊥"
            );

            testEquivalentTwoDirectional(checker,
                "((cat(x) ∧ ⊥) ∨ ⊥)",
                "(⊥ ∨ (⊥ ∧ ¬cat(x)))"
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

            testEquivalentTwoDirectional(checker,
                "cat(x) ∨ ⊤",
                "⊤"
            );
            testEquivalentTwoDirectional(checker,
                "⊤ ∨ cat(x)",
                "⊤"
            );
            testEquivalentTwoDirectional(checker,
                "(∃x∀y(cat(y) →loves(x, y)) ∧ ∀x((cat(x)∨loves(x,kitty)) →loves(kitty, x))) ∨ ⊤",
                "⊤"
            );

            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ ⊤) ∧ ⊤)",
                "(⊤ ∧ (⊤ ∨ ¬cat(x)))"
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
                "cat(x)",
                "(cat(x)  ∧  cat(y)) and cat(x) are neither equivalent nor identical according to the Association rule!",
                "cat(x) and (cat(x)  ∧  cat(y)) are neither equivalent nor identical according to the Association rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y((cat(x) ∧ cat(y)) ∧ cat(x))",
                "∃x∀y(cat(x) ∧ cat(x))",
                "(cat(x)  ∧  cat(y)) and cat(x) are neither equivalent nor identical according to the Association rule!",
                "cat(x) and (cat(x)  ∧  cat(y)) are neither equivalent nor identical according to the Association rule!"
            );
        });
        it("Incorrect connector", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∧ (cat(x) ∧ cat(y))",
                "cat(x)",
                "(cat(x)  ∧  (cat(x)  ∧  cat(y))) and cat(x) are neither equivalent nor identical according to the Association rule!",
                "cat(x) and (cat(x)  ∧  (cat(x)  ∧  cat(y))) are neither equivalent nor identical according to the Association rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y((cat(x) ∧ (cat(x) ∧ cat(y))) ∧ cat(x))",
                "∃x∀y(cat(x) ∧ cat(x))",
                "(cat(x)  ∧  (cat(x)  ∧  cat(y))) and cat(x) are neither equivalent nor identical according to the Association rule!",
                "cat(x) and (cat(x)  ∧  (cat(x)  ∧  cat(y))) are neither equivalent nor identical according to the Association rule!"
            );

            testErrorTwoDirectional(checker,
                "(cat(x) ∨ cat(y)) ∨ cat(x)",
                "cat(x)",
                "((cat(x)  ∨  cat(y))  ∨  cat(x)) and cat(x) are neither equivalent nor identical according to the Association rule!",
                "cat(x) and ((cat(x)  ∨  cat(y))  ∨  cat(x)) are neither equivalent nor identical according to the Association rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(((cat(x) ∨ cat(y)) ∨ cat(x)) ∨ cat(x))",
                "∃x∀y(cat(x) ∨ cat(x))",
                "((cat(x)  ∨  cat(y))  ∨  cat(x)) and cat(x) are neither equivalent nor identical according to the Association rule!",
                "cat(x) and ((cat(x)  ∨  cat(y))  ∨  cat(x)) are neither equivalent nor identical according to the Association rule!"
            );
        });
    });

});