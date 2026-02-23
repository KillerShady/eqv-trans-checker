import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts";
import DeMorganChecker from "../error checkers/DeMorganChecker.ts";

describe("De Morgan Checker", () => {
    const checker = new DeMorganChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "∃x∀y¬(cat(x) ∧ cat(y))", 
                "∃x∀y(¬cat(x) ∨ ¬cat(y))"
            );
            testEquivalent(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "∃x∀y(¬cat(x) ∧ ¬cat(y))"
            );
            testEquivalent(checker,
                "∃x∀y¬(¬(cat(x) ∧ cat(y)) ∧ cat(y))",
                "∃x∀y(¬(¬cat(x) ∨ ¬cat(y)) ∨ ¬cat(y))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x∀y¬(cat(x) ∧ cat(y))",
                "∃x∀y(¬cat(x) ∧ ¬cat(y))"
            );
            testError(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "∃x∀y(¬cat(x) ∨ ¬cat(y))"
            );

            testError(checker,
                "∃x∀y¬(cat(x) ∧ cat(y))",
                "∃x∀y(¬cat(x) ∨ ¬cat(x))"
            );
            testError(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "∃x∀y(¬cat(x) ∧ ¬cat(x))"
            );

            testError(checker,
                "∃x∀y¬(cat(x) ∧ cat(y))",
                "(¬cat(x) ∨ ¬cat(y))"
            );
            testError(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "(¬cat(x) ∧ ¬cat(y))"
            );
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "∃x∀y(¬cat(x) ∨ ¬cat(y))",
                "∃x∀y¬(cat(x) ∧ cat(y))");
            testEquivalent(checker, 
                "∃x∀y(¬cat(x) ∧ ¬cat(y))",
                "∃x∀y¬(cat(x) ∨ cat(y))");
            testEquivalent(checker,
                "∃x∀y(¬(¬cat(x) ∨ ¬cat(y)) ∨ ¬cat(y))",
                "∃x∀y¬(¬(cat(x) ∧ cat(y)) ∧ cat(y))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x∀y(¬cat(x) ∧ ¬cat(y))",
                "∃x∀y¬(cat(x) ∧ cat(y))");
            testError(checker,
                "∃x∀y(¬cat(x) ∨ ¬cat(y))",
                "∃x∀y¬(cat(x) ∨ cat(y))");

            testError(checker,
                "∃x∀y(¬cat(x) ∨ ¬cat(x))",
                "∃x∀y¬(cat(x) ∧ cat(y))");
            testError(checker,
                "∃x∀y(¬cat(x) ∧ ¬cat(x))",
                "∃x∀y¬(cat(x) ∨ cat(y))");

            testError(checker,
                "(¬cat(x) ∨ ¬cat(y))",
                "∃x∀y¬(cat(x) ∧ cat(y))");
            testError(checker,
                "(¬cat(x) ∧ ¬cat(y))",
                "∃x∀y¬(cat(x) ∨ cat(y))");
        });
    });

});