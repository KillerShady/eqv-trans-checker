import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts";
import DistributivityQuantifierChecker from "../error checkers/DistributivityQuantifierChecker.ts";

describe("Distributivity Quantifier Checker", () => {
    const checker = new DistributivityQuantifierChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "∃x(cat(x) ∨ ∀y cat(y))",
            "(∃x cat(x) ∨ ∃x∀y cat(y))"
        );
        testEquivalentTwoDirectional(checker,
            "∀x(cat(x) ∧ ∃y cat(y))",
            "(∀x cat(x) ∧ ∀x∃y cat(y))"
        );
        testEquivalentTwoDirectional(checker,
            "∃x(cat(x) ∨ ∃y (cat(y) ∨ ∀z cat(z)))",
            "(∃x cat(x) ∨ ∃x(∃y cat(y) ∨ ∃y∀z cat(z)))"
        );
    });
    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x(cat(x) ∨ ∀y cat(y))",
                "(∃x cat(x) ∨ ∃x∀y cat(z))"
            );
            testErrorTwoDirectional(checker,
                "∀x(cat(x) ∧ ∃y cat(y))",
                "(∀x cat(x) ∧ ∀x∃y cat(z))"
            );
        });
        it("Incorrect connective", () => {
            testErrorTwoDirectional(checker,
                "∃x(cat(x) ∨ ∀y cat(y))",
                "(∃x cat(x) ∧ ∃x∀y cat(y))"
            );
            testErrorTwoDirectional(checker,
                "∀x(cat(x) ∧ ∃y cat(y))",
                "(∀x cat(x) ∨ ∀x∃y cat(y))"
            );
        });
    });

});