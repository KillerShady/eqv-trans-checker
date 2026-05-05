import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "../testUtils.ts";
import EquivalenceEliminationChecker from "../../error checkers/EquivalenceEliminationChecker.ts";

describe("Equivalence Elimination Checker", () => {
    const checker = new EquivalenceEliminationChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "∃x∀y(cat(y) ↔ loves(x, y))",
            "∃x∀y((cat(y) → loves(x, y)) ∧ (loves(x, y) → cat(y)))"
        );
        testEquivalentTwoDirectional(checker,
            "∃x∀y(cat(y) ↔ loves(x, y))",
            "∃x∀y((loves(x, y) → cat(y)) ∧ (cat(y) → loves(x, y)))"
        );
    });

    describe("Incorrect", () => {
        it("Incorrect order", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((loves(x, y) → cat(y)) ∧ (loves(x, y) → cat(y)))",
                "cat(y) and loves(x, y) are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "loves(x, y) and cat(y) are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((cat(y) → loves(x, y)) ∧ (cat(y) → loves(x, y)))",
                "cat(y) and loves(x, y) are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "loves(x, y) and cat(y) are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
        });
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((cat(x) → loves(x, y)) ∧ (loves(x, y) → cat(y)))",
                "cat(y) and cat(x) are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "cat(x) and cat(y) are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((cat(y) → loves(x, z)) ∧ (loves(x, y) → cat(y)))",
                "y and z are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "z and y are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((cat(y) → loves(x, y)) ∧ (loves(z, y) → cat(y)))",
                "x and z are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "z and x are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((cat(y) → loves(x, y)) ∧ (loves(x, y) → cat(z)))",
                "cat(y) and cat(z) are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "cat(z) and cat(y) are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );

            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((loves(x, x) → cat(y)) ∧ (cat(y) → loves(x, y)))",
                "y and x are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "x and y are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((loves(x, y) → cat(x)) ∧ (cat(y) → loves(x, y)))",
                "cat(y) and cat(x) are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "cat(x) and cat(y) are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((loves(x, y) → cat(y)) ∧ (cat(z) → loves(x, y)))",
                "cat(y) and cat(z) are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "cat(z) and cat(y) are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y(cat(y) ↔ loves(x, y))",
                "∃x∀y((loves(x, y) → cat(y)) ∧ (cat(y) → loves(z, y)))",
                "x and z are neither equivalent nor identical according to the Equivalence Elimination rule!",
                "z and x are neither equivalent nor identical according to the Equivalence Elimination rule!"
            );
        });
    });

});