import TransformationChecker, {TransformationCheckerResult} from "../TransformationChecker.ts";
import type Expression from "../../model/Expression.ts";
import {AlwaysTrue, Conjunction} from "../../model";

class TautologyEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            // @ts-expect-error instance has been checked in if statement
            const result = original.subLeft instanceof AlwaysTrue ?
                // @ts-expect-error instance has been checked in if statement
                this.checkForError(original.subRight, transformed) :
                // @ts-expect-error instance has been checked in if statement
                this.checkForError(original.subLeft, transformed);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            // @ts-expect-error instance has been checked in if statement
            const result = transformed.subLeft instanceof AlwaysTrue ?
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    checkRequisites(original: Expression, _transformed: Expression): boolean {
        return (original instanceof Conjunction &&
            (original.subLeft instanceof AlwaysTrue ||
             original.subRight instanceof AlwaysTrue));
    }

}

export default TautologyEliminationChecker;