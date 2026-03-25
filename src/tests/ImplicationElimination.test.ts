import {describe, it} from "vitest";
import ImplicationEliminationChecker from "../error checkers/ImplicationEliminationChecker.ts";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts";

describe("Implication Elimination Checker", () => {
    const checker = new ImplicationEliminationChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "∃x∀y(cat(y) → loves(x, y))",
            "∃x∀y(¬cat(y) ∨ loves(x, y))"
        );
        testEquivalentTwoDirectional(checker,
            "∃x∀y(cat(y) → (cat(x) → loves(x, y)))",
            "∃x∀y(¬cat(y) ∨ (¬cat(x) ∨ loves(x, y)))"
        );

        testEquivalentTwoDirectional(checker,
            "∃x∀y(cat(y) → (¬cat(x) ∨ loves(x, y)))",
            "∃x∀y(¬cat(y) ∨ (cat(x) → loves(x, y)))"
        );
    });
    it("Incorrect", () => {
        testErrorTwoDirectional(checker,
            "∃x∀y(cat(y) → loves(x, y))",
            "∃x∀y(cat(y) ∨ loves(x, y))",
            "(cat(y) → loves(x, y)) and (cat(y)  ∨  loves(x, y)) are neither equivalent nor identical according to the Implication Elimination rule!",
            "(cat(y)  ∨  loves(x, y)) and (cat(y) → loves(x, y)) are neither equivalent nor identical according to the Implication Elimination rule!"
        );
        testErrorTwoDirectional(checker,
            "∃a∀b(∃x∀y(cat(y) → loves(x, y)) ∧ ∀y(cat(y) → loves(x, y)))",
            "∃a∀b(∃x∀y(cat(y) ∨ loves(x, y)) ∧ ∀y(¬cat(y) ∨ loves(x, x)))",
            "(cat(y) → loves(x, y)) and (cat(y)  ∨  loves(x, y)) are neither equivalent nor identical according to the Implication Elimination rule!",
            "(cat(y)  ∨  loves(x, y)) and (cat(y) → loves(x, y)) are neither equivalent nor identical according to the Implication Elimination rule!"
        );
        testErrorTwoDirectional(checker,
            "∃x∀y(cat(y) → loves(x, y))",
            "∃x∀y(¬cat(y) ∨ loves(x, x))",
            "y and x are neither equivalent nor identical according to the Implication Elimination rule!",
            "x and y are neither equivalent nor identical according to the Implication Elimination rule!"
        );
    });

});