import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {
    Constant,
    ExistentialQuant,
    FunctionTerm,
    Negation,
    PredicateAtom,
    QuantifiedFormula, Term,
    Variable
} from "../model";
import type { SymbolWithArity } from "../js-fol-parser";

interface skolemizedPattern {
    name: string,
    subterms: string[]
}

class SkolemizationChecker extends TransformationChecker {
    universalQuants: string[] = [];
    changedVars: Map<string, skolemizedPattern> = new Map<string, skolemizedPattern>();
    public allowedSkolemSymbols: {constants: string[], functions: SymbolWithArity[]} = {constants: [], functions: []}
    usedSymbols: Set<string> = new Set<string>();

    public checkForError(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (original instanceof Negation && this.isNotNNF(original)) {
            return this.errorResult(
                "Original formula is not in NNF!"
            );
        }
        if (this.checkSameFunctor(original, transformed) &&
            ! (original instanceof Variable) &&
            ! (original instanceof QuantifiedFormula)) {
            return this.checkChildren(original, transformed);
        }
        return this.checkTransformationApplied(original, transformed);
    }

    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (original instanceof QuantifiedFormula) {
            return this.handleQuant(original, transformed);
        }
        if (original instanceof Variable) {
            if (this.changedVars.has(original.name)) {
                // @ts-expect-error honestly i dont know why es-lint flags this
                return this.checkCorrectlySkolemized(this.changedVars.get(original.name), transformed);
            }
            if (this.checkSameFunctor(original, transformed)) {
                return this.identicalResult();
            }
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equisatisfiable nor identical according to the Skolemization rule!"
        );
    }

    isNotNNF(original: Negation) {
        return ! (original.subFormula instanceof PredicateAtom)
    }

    handleQuant(original: QuantifiedFormula, transformed: Expression) {
        if (original instanceof ExistentialQuant) {
            if (this.checkSameFunctor(original, transformed)) {
                // @ts-expect-error instance has been checked in if statement
                return this.checkForError(original.subFormula, transformed.subFormula);
            }
            this.changedVars.set(original.variableName, {name: "",
                subterms: Object.assign([], this.universalQuants)}
            );
            const result = this.checkForError(original.subFormula, transformed);
            this.changedVars.delete(original.variableName);
            return result;
        }
        if (this.checkSameFunctor(original, transformed)) {
            this.universalQuants.push(original.variableName);
            // @ts-expect-error instance has been checked in if statement
            const result = this.checkForError(original.subFormula, transformed.subFormula);
            this.universalQuants.pop();
            return result;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equisatisfiable nor identical according to the Skolemization rule!"
        );
    }

    checkCorrectlySkolemized(pattern: skolemizedPattern, transformed: Expression) {
        if (pattern.subterms.length === 0) {
            if (! (transformed instanceof Constant)) {
                return this.errorResult(
                    "Expected skolem constant but found " + transformed.toString() + " instead!"
                );
            }
            if (pattern.name === "") {
                if (this.usedSymbols.has(transformed.name)) {
                    return this.errorResult(
                        "Skolem constant " + transformed.name + " was used to replace a different variable!"
                    );
                }
                const index = this.allowedSkolemSymbols.constants.indexOf(transformed.name);
                if (index >= 0) {
                    pattern.name = transformed.name;
                    this.allowedSkolemSymbols.constants.splice(index, 1);
                    this.usedSymbols.add(transformed.name);
                }
            }
            if (pattern.name !== transformed.name) {
                return this.errorResult(
                    "Expected skolem constant " + pattern.name + " but found " + transformed.toString() + " instead!"
                );
            }
        } else {
            if (! (transformed instanceof FunctionTerm)) {
                return this.errorResult(
                    "Expected skolem function but found " + transformed.toString() + " instead!"
                );
            }
            if (pattern.name === "") {
                if (this.usedSymbols.has(transformed.name)) {
                    return this.errorResult(
                        "Skolem function " + transformed.name + " was used to replace a different variable!"
                    );
                }
                for (let i = 0; i < this.allowedSkolemSymbols.functions.length; i++) {
                    if (this.allowedSkolemSymbols.functions[i].name === transformed.name &&
                        this.allowedSkolemSymbols.functions[i].arity === transformed.terms.length) {
                        pattern.name = transformed.name;
                        pattern.subterms = this.orderSubterms(pattern.subterms, transformed);
                        this.allowedSkolemSymbols.functions.splice(i, 1);
                        this.usedSymbols.add(transformed.name);
                        break;
                    }
                }
            }
            return this.checkSkolemizedSubterms(pattern, transformed);
        }

        return this.equivalentResult();
    }

    checkSkolemizedSubterms(pattern: skolemizedPattern, transformed: FunctionTerm) {
        if (pattern.name !== transformed.name) {
            return this.errorResult(
                "Expected skolem function " + pattern.name + " but found " + transformed.name + " instead!"
            );
        }
        if (pattern.subterms.length !== transformed.terms.length) {
            return this.errorResult(
                "Expected skolem function to have arity of " + pattern.subterms.length + " but found arity of " + transformed.terms.length + " instead!"
            );
        }
        for (let i = 0; i < pattern.subterms.length; i++) {
            if (! (transformed.terms[i] instanceof Variable) ||
                // @ts-expect-error all terms have .name
                transformed.terms[i].name !== pattern.subterms[i]) {
                const patternString = pattern.name + "(" + pattern.subterms.join(", ")+")";
                return this.errorResult(
                    "Expected " + patternString + " but found " + transformed.toString() + " instead!"
                );
            }
        }
        return this.equivalentResult();
    }

    orderSubterms(subterms: string[], transformed: FunctionTerm) {
        if (subterms.length !== transformed.terms.length) {
            return subterms;
        }
        const termNames = this.getNamesOfTerms(transformed.terms);
        if (this.isPermutation(subterms, termNames)) {
            return termNames;
        }
        return subterms;
    }

    getNamesOfTerms(terms: Term[]) {
        const result: string[] = []
        for (const term of terms) {
            // @ts-expect-error all terms have .name
            result.push(term.name);
        }
        return result;
    }

    isPermutation(patternSubterms: string[], terms: string[]) {
        return (patternSubterms.sort().join(',')=== terms.sort().join(','));
    }

    reset(skolemSymbols: {constants: string[], functions: SymbolWithArity[]}) {
        this.allowedSkolemSymbols = {constants: Object.assign([], skolemSymbols.constants), functions: []};
        skolemSymbols.functions.forEach(val => this.allowedSkolemSymbols.functions.push(Object.assign({}, val)));
        this.usedSymbols = new Set<string>();
    }
}

export default SkolemizationChecker;