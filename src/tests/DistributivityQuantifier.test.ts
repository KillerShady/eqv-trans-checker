import {describe, expect, it} from "vitest";
import {parse} from "./testUtils.ts";
import DistributivityQuantifierChecker from "../error checkers/DistributivityQuantifierChecker.ts";

describe("Distributivity Quantifier Checker", () => {
    const checker = new DistributivityQuantifierChecker();

    describe("Standard Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("∃x(cat(x) ∨ ∀y cat(y))"),
                parse("(∃x cat(x) ∨ ∃x∀y cat(y))"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∀x(cat(x) ∧ ∃y cat(y))"),
                parse("(∀x cat(x) ∧ ∀x∃y cat(y))"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("∃x(cat(x) ∨ ∀y cat(y))"),
                parse("(∃x cat(x) ∨ ∃x∀y cat(z))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∀x(cat(x) ∧ ∃y cat(y))"),
                parse("(∀x cat(x) ∧ ∀x∃y cat(z))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("∃x(cat(x) ∨ ∀y cat(y))"),
                parse("(∃x cat(x) ∧ ∃x∀y cat(y))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∀x(cat(x) ∧ ∃y cat(y))"),
                parse("(∀x cat(x) ∨ ∀x∃y cat(y))"),
            ).isError()).toBe(true);
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("(∃x cat(x) ∨ ∃x∀y cat(y))"),
                parse("∃x(cat(x) ∨ ∀y cat(y))"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("(∀x cat(x) ∧ ∀x∃y cat(y))"),
                parse("∀x(cat(x) ∧ ∃y cat(y))"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("(∃x cat(x) ∨ ∃x∀y cat(z))"),
                parse("∃x(cat(x) ∨ ∀y cat(y))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("(∀x cat(x) ∧ ∀x∃y cat(z))"),
                parse("∀x(cat(x) ∧ ∃y cat(y))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("(∃x cat(x) ∧ ∃x∀y cat(y))"),
                parse("∃x(cat(x) ∨ ∀y cat(y))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("(∀x cat(x) ∨ ∀x∃y cat(y))"),
                parse("∀x(cat(x) ∧ ∃y cat(y))"),
            ).isError()).toBe(true);
        });
    });

});