import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts";
import DistributivityChecker from "../error checkers/DistributivityChecker.ts";

describe("Distributivity Checker", () => {
    const checker = new DistributivityChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
            "∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(x) ∧ cat(z)))"
        );
        testEquivalentTwoDirectional(checker,
            "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
            "∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(x) ∨ cat(z)))"
        );
        testEquivalentTwoDirectional(checker,
            "∃x∀y(cat(x) ∧ (cat(y) ∨ ∀a∀b∀z(cat(a) ∧ (cat(b) ∨ cat(z))) ))",
            "∃x∀y((cat(x) ∧ cat(y)) ∨ (cat(x) ∧ ∀a∀b∀z((cat(a) ∧ cat(b)) ∨ (cat(a) ∧ cat(z)))))"
        );
    });
    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(y) ∧ cat(z)))"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(y) ∨ cat(z)))"
            );
        });
        it("Incorrect connective", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))"
            );
        });
    });

});