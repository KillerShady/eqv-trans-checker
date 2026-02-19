import {describe, expect, it} from "vitest";
import {parse} from "./testUtils.ts";
import DistributivityChecker from "../error checkers/DistributivityChecker.ts";

describe("Distributivity Checker", () => {
    const checker = new DistributivityChecker();

    describe("Standard Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"),
                parse("∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(x) ∧ cat(z)))"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"),
                parse("∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(x) ∨ cat(z)))"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"),
                parse("∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(y) ∧ cat(z)))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"),
                parse("∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(y) ∨ cat(z)))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"),
                parse("∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"),
                parse("∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"),
                parse("∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"),
                parse("∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))"),
            ).isError()).toBe(true);
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(x) ∧ cat(z)))"),
                parse("∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"),
            ).isEquivalent()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(x) ∨ cat(z)))"),
                parse("∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("∃x∀y∀z((cat(x) ∧ cat(y)) ∨ (cat(y) ∧ cat(z)))"),
                parse("∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y∀z((cat(x) ∨ cat(y)) ∧ (cat(y) ∨ cat(z)))"),
                parse("∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))"),
                parse("∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))"),
                parse("∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"),
            ).isError()).toBe(true);

            expect(checker.checkForError(
                parse("∃x∀y∀z((cat(x) ∨ cat(y)) ∨ (cat(x) ∨ cat(z)))"),
                parse("∃x∀y∀z(cat(x) ∧ (cat(y) ∨ cat(z)))"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y∀z((cat(x) ∧ cat(y)) ∧ (cat(x) ∧ cat(z)))"),
                parse("∃x∀y∀z(cat(x) ∨ (cat(y) ∧ cat(z)))"),
            ).isError()).toBe(true);
        });
    });

});