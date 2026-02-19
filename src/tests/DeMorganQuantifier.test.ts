import {describe, expect, it} from "vitest";
import {parse} from "./testUtils.ts";
import DeMorganQuantifierChecker from "../error checkers/DeMorganQuantifierChecker.ts";

describe("De Morgan Quantifier Checker", () => {
    const checker = new DeMorganQuantifierChecker();

    describe("Standard Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("¬∃x cat(x)"),
                parse("∀x ¬cat(x)"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("¬∀x cat(x)"),
                parse("∃x ¬cat(x)"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("¬∃x cat(x)"),
                parse("∀x cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("¬∀x cat(x)"),
                parse("∃x cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("¬∃x cat(x)"),
                parse("∀x ¬cat(y)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("¬∀x cat(x)"),
                parse("∃x ¬cat(y)"),
            ).isError()).toBe(true);
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("∀x ¬cat(x)"),
                parse("¬∃x cat(x)"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∃x ¬cat(x)"),
                parse("¬∀x cat(x)"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("∀x cat(x)"),
                parse("¬∃x cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x cat(x)"),
                parse("¬∀x cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∀x ¬cat(y)"),
                parse("¬∃x cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x ¬cat(y)"),
                parse("¬∀x cat(x)"),
            ).isError()).toBe(true);
        });
    });

});