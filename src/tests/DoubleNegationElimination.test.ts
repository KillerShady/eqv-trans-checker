import {describe, expect, it} from "vitest";
import {parse} from "./testUtils.ts";
import DoubleNegationEliminationChecker from "../error checkers/DoubleNegationEliminationChecker.ts";

describe("Double Negation Elimination Checker", () => {
    const checker = new DoubleNegationEliminationChecker();

    describe("Standard Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("¬¬cat(x)"),
                parse("cat(x)"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("¬¬cat(x)"),
                parse("¬cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("¬¬cat(x)"),
                parse("∃x∀y(loves(x, y))"),
            ).isError()).toBe(true);
        });
    });

    describe("Reverse Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("cat(x)"),
                parse("¬¬cat(x)"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("¬cat(x)"),
                parse("¬¬cat(x)"),
            ).isError()).toBe(true);
            expect(checker.checkForError(
                parse("∃x∀y(loves(x, y))"),
                parse("¬¬cat(x)"),
            ).isError()).toBe(true);
        });
    });

});