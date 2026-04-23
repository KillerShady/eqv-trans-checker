import {describe, it} from "vitest";
import {
    testEquivalentTwoDirectional,
    testErrorTwoDirectional,
    testIdentical
} from "../testUtils.ts";
import DistributivityQuantifierChecker from "../../error checkers/DistributivityQuantifierChecker.ts";

describe("Distributivity Quantifier Checker", () => {
    const checker = new DistributivityQuantifierChecker();

    testIdentical(checker);

    it("Correct", () => {
        testEquivalentTwoDirectional(checker,
            "∃x(cat(x) ∨ ∀y cat(y))",
            "(∃x cat(x) ∨ ∃x∀y cat(y))"
        );
        testEquivalentTwoDirectional(checker,
            "∀x(cat(x) ∧ ∃y cat(y))",
            "(∀x cat(x) ∧ ∀x∃y cat(y))"
        );
        testEquivalentTwoDirectional(checker,
            "∃x(cat(x) ∨ ∃y (cat(y) ∨ ∀z cat(z)))",
            "(∃x cat(x) ∨ ∃x(∃y cat(y) ∨ ∃y∀z cat(z)))"
        );

        testEquivalentTwoDirectional(checker,
            "∃x(cat(x) ∨ (∀y cat(y) ∧ ∀y cat(z)))",
            "(∃x cat(x) ∨ ∃x∀y (cat(y) ∧ cat(z)))"
        );
    });
    describe("Incorrect", () => {
        it("Subtree not equivalent", () => {
            testErrorTwoDirectional(checker,
                "∃x(cat(x) ∨ ∀y cat(y))",
                "(∃x cat(x) ∨ ∃x∀y cat(z))",
                "cat(y) and cat(z) are neither equivalent nor identical according to the Distributivity of Quantifiers rule!",
                "cat(z) and cat(y) are neither equivalent nor identical according to the Distributivity of Quantifiers rule!"
            );
            testErrorTwoDirectional(checker,
                "∀x(cat(x) ∧ ∃y cat(y))",
                "(∀x cat(x) ∧ ∀x∃y cat(z))",
                "cat(y) and cat(z) are neither equivalent nor identical according to the Distributivity of Quantifiers rule!",
                "cat(z) and cat(y) are neither equivalent nor identical according to the Distributivity of Quantifiers rule!"
            );
        });
        it("Incorrect connective", () => {
            testErrorTwoDirectional(checker,
                "∃x(cat(x) ∨ ∀y cat(y))",
                "(∃x cat(x) ∧ ∃x∀y cat(y))",
                "∃x (cat(x)  ∨  ∀y cat(y)) and (∃x cat(x)  ∧  ∃x ∀y cat(y)) are neither equivalent nor identical according to the Distributivity of Quantifiers rule!",
                "(∃x cat(x)  ∧  ∃x ∀y cat(y)) and ∃x (cat(x)  ∨  ∀y cat(y)) are neither equivalent nor identical according to the Distributivity of Quantifiers rule!"
            );
            testErrorTwoDirectional(checker,
                "∀x(cat(x) ∧ ∃y cat(y))",
                "(∀x cat(x) ∨ ∀x∃y cat(y))",
                "∀x (cat(x)  ∧  ∃y cat(y)) and (∀x cat(x)  ∨  ∀x ∃y cat(y)) are neither equivalent nor identical according to the Distributivity of Quantifiers rule!",
                "(∀x cat(x)  ∨  ∀x ∃y cat(y)) and ∀x (cat(x)  ∧  ∃y cat(y)) are neither equivalent nor identical according to the Distributivity of Quantifiers rule!"
            );
        });
    });

});