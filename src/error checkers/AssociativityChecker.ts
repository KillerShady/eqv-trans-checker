import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Disjunction} from "../model";

class AssociativityChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError(original.subLeft, transformed.subLeft.subLeft);
            if (result.isNotError()) result.combine(this.checkForError(original.subRight.subLeft, transformed.subLeft.subRight));
            if (result.isNotError()) result.combine(this.checkForError(original.subRight.subRight, transformed.subRight));
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = this.checkForError(transformed.subLeft, original.subLeft.subLeft);
            if (result.isNotError()) result.combine(this.checkForError(transformed.subRight.subLeft, original.subLeft.subRight));
            if (result.isNotError()) result.combine(this.checkForError(transformed.subRight.subRight, original.subRight));
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Association rule!"
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

export default AssociativityChecker;