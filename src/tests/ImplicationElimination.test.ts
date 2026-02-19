import {describe, expect, it} from "vitest";
import ImplicationEliminationChecker from "../error checkers/ImplicationEliminationChecker.ts";
import {parse} from "./testUtils.ts";

describe("Implication Elimination Checker", () => {
    const checker = new ImplicationEliminationChecker();

    describe("Reverse Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y))"),
                parse("∃x∀y(¬cat(y) ∨ loves(x, y))"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) → loves(x, y))"),
                parse("∃x∀y(cat(y) ∨ loves(x, y))"),
            ).isError()).toBe(true);
            //expect(checker.checkForError(
            //    parse("∃x∀y(cat(y) → loves(x, y))"),
            //    parse("∃x∀y(cat(y) ∨ loves(x, y))"),
            //).errors[0].message).toBe("cat(y) → loves(x, y) and cat(y)  ∨  loves(x, y) are not equivalent according to the Implication Elimination rule!");
        });
    });

    describe("Standard Direction", () => {
        it("Correct", () => {
            expect(checker.checkForError(
                parse("∃x∀y(¬cat(y) ∨ loves(x, y))"),
                parse("∃x∀y(cat(y) → loves(x, y))"),
            ).isEquivalent()).toBe(true);
        });
        it("Incorrect", () => {
            expect(checker.checkForError(
                parse("∃x∀y(cat(y) ∨ loves(x, y))"),
                parse("∃x∀y(cat(y) → loves(x, y))"),
            ).isError()).toBe(true);
            //expect(checker.checkForError(
            //    parse("∃x∀y(cat(y) → loves(x, y))"),
            //    parse("∃x∀y(cat(y) ∨ loves(x, y))"),
            //).errors[0].message).toBe("cat(y) → loves(x, y) and cat(y)  ∨  loves(x, y) are not equivalent according to the Implication Elimination rule!");
        });
    });

});