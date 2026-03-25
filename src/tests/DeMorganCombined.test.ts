import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts";
import DeMorganCombinedChecker from "../error checkers/DeMorganCombinedChecker.ts";

describe("De Morgan Checker", () => {
    const checker = new DeMorganCombinedChecker();

    testIdentical(checker);
    describe("Correct", () => {
        it("Correct nested", () => {
            testEquivalentTwoDirectional(checker,
                "¬∀y(¬∀x(cat(x) ∨ cat(z)) ∨ cat(y))",
                "∃y(¬∃x(¬cat(x) ∧ ¬cat(z)) ∧ ¬cat(y))"
            );
            testEquivalentTwoDirectional(checker,
                "¬∀y(¬∀x(cat(x) ∨ cat(z)) ∨ cat(y))",
                "∃y(¬∃x(¬cat(x) ∧ ¬cat(z)) ∧ ¬cat(y))"
            );

            testEquivalentTwoDirectional(checker,
                "¬∀y(¬∀x(cat(x) ∨ cat(z)) ∨ cat(y))",
                "∃y(∀x(cat(x) ∨ cat(z)) ∧ ¬cat(y))"
            );
            testEquivalentTwoDirectional(checker,
                "¬∀y(¬∀x(cat(x) ∨ cat(z)) ∨ cat(y))",
                "∃y(∀x(cat(x) ∨ cat(z)) ∧ ¬cat(y))"
            );
        });
        it("Correct", () => {
            testEquivalentTwoDirectional(checker,
                "¬∀x(cat(x) ∧ cat(y))",
                "∃x(¬cat(x) ∨ ¬cat(y))"
            );
            testEquivalentTwoDirectional(checker,
                "¬∃x(cat(x) ∧ cat(y))",
                "∀x(¬cat(x) ∨ ¬cat(y))"
            );
            testEquivalentTwoDirectional(checker,
                "¬∀x(cat(x) ∨ cat(y))",
                "∃x(¬cat(x) ∧ ¬cat(y))"
            );
            testEquivalentTwoDirectional(checker,
                "¬∃x(cat(x) ∨ cat(y))",
                "∀x(¬cat(x) ∧ ¬cat(y))"
            );
        });
        it("Correct mixed direction", () => {
            testEquivalentTwoDirectional(checker,
                "¬∀x(cat(z) ∧ ¬(¬cat(x) ∧ cat(y)))",
                "∃x(¬cat(z) ∨ ¬(cat(x) ∨ ¬cat(y)))"
            );
        });

    });

    describe("Incorrect", () => {
        it("Not changing connective", () => {
            testErrorTwoDirectional(checker,
                "¬∀x(cat(x) ∧ cat(y))",
                "∃x(¬cat(x) ∧ ¬cat(y))",
                "Expected (cat(x)  ∧  cat(y)) to be a negation of (¬cat(x)  ∧  ¬cat(y))!",
                "Expected (¬cat(x)  ∧  ¬cat(y)) to be a negation of (cat(x)  ∧  cat(y))!"
            );
            testErrorTwoDirectional(checker,
                "¬∃x(cat(x) ∧ cat(y))",
                "∀x(¬cat(x) ∧ ¬cat(y))",
                "Expected (cat(x)  ∧  cat(y)) to be a negation of (¬cat(x)  ∧  ¬cat(y))!",
                "Expected (¬cat(x)  ∧  ¬cat(y)) to be a negation of (cat(x)  ∧  cat(y))!"
            );
            testErrorTwoDirectional(checker,
                "¬∀x(cat(x) ∨ cat(y))",
                "∃x(¬cat(x) ∨ ¬cat(y))",
                "Expected (cat(x)  ∨  cat(y)) to be a negation of (¬cat(x)  ∨  ¬cat(y))!",
                "Expected (¬cat(x)  ∨  ¬cat(y)) to be a negation of (cat(x)  ∨  cat(y))!"
            );
            testErrorTwoDirectional(checker,
                "¬∃x(cat(x) ∨ cat(y))",
                "∀x(¬cat(x) ∨ ¬cat(y))",
                "Expected (cat(x)  ∨  cat(y)) to be a negation of (¬cat(x)  ∨  ¬cat(y))!",
                "Expected (¬cat(x)  ∨  ¬cat(y)) to be a negation of (cat(x)  ∨  cat(y))!"
            );
        });
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "¬∀x(cat(x) ∧ cat(y))",
                "∃x(¬cat(x) ∨ ¬cat(x))",
                "cat(y) and cat(x) are neither equivalent nor identical according to the De Morgan rule!",
                "cat(x) and cat(y) are neither equivalent nor identical according to the De Morgan rule!"
            );
            testErrorTwoDirectional(checker,
                "¬∃x(cat(x) ∧ cat(y))",
                "∀x(¬cat(x) ∨ ¬cat(x))",
                "cat(y) and cat(x) are neither equivalent nor identical according to the De Morgan rule!",
                "cat(x) and cat(y) are neither equivalent nor identical according to the De Morgan rule!"
            );
            testErrorTwoDirectional(checker,
                "¬∀x(cat(x) ∨ cat(y))",
                "∃x(¬cat(x) ∧ ¬cat(x))",
                "cat(y) and cat(x) are neither equivalent nor identical according to the De Morgan rule!",
                "cat(x) and cat(y) are neither equivalent nor identical according to the De Morgan rule!"
            );
            testErrorTwoDirectional(checker,
                "¬∃x(cat(x) ∨ cat(y))",
                "∀x(¬cat(x) ∧ ¬cat(x))",
                "cat(y) and cat(x) are neither equivalent nor identical according to the De Morgan rule!",
                "cat(x) and cat(y) are neither equivalent nor identical according to the De Morgan rule!"
            );
        });
        it("Missing negation", () => {
            testErrorTwoDirectional(checker,
                "¬∀x(cat(x) ∧ cat(y))",
                "∃x(¬cat(x) ∨ cat(y))",
                "Expected cat(y) to be a negation of cat(y)!",
                "Expected cat(y) to be a negation of cat(y)!"
            );
            testErrorTwoDirectional(checker,
                "¬∃x(cat(x) ∧ cat(y))",
                "∀x(¬cat(x) ∨ cat(y))",
                "Expected cat(y) to be a negation of cat(y)!",
                "Expected cat(y) to be a negation of cat(y)!"
            );
            testErrorTwoDirectional(checker,
                "¬∀x(cat(x) ∨ cat(y))",
                "∃x(¬cat(x) ∧ cat(y))",
                "Expected cat(y) to be a negation of cat(y)!",
                "Expected cat(y) to be a negation of cat(y)!"
            );
            testErrorTwoDirectional(checker,
                "¬∃x(cat(x) ∨ cat(y))",
                "∀x(¬cat(x) ∧ cat(y))",
                "Expected cat(y) to be a negation of cat(y)!",
                "Expected cat(y) to be a negation of cat(y)!"
            );
        });
    });

});