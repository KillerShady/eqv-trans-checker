import TransformationChecker, {TransformationCheckerResult} from "../TransformationChecker.ts";
import type Expression from "../../model/Expression.ts";
import {AlwaysFalse, Disjunction} from "../../model";

class UnsatisfiableFormulaEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            // @ts-expect-error instance has been checked in if statement
            const result = original.subLeft instanceof AlwaysFalse ?
                // @ts-expect-error instance has been checked in if statement
                this.checkForError(original.subRight, transformed) :
                // @ts-expect-error instance has been checked in if statement
                this.checkForError(original.subLeft, transformed);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            // @ts-expect-error instance has been checked in if statement
            const result = transformed.subLeft instanceof AlwaysFalse ?
                // @ts-expect-error instance has been checked in if statement
                this.checkForError(original, transformed.subRight) :
                // @ts-expect-error instance has been checked in if statement
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

    checkRequisites(original: Expression, _transformed: Expression): boolean {
        return (original instanceof Disjunction &&
                (original.subLeft instanceof AlwaysFalse ||
                 original.subRight instanceof AlwaysFalse));
    }

}

export default UnsatisfiableFormulaEliminationChecker;