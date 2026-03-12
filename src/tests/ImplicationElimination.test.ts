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
//            "(cat(y) → loves(x, y)) and (cat(y)  ∨  loves(x, y)) are not equivalent according to the Implication Elimination rule!"
        );
    });

});