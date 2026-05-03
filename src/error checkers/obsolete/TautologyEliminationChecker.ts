import TransformationChecker, {TransformationCheckerResult} from "../TransformationChecker.ts";
import type Expression from "../../model/Expression.ts";
import {AlwaysTrue, Conjunction} from "../../model";

class TautologyEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = original.subLeft instanceof AlwaysTrue ?
                this.checkForError(original.subRight, transformed) :
                this.checkForError(original.subLeft, transformed);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = transformed.subLeft instanceof AlwaysTrue ?
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

    checkRequisites(original: Expression, _transformed: Expression): boolean {
        return (original instanceof Conjunction &&
            (original.subLeft instanceof AlwaysTrue ||
             original.subRight instanceof AlwaysTrue));
    }

}

export default TautologyEliminationChecker;