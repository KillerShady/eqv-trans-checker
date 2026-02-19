import {describe, it, expect} from "vitest";
import RenamingVariablesChecker from "../error checkers/RenamingVariablesChecker.ts";
import {parse} from "./testUtils.ts"

describe("Renaming Variables Checker", () => {
    const checker = new RenamingVariablesChecker();

    describe("Correct transformations", () => {
        it("Renaming free variables", () => {
            expect(checker.checkForError(
                parse("cat(x)"),
                parse("cat(y)"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(x, kitty)) → loves(kitty, z))"),
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(y, kitty)) → loves(kitty, z))"),
            ).isEquivalent()).toBe(true);
        });

        it("Renaming bound variables", () => {
            expect(checker.checkForError(
                parse("∃x cat(x)"),
                parse("∃y cat(y)"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(z, kitty)) → loves(kitty, z))"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
                parse("∃a∀b(cat(b) → loves(a, b)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
            ).isEquivalent()).toBe(true);
        });

        it("Renaming bound and free variables", () => {
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(x)∨loves(x, kitty)) → loves(kitty, z))"),
                parse("∃a∀b(cat(b) → loves(a, b)) ∧ ∀z((cat(b)∨loves(b, kitty)) → loves(kitty, z))"),
            ).isEquivalent()).toBe(true);
        });

        it("Renaming nested variable", () => {
            expect(checker.checkForError(
                parse("∀x(∀x(cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
                parse("∀a(∀b(cat(b)∨loves(b, kitty)) → loves(kitty, a))"),
            ).isEquivalent()).toBe(true);
        });
    });

    describe("Incorrect transformations", () => {
        it("Identical formulas", () => {
            expect(checker.checkForError(
                parse("cat(x)"),
                parse("cat(x)"),
            ).isIdentical()).toBe(true);
            expect(checker.checkForError(
                parse("loves(x, catty(kitty)) ∧ cat(kitty)"),
                parse("loves(x, catty(kitty)) ∧ cat(kitty)"),
            ).isIdentical()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
            ).isIdentical()).toBe(true);
        });

        it("Changing free variable to bound", () => {
            expect(checker.checkForError(
                parse("∃x cat(y)"),
                parse("∃x cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x cat(y)"),
                parse("∃x cat(x)"),
            ).errors[0].message).toBe("Free variable y cannot be changed to a bound variable x!");
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(x, kitty)) → loves(kitty, x))"),
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(z, kitty)) → loves(kitty, x))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(x, kitty)) → loves(kitty, x))"),
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(z, kitty)) → loves(kitty, x))"),
            ).errors[0].message).toBe("Free variable x cannot be changed to a bound variable z!");
        });

        it("Incorrect renaming", () => {
            expect(checker.checkForError(
                parse("∃x cat(x)"),
                parse("∃y cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x cat(x)"),
                parse("∃y cat(x)"),
            ).errors[0].message).toBe("Expected y, found x!");
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(x, kitty)) → loves(kitty, z))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
                parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀z((cat(z)∨loves(x, kitty)) → loves(kitty, z))"),
            ).errors[0].message).toBe("Expected z, found x!");
        });

    });

});