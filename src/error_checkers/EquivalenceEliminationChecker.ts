import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Equivalence, Implication} from "../model";

class EquivalenceEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError(original.subLeft, transformed.subLeft.subLeft);
            result.combine(this.checkForError(original.subLeft, transformed.subRight.subRight));
            result.combine(this.checkForError(original.subRight, transformed.subLeft.subRight));
            result.combine(this.checkForError(original.subRight, transformed.subRight.subLeft));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();

            const reversedResult = this.checkForError(original.subLeft, transformed.subLeft.subRight);
            reversedResult.combine(this.checkForError(original.subLeft, transformed.subRight.subLeft));
            reversedResult.combine(this.checkForError(original.subRight, transformed.subLeft.subLeft));
            reversedResult.combine(this.checkForError(original.subRight, transformed.subRight.subRight));
            if (reversedResult.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();

            return result.errors.length < reversedResult.errors.length ? result : reversedResult;
        } else if ((this.checkRequisites(transformed, original))) {
            const result = this.checkForError(original.subLeft.subLeft, transformed.subLeft);
            result.combine(this.checkForError(original.subRight.subRight, transformed.subLeft));
            result.combine(this.checkForError(original.subLeft.subRight, transformed.subRight));
            result.combine(this.checkForError(original.subRight.subLeft, transformed.subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();

            const reversedResult = this.checkForError(original.subLeft.subRight, transformed.subLeft);
            reversedResult.combine(this.checkForError(original.subRight.subLeft, transformed.subLeft));
            reversedResult.combine(this.checkForError(original.subLeft.subLeft, transformed.subRight));
            reversedResult.combine(this.checkForError(original.subRight.subRight, transformed.subRight));
            if (reversedResult.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();

            return result.errors.length < reversedResult.errors.length ? result : reversedResult;
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Equivalence Elimination rule!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return (original instanceof Equivalence &&
                transformed instanceof Conjunction &&
                transformed.subLeft instanceof Implication &&
                transformed.subRight instanceof Implication);
    }

}

export default EquivalenceEliminationChecker;