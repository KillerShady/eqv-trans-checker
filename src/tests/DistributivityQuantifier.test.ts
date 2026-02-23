import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts";
import DistributivityQuantifierChecker from "../error checkers/DistributivityQuantifierChecker.ts";

describe("Distributivity Quantifier Checker", () => {
    const checker = new DistributivityQuantifierChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "∃x(cat(x) ∨ ∀y cat(y))",
                "(∃x cat(x) ∨ ∃x∀y cat(y))"
            );
            testEquivalent(checker, 
                "∀x(cat(x) ∧ ∃y cat(y))",
                "(∀x cat(x) ∧ ∀x∃y cat(y))"
            );
            testEquivalent(checker,
                "∃x(cat(x) ∨ ∃y (cat(y) ∨ ∀z cat(z)))",
                "(∃x cat(x) ∨ ∃x(∃y cat(y) ∨ ∃y∀z cat(z)))"
            );
        });
        it("Incorrect", () => {
            testError(checker, 
                "∃x(cat(x) ∨ ∀y cat(y))",
                "(∃x cat(x) ∨ ∃x∀y cat(z))"
            );
            testError(checker, 
                "∀x(cat(x) ∧ ∃y cat(y))",
                "(∀x cat(x) ∧ ∀x∃y cat(z))"
            );

            testError(checker, 
                "∃x(cat(x) ∨ ∀y cat(y))",
                "(∃x cat(x) ∧ ∃x∀y cat(y))"
            );
            testError(checker, 
                "∀x(cat(x) ∧ ∃y cat(y))",
                "(∀x cat(x) ∨ ∀x∃y cat(y))"
            );
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "(∃x cat(x) ∨ ∃x∀y cat(y))",
                "∃x(cat(x) ∨ ∀y cat(y))"
            );
            testEquivalent(checker, 
                "(∀x cat(x) ∧ ∀x∃y cat(y))",
                "∀x(cat(x) ∧ ∃y cat(y))"
            );
            testEquivalent(checker,
                "(∃x cat(x) ∨ ∃x(∃y cat(y) ∨ ∃y∀z cat(z)))",
                "∃x(cat(x) ∨ ∃y (cat(y) ∨ ∀z cat(z)))"
            );
        });
        it("Incorrect", () => {
            testError(checker, 
                "(∃x cat(x) ∨ ∃x∀y cat(z))",
                "∃x(cat(x) ∨ ∀y cat(y))"
            );
            testError(checker, 
                "(∀x cat(x) ∧ ∀x∃y cat(z))",
                "∀x(cat(x) ∧ ∃y cat(y))"
            );

            testError(checker, 
                "(∃x cat(x) ∧ ∃x∀y cat(y))",
                "∃x(cat(x) ∨ ∀y cat(y))"
            );
            testError(checker, 
                "(∀x cat(x) ∨ ∀x∃y cat(y))",
                "∀x(cat(x) ∧ ∃y cat(y))"
            );
        });
    });

});