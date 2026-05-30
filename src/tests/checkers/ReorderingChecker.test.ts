import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "../testUtils.ts"
import ReorderingChecker from "../../error_checkers/ReorderingChecker.ts";

describe("Associativity and Commutativity Checker", () => {
    const checker = new ReorderingChecker();

    testIdentical(checker);

    describe("Correct", () => {
        it("Conjunction", () => {
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ cat(y) ∧ cat(z)",
                "cat(y) ∧ cat(x) ∧ cat(z)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ cat(y) ∧ cat(z)",
                "cat(z) ∧ cat(y) ∧ cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∧ cat(y) ∧ cat(z)",
                "cat(x) ∧ cat(z) ∧ cat(y)"
            );
        });

        it("Disjunction", () => {
            testEquivalentTwoDirectional(checker,
                "cat(x) ∨ cat(y) ∨ cat(z)",
                "cat(y) ∨ cat(x) ∨ cat(z)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∨ cat(y) ∨ cat(z)",
                "cat(z) ∨ cat(y) ∨ cat(x)"
            );
            testEquivalentTwoDirectional(checker,
                "cat(x) ∨ cat(y) ∨ cat(z)",
                "cat(x) ∨ cat(z) ∨ cat(y)"
            );
        });

        it("Nested", () => {
            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "((cat(y) ∨ cat(x) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)"
            );
            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "((cat(z) ∨ cat(y) ∨ cat(x)) -> cat(x)) ∧ cat(a) ∧ cat(b)"
            );
            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "((cat(x) ∨ cat(z) ∨ cat(y)) -> cat(x)) ∧ cat(a) ∧ cat(b)"
            );

            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "cat(a) ∧ ((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(b)"
            );
            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "cat(b) ∧ cat(a) ∧ ((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x))"
            );
            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(b) ∧ cat(a)"
            );

            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "cat(a) ∧ ((cat(y) ∨ cat(x) ∨ cat(z)) -> cat(x)) ∧ cat(b)"
            );
            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "cat(b) ∧ cat(a) ∧ ((cat(z) ∨ cat(y) ∨ cat(x)) -> cat(x))"
            );
            testEquivalentTwoDirectional(checker,
                "((cat(x) ∨ cat(y) ∨ cat(z)) -> cat(x)) ∧ cat(a) ∧ cat(b)",
                "((cat(x) ∨ cat(z) ∨ cat(y)) -> cat(x)) ∧ cat(b) ∧ cat(a)"
            );
        });
    });

    describe("Incorrect", () => {
        it("Incorrect amount of subformulas", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∧ cat(y) ∧ cat(z)",
                "cat(x) ∧ cat(y)",
                "(cat(x)  ∧  cat(y)  ∧  cat(z)) has more conjuncts than (cat(x)  ∧  cat(y))",
                "(cat(x)  ∧  cat(y)  ∧  cat(z)) has more conjuncts than (cat(x)  ∧  cat(y))"
            );
            testErrorTwoDirectional(checker,
                "cat(x) ∨ cat(y) ∨ cat(z)",
                "cat(x) ∨ cat(y)",
                "(cat(x)  ∨  cat(y)  ∨  cat(z)) has more disjuncts than (cat(x)  ∨  cat(y))",
                "(cat(x)  ∨  cat(y)  ∨  cat(z)) has more disjuncts than (cat(x)  ∨  cat(y))"
            );
        });

        it("Incorrect subformulas", () => {
            testErrorTwoDirectional(checker,
                "cat(x) ∧ cat(y)",
                "cat(x) ∧ cat(z)",
                "(cat(x)  ∧  cat(y)) and (cat(x)  ∧  cat(z)) are neither equivalent nor identical according to a combination of Associativity and Commutativity rules!",
                "(cat(x)  ∧  cat(z)) and (cat(x)  ∧  cat(y)) are neither equivalent nor identical according to a combination of Associativity and Commutativity rules!"
            );
        });

    });

});