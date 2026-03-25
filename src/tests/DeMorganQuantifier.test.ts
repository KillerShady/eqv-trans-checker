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

        testEquivalentTwoDirectional(checker,
            "¬∃x (cat(x) ∧ ∀y ¬cat(y))",
            "∀x ¬(cat(x) ∧ ¬∃y cat(y))"
        );
    });
    describe("Incorrect", () => {
        it("Missing negation", () => {
            testErrorTwoDirectional(checker,
                "¬∃x cat(x)",
                "∀x cat(x)",
                "¬∃x cat(x) and ∀x cat(x) are neither equivalent nor identical according to the De Morgan rule for Quantifiers!",
                "∀x cat(x) and ¬∃x cat(x) are neither equivalent nor identical according to the De Morgan rule for Quantifiers!"
            );
            testErrorTwoDirectional(checker,
                "¬∀x cat(x)",
                "∃x cat(x)",
                "¬∀x cat(x) and ∃x cat(x) are neither equivalent nor identical according to the De Morgan rule for Quantifiers!",
                "∃x cat(x) and ¬∀x cat(x) are neither equivalent nor identical according to the De Morgan rule for Quantifiers!"
            );
        });
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "¬∃x cat(x)",
                "∀x ¬cat(y)",
                "cat(x) and cat(y) are neither equivalent nor identical according to the De Morgan rule for Quantifiers!",
                "cat(y) and cat(x) are neither equivalent nor identical according to the De Morgan rule for Quantifiers!"
            );
            testErrorTwoDirectional(checker,
                "¬∀x cat(x)",
                "∃x ¬cat(y)",
                "cat(x) and cat(y) are neither equivalent nor identical according to the De Morgan rule for Quantifiers!",
                "cat(y) and cat(x) are neither equivalent nor identical according to the De Morgan rule for Quantifiers!"
            );
        });
    });

});