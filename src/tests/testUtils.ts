import {parseFormulaWithPrecedence} from "@fmfi-uk-1-ain-412/js-fol-parser";
import {Formula, getFactories, Language} from "../model";
import type TransformationChecker from "../error checkers/TransformationChecker.ts";
import {expect, it} from "vitest";

const constants = new Set(["kitty"]);
const predicates = new Map([["cat", 1], ["loves", 2]]);
const functions = new Map([["catty", 1]]);
const language = new Language(constants, predicates, functions);

function parse(input: string): Formula {
    return parseFormulaWithPrecedence(
        input,
        language.getParserLanguage(),
        getFactories(language)
    );
}

export function testEquivalent(checker: TransformationChecker, original: string, transformed: string) {
    expect(checker.checkForError(parse(original), parse(transformed)).isEquivalent()).toBe(true);
}
export function testError(checker: TransformationChecker, original: string, transformed: string, errorMessage: string|undefined = undefined) {
    const parsedOriginal = parse(original);
    const parsedTransformed = parse(transformed);

    expect(checker.checkForError(parsedOriginal, parsedTransformed).isError()).toBe(true);
    if (errorMessage) {
        expect(checker.checkForError(parsedOriginal, parsedTransformed).errors[0].message).toBe(errorMessage);
    }
}
export function testIdentical(checker: TransformationChecker) {
    it("Identical formulas", () => {
        expect(checker.checkForError(
            parse("cat(x)"),
            parse("cat(x)")
        ).isIdentical()).toBe(true);
        expect(checker.checkForError(
            parse("loves(x, catty(kitty)) ∧ cat(kitty)"),
            parse("loves(x, catty(kitty)) ∧ cat(kitty)")
        ).isIdentical()).toBe(true);
        expect(checker.checkForError(
            parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))"),
            parse("∃x∀y(cat(y) → loves(x, y)) ∧ ∀x((cat(x)∨loves(x, kitty)) → loves(kitty, x))")
        ).isIdentical()).toBe(true);
    });
}

const connectives = ["∧", "∨", "→", "↔︎"];

export function generateFormula(depth: number, incorrect = false): {original: string, transformed: string} {
    if (depth <= 0) {
        if (incorrect)
            return {
                original: "cat(x)",
                transformed: "loves(x, y)"
            }
        return {
            original: "cat(x)",
            transformed: "cat(x)"
        };
    }

    const left = generateFormula(depth - 1);
    const right = generateFormula(depth - 1, incorrect);
    const connective = connectives[Math.floor(Math.random() * connectives.length)];

    return {
        original: "(" + left.original + connective + right.original + ")",
        transformed: "(" + left.transformed + connective + right.transformed + ")"
    };
}