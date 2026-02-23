import {describe, it} from "vitest";
import ImplicationEliminationChecker from "../error checkers/ImplicationEliminationChecker.ts";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts";

describe("Implication Elimination Checker", () => {
    const checker = new ImplicationEliminationChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "∃x∀y(cat(y) → loves(x, y))",
                "∃x∀y(¬cat(y) ∨ loves(x, y))"
            );
            testEquivalent(checker,
                "∃x∀y(cat(y) → (cat(x) → loves(x, y)))",
                "∃x∀y(¬cat(y) ∨ (¬cat(x) ∨ loves(x, y)))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x∀y(cat(y) → loves(x, y))",
                "∃x∀y(cat(y) ∨ loves(x, y))"
            );
            //testEquivalent(checker, 
            //    "∃x∀y(cat(y) → loves(x, y))",
            //    "∃x∀y(cat(y) ∨ loves(x, y))",
            //).errors[0].message).toBe("cat(y) → loves(x, y) and cat(y)  ∨  loves(x, y) are not equivalent according to the Implication Elimination rule!");
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "∃x∀y(¬cat(y) ∨ loves(x, y))",
                "∃x∀y(cat(y) → loves(x, y))"
            );
            testEquivalent(checker,
                "∃x∀y(¬cat(y) ∨ (¬cat(x) ∨ loves(x, y)))",
                "∃x∀y(cat(y) → (cat(x) → loves(x, y)))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x∀y(cat(y) ∨ loves(x, y))",
                "∃x∀y(cat(y) → loves(x, y))"
            );
            //testEquivalent(checker, 
            //    "∃x∀y(cat(y) → loves(x, y))",
            //    "∃x∀y(cat(y) ∨ loves(x, y))",
            //).errors[0].message).toBe("cat(y) → loves(x, y) and cat(y)  ∨  loves(x, y) are not equivalent according to the Implication Elimination rule!");
        });
    });

});