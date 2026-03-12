import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts";
import DeMorganChecker from "../error checkers/DeMorganChecker.ts";

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
                "∃x∀y(¬cat(x) ∧ ¬cat(y))"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "∃x∀y(¬cat(x) ∨ ¬cat(y))"
            );
        });
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∧ cat(y))",
                "∃x∀y(¬cat(x) ∨ ¬cat(x))"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y¬(cat(x) ∨ cat(y))",
                "∃x∀y(¬cat(x) ∧ ¬cat(x))"
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

});