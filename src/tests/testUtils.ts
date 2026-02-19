import {parseFormulaWithPrecedence} from "@fmfi-uk-1-ain-412/js-fol-parser";
import {Formula, getFactories, Language} from "../model";

const constants = new Set(["kitty"]);
const predicates = new Map([["cat", 1], ["loves", 2]]);
const functions = new Map([["catty", 1]]);
const language = new Language(constants, predicates, functions);

export function parse(input: string): Formula {
    return parseFormulaWithPrecedence(
        input,
        language.getParserLanguage(),
        getFactories(language)
    );
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