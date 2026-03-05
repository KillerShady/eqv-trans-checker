import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "./testUtils.ts";
import DoubleNegationEliminationChecker from "../error checkers/DoubleNegationEliminationChecker.ts";

describe("Double Negation Elimination Checker", () => {
    const checker = new DoubleNegationEliminationChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "¬¬cat(x)",
            "cat(x)"
        );
        testEquivalentTwoDirectional(checker,
            "¬¬¬¬cat(x)",
            "cat(x)"
        );

        testEquivalentTwoDirectional(checker,
            "¬¬(cat(x) ∧ cat(x))",
            "(cat(x) ∧ ¬¬cat(x))"
        );
    });
    it("Incorrect", () => {
        testErrorTwoDirectional(checker,
            "¬¬cat(x)",
            "¬cat(x)"
        );
        testErrorTwoDirectional(checker,
            "¬¬cat(x)",
            "∃x∀y(loves(x, y))"
        );
    });

});