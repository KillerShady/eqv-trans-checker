import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {AlwaysFalse, AlwaysTrue, Conjunction, Disjunction} from "../model";

class IdentityChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkConjunction(original)) {
            const result = original.subLeft instanceof AlwaysTrue ?
                this.checkForError(original.subRight, transformed) :
                this.checkForError(original.subLeft, transformed);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkConjunction(transformed)) {
            const result = transformed.subLeft instanceof AlwaysTrue ?
                this.checkForError(original, transformed.subRight) :
                this.checkForError(original, transformed.subLeft);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkDisjunction(original)) {
            const result = original.subLeft instanceof AlwaysFalse ?
                this.checkForError(original.subRight, transformed) :
                this.checkForError(original.subLeft, transformed);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkDisjunction(transformed)) {
            const result = transformed.subLeft instanceof AlwaysFalse ?
                this.checkForError(original, transformed.subRight) :
                this.checkForError(original, transformed.subLeft);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Tautology Creation rule!"
        );
    }

    checkConjunction(formula: Expression) {
        return (formula instanceof Conjunction &&
                (formula.subLeft instanceof AlwaysTrue ||
                 formula.subRight instanceof AlwaysTrue)
        );
    }

    checkDisjunction(formula: Expression) {
        return (formula instanceof Disjunction &&
                (formula.subLeft instanceof AlwaysFalse ||
                 formula.subRight instanceof AlwaysFalse)
        );
    }

}

export default IdentityChecker;