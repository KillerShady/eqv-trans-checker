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
            "¬cat(x)",
            "cat(x) and ¬cat(x) are neither equivalent nor identical according to the Double Negation Elimination rule!",
            "¬cat(x) and cat(x) are neither equivalent nor identical according to the Double Negation Elimination rule!"
        );
        testErrorTwoDirectional(checker,
            "¬¬cat(x)",
            "∃x∀y(loves(x, y))",
            "cat(x) and ∃x ∀y loves(x, y) are neither equivalent nor identical according to the Double Negation Elimination rule!",
            "∃x ∀y loves(x, y) and cat(x) are neither equivalent nor identical according to the Double Negation Elimination rule!"
        );
        testErrorTwoDirectional(checker,
            "∃x¬¬(¬¬cat(x) ∧ ¬loves(x, y))",
            "∃x(¬cat(x) ∧ ¬loves(a, x))",
            "(¬¬cat(x)  ∧  ¬loves(x, y)) and (¬cat(x)  ∧  ¬loves(a, x)) are neither equivalent nor identical according to the Double Negation Elimination rule!",
            "(¬cat(x)  ∧  ¬loves(a, x)) and (¬¬cat(x)  ∧  ¬loves(x, y)) are neither equivalent nor identical according to the Double Negation Elimination rule!"
        );
    });

});