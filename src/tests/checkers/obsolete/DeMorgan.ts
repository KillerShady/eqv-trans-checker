/*import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "../../testUtils.ts";
import DeMorganChecker from "../../../error_checkers/obsolete/DeMorganChecker.ts";

describe("De Morgan Checker", () => {
    const checker = new DeMorganChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "∃x∀y¬(cat(x) ∧ cat(y))",
            "∃x∀y(¬cat(x) ∨ ¬cat(y))"
        );
        testEquivalentTwoDirectional(checker,
            "∃x∀y¬(cat(x) ∨ cat(y))",
            "∃x∀y(¬cat(x) ∧ ¬cat(y))"
        );
        testEquivalentTwoDirectional(checker,
            "∃x∀y¬(¬(cat(x) ∧ cat(y)) ∧ cat(y))",
            "∃x∀y(¬(¬cat(x) ∨ ¬cat(y)) ∨ ¬cat(y))"
        );

        testEquivalentTwoDirectional(checker,
            "∃x∀y¬(cat(x) ∧ (¬cat(x) ∧ ¬cat(y)))",
            "∃x∀y(¬cat(x) ∨ ¬¬(cat(x) ∨ cat(y)))"
        );
    });

    describe("Incorrect", () => {
        it("Not changing connective", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∧ cat(y))",
                "∃x∀y(¬cat(x) ∧ ¬cat(y))",
                "¬(cat(x)  ∧  cat(y)) and (¬cat(x)  ∧  ¬cat(y)) are neither equivalent nor identical according to the De Morgan rule!",
                "(¬cat(x)  ∧  ¬cat(y)) and ¬(cat(x)  ∧  cat(y)) are neither equivalent nor identical according to the De Morgan rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "∃x∀y(¬cat(x) ∨ ¬cat(y))",
                "¬(cat(x)  ∨  cat(y)) and (¬cat(x)  ∨  ¬cat(y)) are neither equivalent nor identical according to the De Morgan rule!",
                "(¬cat(x)  ∨  ¬cat(y)) and ¬(cat(x)  ∨  cat(y)) are neither equivalent nor identical according to the De Morgan rule!"
            );
        });
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∧ cat(y))",
                "∃x∀y(¬cat(x) ∨ ¬cat(x))",
                "cat(y) and cat(x) are neither equivalent nor identical according to the De Morgan rule!",
                "cat(x) and cat(y) are neither equivalent nor identical according to the De Morgan rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "∃x∀y(¬cat(x) ∧ ¬cat(x))",
                "cat(y) and cat(x) are neither equivalent nor identical according to the De Morgan rule!",
                "cat(x) and cat(y) are neither equivalent nor identical according to the De Morgan rule!"
            );
        });
        it("Parent not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∧ cat(y))",
                "(¬cat(x) ∨ ¬cat(y))"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "(¬cat(x) ∧ ¬cat(y))"
            );
        });
    });

});*/