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

        testEquivalentTwoDirectional(checker,
            "cat(x) ∧ (cat(y) ∨ ((cat(A) ∧ cat(B)) ∨ (cat(A) ∧ cat(C))))",
            "(cat(x) ∧ cat(y)) ∨ (cat(x) ∧ (cat(A) ∧ (cat(B) ∨ cat(C))))"
        );
    });
    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(y) ∧ cat(z)))",
                "cat(x) and cat(y) are neither equivalent nor identical according to the Distributivity rule!",
                "cat(y) and cat(x) are neither equivalent nor identical according to the Distributivity rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(y) ∨ cat(z)))",
                "cat(x) and cat(y) are neither equivalent nor identical according to the Distributivity rule!",
                "cat(y) and cat(x) are neither equivalent nor identical according to the Distributivity rule!"
            );
        });
        it("Incorrect connective", () => {
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))",
                "(cat(x)  ∧  (cat(y)  ∨  cat(z))) and ((cat(x)  ∧  cat(y))  ∧  (cat(x)  ∧  cat(z))) are neither equivalent nor identical according to the Distributivity rule!",
                "((cat(x)  ∧  cat(y))  ∧  (cat(x)  ∧  cat(z))) and (cat(x)  ∧  (cat(y)  ∨  cat(z))) are neither equivalent nor identical according to the Distributivity rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))",
                "(cat(x)  ∨  (cat(y)  ∧  cat(z))) and ((cat(x)  ∨  cat(y))  ∨  (cat(x)  ∨  cat(z))) are neither equivalent nor identical according to the Distributivity rule!",
                "((cat(x)  ∨  cat(y))  ∨  (cat(x)  ∨  cat(z))) and (cat(x)  ∨  (cat(y)  ∧  cat(z))) are neither equivalent nor identical according to the Distributivity rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))",
                "∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))",
                "(cat(x)  ∧  (cat(y)  ∨  cat(z))) and ((cat(x)  ∨  cat(y))  ∨  (cat(x)  ∨  cat(z))) are neither equivalent nor identical according to the Distributivity rule!",
                "((cat(x)  ∨  cat(y))  ∨  (cat(x)  ∨  cat(z))) and (cat(x)  ∧  (cat(y)  ∨  cat(z))) are neither equivalent nor identical according to the Distributivity rule!"
            );
            testErrorTwoDirectional(checker,
                "∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))",
                "∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))",
                "(cat(x)  ∨  (cat(y)  ∧  cat(z))) and ((cat(x)  ∧  cat(y))  ∧  (cat(x)  ∧  cat(z))) are neither equivalent nor identical according to the Distributivity rule!",
                "((cat(x)  ∧  cat(y))  ∧  (cat(x)  ∧  cat(z))) and (cat(x)  ∨  (cat(y)  ∧  cat(z))) are neither equivalent nor identical according to the Distributivity rule!"
            );
        });
    });

});