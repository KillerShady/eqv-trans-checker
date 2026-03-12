import {describe, it} from "vitest";
import RenamingVariablesChecker from "../error checkers/RenamingVariablesChecker.ts";
import {testEquivalent, testError, testIdentical} from "./testUtils.ts"

describe("Renaming Variables Checker", () => {
    const checker = new RenamingVariablesChecker();

    testIdentical(checker);

    describe("Correct", () => {
        it("Renaming free variables", () => {
            testEquivalent(checker, 
                "cat(x)",
                "cat(y)"
            );
            testEquivalent(checker, 
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(x, kitty)) → loves(kitty, z))",
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(y, kitty)) → loves(kitty, z))"
            );
        });

        it("Renaming bound variables", () => {
            testEquivalent(checker, 
                "∃x cat(x)",
                "∃y cat(y)"
            );
            testEquivalent(checker, 
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))",
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(z, kitty)) → loves(kitty, z))"
            );
            testEquivalent(checker, 
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))",
                "∃a∀b(cat(b) → loves(a, b)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"
            );
        });

        it("Renaming bound and free variables", () => {
            testEquivalent(checker, 
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(x)∨loves(x, kitty)) → loves(kitty, z))",
                "∃a∀b(cat(b) → loves(a, b)) ∧ ∀z((cat(b)∨loves(b, kitty)) → loves(kitty, z))"
            );
        });

        it("Renaming nested variable", () => {
            testEquivalent(checker, 
                "∀x(∀x(cat(x)∨loves(x, kitty)) → loves(kitty, x))",
                "∀a(∀b(cat(b)∨loves(b, kitty)) → loves(kitty, a))"
            );
        });
    });

    describe("Incorrect", () => {
        it("Changing free variable to bound", () => {
            testError(checker,
                "∃x cat(y)",
                "∃x cat(x)",
                "Free variable y cannot be changed to a bound variable x!"
            );
            testError(checker,
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(x, kitty)) → loves(kitty, x))",
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(z, kitty)) → loves(kitty, x))",
                "Free variable x cannot be changed to a bound variable z!"
            );
        });

        it("Incorrect renaming", () => {
            testError(checker,
                "∃x cat(x)",
                "∃y cat(x)",
                "Expected y, found x!"
            );
            testError(checker,
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))",
                "∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(x, kitty)) → loves(kitty, z))",
                "Expected z, found x!"
            );
        });

    });

});