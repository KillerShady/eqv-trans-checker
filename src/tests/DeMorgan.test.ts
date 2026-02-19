import {describe, expect, it} from "vitest";
import {parse} from "./testUtils.ts";
import DeMorganChecker from "../error checkers/DeMorganChecker.ts";

describe("De Morgan Checker", () => {
    const checker = new DeMorganChecker();

    describe("Standard Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("∃x∀y¬(cat(x) ∧ cat(y))"),
                parse("∃x∀y(¬cat(x) ∨ ¬cat(y))"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y¬(cat(x) ∨ cat(y))"),
                parse("∃x∀y(¬cat(x) ∧ ¬cat(y))"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("∃x∀y¬(cat(x) ∧ cat(y))"),
                parse("∃x∀y(¬cat(x) ∧ ¬cat(y))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y¬(cat(x) ∨ cat(y))"),
                parse("∃x∀y(¬cat(x) ∨ ¬cat(y))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("∃x∀y¬(cat(x) ∧ cat(y))"),
                parse("∃x∀y(¬cat(x) ∨ ¬cat(x))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y¬(cat(x) ∨ cat(y))"),
                parse("∃x∀y(¬cat(x) ∧ ¬cat(x))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("∃x∀y¬(cat(x) ∧ cat(y))"),
                parse("(¬cat(x) ∨ ¬cat(y))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y¬(cat(x) ∨ cat(y))"),
                parse("(¬cat(x) ∧ ¬cat(y))"),
            ).isError()).toBe(true);
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("∃x∀y(¬cat(x) ∨ ¬cat(y))"),
                parse("∃x∀y¬(cat(x) ∧ cat(y))"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(¬cat(x) ∧ ¬cat(y))"),
                parse("∃x∀y¬(cat(x) ∨ cat(y))"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("∃x∀y(¬cat(x) ∧ ¬cat(y))"),
                parse("∃x∀y¬(cat(x) ∧ cat(y))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(¬cat(x) ∨ ¬cat(y))"),
                parse("∃x∀y¬(cat(x) ∨ cat(y))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("∃x∀y(¬cat(x) ∨ ¬cat(x))"),
                parse("∃x∀y¬(cat(x) ∧ cat(y))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(¬cat(x) ∧ ¬cat(x))"),
                parse("∃x∀y¬(cat(x) ∨ cat(y))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("(¬cat(x) ∨ ¬cat(y))"),
                parse("∃x∀y¬(cat(x) ∧ cat(y))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("(¬cat(x) ∧ ¬cat(y))"),
                parse("∃x∀y¬(cat(x) ∨ cat(y))"),
            ).isError()).toBe(true);
        });
    });

});