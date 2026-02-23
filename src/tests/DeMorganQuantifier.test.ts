import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts";
import DeMorganQuantifierChecker from "../error checkers/DeMorganQuantifierChecker.ts";

describe("De Morgan Quantifier Checker", () => {
    const checker = new DeMorganQuantifierChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "¬∃x cat(x)",
                "∀x ¬cat(x)"
            );
            testEquivalent(checker, 
                "¬∀x cat(x)",
                "∃x ¬cat(x)"
            );
            testEquivalent(checker,
                "¬∃x (cat(x) ∧ ¬∃y cat(y))",
                "∀x ¬(cat(x) ∧ ∀y ¬cat(y))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "¬∃x cat(x)",
                "∀x cat(x)"
            );
            testError(checker,
                "¬∀x cat(x)",
                "∃x cat(x)"
            );
            testError(checker,
                "¬∃x cat(x)",
                "∀x ¬cat(y)"
            );
            testError(checker,
                "¬∀x cat(x)",
                "∃x ¬cat(y)"
            );
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            testEquivalent(checker,
                "∀x ¬cat(x)",
                "¬∃x cat(x)"
            );
            testEquivalent(checker,
                "∃x ¬cat(x)",
                "¬∀x cat(x)"
            );
            testEquivalent(checker,
                "∀x ¬(cat(x) ∧ ∀y ¬cat(y))",
                "¬∃x (cat(x) ∧ ¬∃y cat(y))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∀x cat(x)",
                "¬∃x cat(x)"
            );
            testError(checker,
                "∃x cat(x)",
                "¬∀x cat(x)"
            );
            testError(checker,
                "∀x ¬cat(y)",
                "¬∃x cat(x)"
            );
            testError(checker,
                "∃x ¬cat(y)",
                "¬∀x cat(x)"
            );
        });
    });

});