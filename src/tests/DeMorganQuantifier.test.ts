import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts";
import DeMorganQuantifierChecker from "../error checkers/DeMorganQuantifierChecker.ts";

describe("De Morgan Quantifier Checker", () => {
    const checker = new DeMorganQuantifierChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "¬∃x cat(x)",
            "∀x ¬cat(x)"
        );
        testEquivalentTwoDirectional(checker,
            "¬∀x cat(x)",
            "∃x ¬cat(x)"
        );
        testEquivalentTwoDirectional(checker,
            "¬∃x (cat(x) ∧ ¬∃y cat(y))",
            "∀x ¬(cat(x) ∧ ∀y ¬cat(y))"
        );
    });
    describe("Incorrect", () => {
        it("Missing negation", () => {
            testErrorTwoDirectional(checker,
                "¬∃x cat(x)",
                "∀x cat(x)"
            );
            testErrorTwoDirectional(checker,
                "¬∀x cat(x)",
                "∃x cat(x)"
            );
        });
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "¬∃x cat(x)",
                "∀x ¬cat(y)"
            );
            testErrorTwoDirectional(checker,
                "¬∀x cat(x)",
                "∃x ¬cat(y)"
            );
        });
    });

});