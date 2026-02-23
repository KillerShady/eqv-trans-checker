import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts";
import DistributivityChecker from "../error checkers/DistributivityChecker.ts";

describe("Distributivity Checker", () => {
    const checker = new DistributivityChecker();

    testIdentical(checker);

    describe("Standard Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(x) ∧ cat(z)))"
            );
            testEquivalent(checker, 
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(x) ∨ cat(z)))"
            );
            testEquivalent(checker,
                "∃x∀y(cat(x) ∧ (cat(y) ∨ ∀a∀b∀z(cat(a) ∧ (cat(b) ∨ cat(z))) ))",
                "∃x∀y((cat(x) ∧ cat(y)) ∨ (cat(x) ∧ ∀a∀b∀z((cat(a) ∧ cat(b)) ∨ (cat(a) ∧ cat(z)))))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(y) ∧ cat(z)))"
            );
            testError(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(y) ∨ cat(z)))"
            );

            testError(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))"
            );
            testError(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))"
            );

            testError(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))"
            );
            testError(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))"
            );
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            testEquivalent(checker, 
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(x) ∧ cat(z)))",
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"
            );
            testEquivalent(checker, 
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(x) ∨ cat(z)))",
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"
            );
            testEquivalent(checker,
                "∃x∀y((cat(x) ∧ cat(y)) ∨ (cat(x) ∧ ∀a∀b∀z((cat(a) ∧ cat(b)) ∨ (cat(a) ∧ cat(z)))))",
                "∃x∀y(cat(x) ∧ (cat(y) ∨ ∀a∀b∀z(cat(a) ∧ (cat(b) ∨ cat(z))) ))"
            );
        });
        it("Incorrect", () => {
            testError(checker,
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"
            );
            testError(checker,
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"
            );

            testError(checker,
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))",
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"
            );
            testError(checker,
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))",
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"
            );

            testError(checker,
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))",
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"
            );
            testError(checker,
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))",
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"
            );
        });
    });

});