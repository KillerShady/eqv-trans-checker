import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts";
import DoubleNegationEliminationChecker from "../error checkers/DoubleNegationEliminationChecker.ts";

describe("Double Negation Elimination Checker", () => {
    const checker = new DoubleNegationEliminationChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "¬¬cat(x)",
                "cat(x)"
            );
            testEquivalent(checker,
                "¬¬(¬¬cat(x))",
                "cat(x)"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "¬¬cat(x)",
                "¬cat(x)"
            );
            testError(checker,
                "¬¬cat(x)",
                "∃x∀y(loves(x, y))"
            );
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "cat(x)",
                "¬¬cat(x)"
            );
            testEquivalent(checker,
                "cat(x)",
                "¬¬(¬¬cat(x))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "¬cat(x)",
                "¬¬cat(x)"
            );
            testError(checker,
                "∃x∀y(loves(x, y))",
                "¬¬cat(x)"
            );
        });
    });

});