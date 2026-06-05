/*import type Expression from "../../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "../TransformationChecker.ts";
import {Conjunction, Disjunction} from "../../model";

class AssociativityChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            // @ts-expect-error instance has been checked in if statement
            const result = this.checkForError(original.subLeft, transformed.subLeft.subLeft);
            // @ts-expect-error instance has been checked in if statement
            if (result.isNotError()) result.combine(this.checkForError(original.subRight.subLeft, transformed.subLeft.subRight));
            // @ts-expect-error instance has been checked in if statement
            if (result.isNotError()) result.combine(this.checkForError(original.subRight.subRight, transformed.subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            // @ts-expect-error instance has been checked in if statement
            const result = this.checkForError(original.subLeft.subLeft, transformed.subLeft);
            // @ts-expect-error instance has been checked in if statement
            if (result.isNotError()) result.combine(this.checkForError(original.subLeft.subRight, transformed.subRight.subLeft));
            // @ts-expect-error instance has been checked in if statement
            if (result.isNotError()) result.combine(this.checkForError(original.subRight, transformed.subRight.subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Associativity rule!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return ((original instanceof Disjunction &&
                 original.subRight instanceof Disjunction &&
                 transformed instanceof Disjunction &&
                 transformed.subLeft instanceof Disjunction) ||
                (original instanceof Conjunction &&
                 original.subRight instanceof Conjunction &&
                 transformed instanceof Conjunction &&
                 transformed.subLeft instanceof Conjunction));
    }

}

export default AssociativityChecker;*/