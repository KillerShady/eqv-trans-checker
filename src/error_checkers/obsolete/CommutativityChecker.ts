/*import type Expression from "../../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "../TransformationChecker.ts";
import {Conjunction, Disjunction} from "../../model";

class CommutativityChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            // @ts-expect-error instance has been checked in if statement
            const result = this.checkForError(original.subLeft, transformed.subRight);
            // @ts-expect-error instance has been checked in if statement
            if (result.isNotError()) result.combine(this.checkForError(original.subRight, transformed.subLeft));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            // @ts-expect-error instance has been checked in if statement
            const result = this.checkForError(original.subRight, transformed.subLeft);
            // @ts-expect-error instance has been checked in if statement
            if (result.isNotError()) result.combine(this.checkForError(original.subLeft, transformed.subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Commutativity rule!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return ((original instanceof Disjunction &&
                 transformed instanceof Disjunction) ||
                (original instanceof Conjunction &&
                 transformed instanceof Conjunction));
    }

}

export default CommutativityChecker;*/