import {describe, it} from "vitest";
import {testEquivalent, testError, testIdentical} from "../testUtils.ts"
import SkolemizationChecker from "../../error_checkers/SkolemizationChecker.ts";

describe("Skolemization Checker", () => {
    const checker = new SkolemizationChecker();

    testIdentical(checker);

    describe("Correct", () => {
        it("Constant", () => {
            testEquivalent(checker,
                "∃x∀y(¬cat(y)∨loves(x, y))",
                "∀y(¬cat(y)∨loves(sk1, y))"
            );
            testEquivalent(checker,
                "∃x ¬cat(x) ∨ ∃y cat(y)",
                "¬cat(sk1) ∨ cat(sk2)"
            );
        });
        it("Function", () => {
            testEquivalent(checker,
                "∀y∃x(¬cat(y)∨loves(x, y))",
                "∀y(¬cat(y)∨loves(skf1(y), y))"
            );
            testEquivalent(checker,
                "∀y∃x(¬cat(y)∨loves(x, y)) ∧ ∀a∀b∃c cat(c)",
                "∀y(¬cat(y)∨loves(skf1(y), y)) ∧ ∀a∀b cat(skf2(a,b))"
            );
        });
    });

    describe("Incorrect", () => {
        it("Not NNF", () => {
            testError(checker,
                "¬∃x cat(y)",
                "∃x cat(x)",
                "Original formula is not in NNF!"
            );
        });

        it("Incorrect variable in function", () => {
            testError(checker,
                "∀y∃x(¬cat(y)∨loves(x, y))",
                "∀y(¬cat(y)∨loves(skf1(m), y))",
                "Expected skf1(y) but found skf1(m) instead!"
            );
            testError(checker,
                "∀a∀y∃x(¬cat(y)∨loves(x, y))",
                "∀a∀y(¬cat(y)∨loves(skf2(a, m), y))",
                "Expected skf2(a, y) but found skf2(a, m) instead!"
            );
            testError(checker,
                "∀a∀y∃x(¬cat(y)∨loves(x, x))",
                "∀a∀y(¬cat(y)∨loves(skf2(a, y), skf2(y, a)))",
                "Expected skf2(a, y) but found skf2(y, a) instead!"
            );
        });

        it("Reusing the same skolem symbol", () => {
            testError(checker,
                "∃x(cat(x)) ∨ ∃b(cat(b))",
                "cat(sk1) ∨ cat(sk1)",
                "Skolem constant sk1 was used to replace a different variable!"
            );
            testError(checker,
                "∀y∃x(cat(x)) ∨ ∀a∃b(cat(b))",
                "∀y(cat(skf1(y))) ∨ ∀a(cat(skf1(b)))",
                "Skolem function skf1 was used to replace a different variable!"
            );
        });

        it("Incorrect arity", () => {
            testError(checker,
                "∀y∃x(cat(x))",
                "∀y(cat(skf2(y,y)))",
                "Expected skolem function to have arity of 1 but found arity of 2 instead!"
            );
        });

        it("Incorrect subformula", () => {
            testError(checker,
                "∃x∀y(¬cat(y)∨loves(x, y)) ∨ ∀a∀b∀c cat(c)",
                "∀y(¬cat(y)∨loves(sk1, y)) ∨ ∀a∀b∀c loves(me, you)",
                "cat(c) and loves(me, you) are neither equisatisfiable nor identical according to the Skolemization rule!"
            );
        });

    });

});