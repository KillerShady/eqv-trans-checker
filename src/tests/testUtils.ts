import {parseFormulaWithPrecedence} from "@fmfi-uk-1-ain-412/js-fol-parser";
import {
    /*AlwaysFalse,
    AlwaysTrue,
    Conjunction, Constant,
    Disjunction,
    EqualityAtom, Equivalence, ExistentialQuant,
    Expression,*/
    Formula, //FunctionTerm,
    getFactories, //Implication,
    Language, //Negation, PredicateAtom, UniversalQuant, Variable
} from "../model";
import type TransformationChecker from "../error_checkers/TransformationChecker.ts";
import {expect, it} from "vitest";
import SkolemizationChecker from "../error_checkers/SkolemizationChecker.ts";

const constants = new Set(["kitty", "sk1", "sk2", "sk3"]);
const predicates = new Map([["cat", 1], ["loves", 2]]);
const functions = new Map([["catty", 1], ["skf1", 1], ["skf2", 2], ["skf3", 3]]);
const skolemSymbols = {constants: ["sk1", "sk2", "sk3"],
                       functions: [{name: "skf1", arity: 1}, {name: "skf2", arity: 2}, {name: "skf3", arity: 3}]}

const language = new Language(constants, predicates, functions);

function parse(input: string): Formula {
    return parseFormulaWithPrecedence(
        input,
        language.getParserLanguage(),
        getFactories(language)
    );
}

export function testEquivalent(checker: TransformationChecker, original: string, transformed: string) {
    if (checker instanceof SkolemizationChecker) checker.reset(skolemSymbols);
    expect(checker.checkForError(parse(original), parse(transformed)).isEquivalent()).toBe(true);
}
export function testEquivalentTwoDirectional(checker: TransformationChecker, original: string, transformed: string) {
    const parsedOriginal = parse(original);
    const parsedTransformed = parse(transformed);

    // standard
    expect(checker.checkForError(parsedOriginal, parsedTransformed).isEquivalent()).toBe(true);
    // reversed
    expect(checker.checkForError(parsedTransformed, parsedOriginal).isEquivalent()).toBe(true);
}
export function testError(checker: TransformationChecker,
                          original: string, transformed: string,
                          errorMessage: string|undefined = undefined) {
    if (checker instanceof SkolemizationChecker) checker.reset(skolemSymbols);
    const result = checker.checkForError(parse(original), parse(transformed));
    expect(result.isError()).toBe(true);
    if (errorMessage !== undefined) {
        expect(result.errors[0].message).toBe(errorMessage);
    }
}
export function testErrorTwoDirectional(checker: TransformationChecker,
                                        original: string, transformed: string,
                                        errorMessage1: string|undefined = undefined,
                                        errorMessage2: string|undefined = undefined) {
    const parsedOriginal = parse(original);
    const parsedTransformed = parse(transformed);

    // standard
    let result = checker.checkForError(parsedOriginal, parsedTransformed);
    expect(result.isError()).toBe(true);
    if (errorMessage1 !== undefined) {
        expect(result.errors[0].message).toBe(errorMessage1);
    }
    // reversed
    result = checker.checkForError(parsedTransformed, parsedOriginal);
    expect(result.isError()).toBe(true);
    if (errorMessage2 !== undefined) {
        expect(result.errors[0].message).toBe(errorMessage2);
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

/*const varA = new Variable("A");
const consB = new Variable("B");
const varX = new Variable("X");
const consY = new Variable("Y");

const PredA = new PredicateAtom("predA", [varA, consB]);
const PredB = new PredicateAtom("predB", [consB, varA]);
const PredX = new PredicateAtom("predX", [varX, consY]);
const PredY = new PredicateAtom("predY", [consY, varX]);

export const expressions: Record<string, Expression> = {
    "AlwaysFalse": new AlwaysFalse(),
    "AlwaysTrue": new AlwaysTrue(),
    "Conjunction": new Conjunction(PredA, PredB),
    "Conjunction2": new Conjunction(PredX, PredB),
    "Conjunction3": new Conjunction(PredA, PredY),
    "Disjunction": new Disjunction(PredA, PredB),
    "Disjunction2": new Disjunction(PredX, PredY),
    "EqualityAtom": new EqualityAtom(PredA, PredB),
    "EqualityAtom2": new EqualityAtom(PredX, PredY),
    "Equivalence": new Equivalence(PredA, PredB),
    "Equivalence2": new Equivalence(PredX, PredY),
    "ExistentialQuantX": new ExistentialQuant("x", PredA),
    "ExistentialQuantX2": new ExistentialQuant("x", PredA),
    "ExistentialQuantY": new ExistentialQuant("y", PredX),
    "ExistentialQuantY2": new ExistentialQuant("y", PredX),
    "Implication": new Implication(PredA, PredB),
    "Implication2": new Implication(PredX, PredY),
    "Negation": new Negation(PredA),
    "Negation2": new Negation(PredA),
    "PredicateAtom": new PredicateAtom(""),
    "PredicateAtom2": new PredicateAtom(""),
    "UniversalQuant": new UniversalQuant(),
    "UniversalQuant2": new UniversalQuant(),
    "Constant": new Constant("Constant"),
    "Constant2": new Constant("Constant2"),
    "FunctionTerm": new FunctionTerm(""),
    "FunctionTerm2": new FunctionTerm(""),
    "Variable": new Variable("Variable"),
    "Variable2": new Variable("Variable2"),
}*/

/*const connectives = ["∧", "∨", "→", "↔︎"];

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
}*/