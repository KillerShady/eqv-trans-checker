import {
    Conjunction,
    Constant, Disjunction, EqualityAtom, Equivalence,
    ExistentialQuant,
    Expression,
    FunctionTerm, Implication, Negation,
    PredicateAtom, QuantifiedFormula,
    UniversalQuant, Variable
} from "../model";

export class TransformationCheckerResult {
    public errors: Error[];
    anyEquivalent: boolean;
    allErrors: boolean;

    constructor(errors: Error[], anyEquivalent: boolean, allErrors: boolean) {
        this.errors = errors;
        this.anyEquivalent = anyEquivalent;
        this.allErrors = allErrors;
    }

    public isIdentical(): boolean {
        return this.isNotError() && !this.anyEquivalent;
    }
    public isEquivalent(): boolean {
        return this.isNotError() && this.anyEquivalent;
    }
    public isEquivalentOrIdentical(): boolean {
        return this.isIdentical() || this.isEquivalent();
    }
    public isError(): boolean {
        return this.errors.length > 0;
    }
    public isNotError(): boolean {
        return !this.isError();
    }
    public isAllError(): boolean {
        return this.allErrors;
    }

    public combine(other: TransformationCheckerResult): void {
        this.errors = this.errors.concat(other.errors);
        this.anyEquivalent = this.anyEquivalent || other.anyEquivalent;
        this.allErrors = this.allErrors && other.allErrors;
    }

}

abstract class TransformationChecker {
    public checkForError(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkSameFunctor(original, transformed)) {
            const childrenResults = this.checkChildren(original, transformed);
            if (childrenResults.isEquivalentOrIdentical()) return childrenResults;
            return this.checkTransformationApplied(original, transformed, childrenResults);
        }
        return this.checkTransformationApplied(original, transformed, undefined);
    }

    protected checkSameFunctor(original: Expression, transformed: Expression): boolean {
        if (original.constructor !== transformed.constructor) {
            return false;
        }
        if (original instanceof ExistentialQuant && transformed instanceof ExistentialQuant) {
            if (original.variableName !== transformed.variableName) return false;
        } else if (original instanceof PredicateAtom && transformed instanceof PredicateAtom) {
            if (original.name !== transformed.name ||
                original.terms.length !== transformed.terms.length) return false;
        } else if (original instanceof UniversalQuant && transformed instanceof UniversalQuant) {
            if (original.variableName !== transformed.variableName) return false;
        } else if (original instanceof Constant && transformed instanceof Constant) {
            if (original.name !== transformed.name) return false;
        } else if (original instanceof FunctionTerm && transformed instanceof FunctionTerm) {
            if (original.name !== transformed.name ||
                original.terms.length !== transformed.terms.length) return false;
        } else if (original instanceof Variable && transformed instanceof Variable) {
            if (original.name !== transformed.name) return false;
        }
        return true;
    }

    protected checkChildren(original: Expression, transformed: Expression): TransformationCheckerResult {
        if ((original instanceof Conjunction && transformed instanceof Conjunction) ||
            (original instanceof Disjunction && transformed instanceof Disjunction) ||
            (original instanceof EqualityAtom && transformed instanceof EqualityAtom) ||
            (original instanceof Equivalence && transformed instanceof Equivalence) ||
            (original instanceof Implication && transformed instanceof Implication)) {
            const result = this.checkForError(original.subLeft, transformed.subLeft);
            result.combine(this.checkForError(original.subRight, transformed.subRight));
            return result;
        } else if ((original instanceof ExistentialQuant && transformed instanceof ExistentialQuant) ||
                   (original instanceof Negation && transformed instanceof Negation) ||
                   (original instanceof UniversalQuant && transformed instanceof UniversalQuant)) {
            return this.checkForError(original.subFormula, transformed.subFormula);
        } else if ((original instanceof PredicateAtom && transformed instanceof PredicateAtom) ||
                   (original instanceof FunctionTerm && transformed instanceof FunctionTerm)) {
            if (original.terms.length === 0) return this.identicalResult();
            const result = this.checkForError(original.terms[0], transformed.terms[0])
            for (let i = 1; i < original.terms.length; i++) {
                result.combine(this.checkForError(original.terms[i], transformed.terms[i]));
            }
            return result;
        }

        return this.identicalResult();
    }

    public identicalResult() {
        return new TransformationCheckerResult([], false, false);
    }
    public equivalentResult() {
        return new TransformationCheckerResult([], true, false);
    }
    public errorResult(message: string) {
        return new TransformationCheckerResult([new Error(message)], false, true);
    }

    protected hasOneChild(expression: Expression): boolean {
        return (expression instanceof Negation || expression instanceof QuantifiedFormula)
    }

    abstract checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult;
}

export default TransformationChecker;