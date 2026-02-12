import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Disjunction} from "../model";

class CommutativityChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError(original.subLeft, transformed.subRight);
            if (result.isNotError()) result.combine(this.checkForError(original.subRight, transformed.subLeft));
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = this.checkForError(transformed.subLeft, original.subRight);
            if (result.isNotError()) result.combine(this.checkForError(transformed.subRight, original.subLeft));
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Commutativity rule!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return ((original instanceof Disjunction &&
                 transformed instanceof Disjunction) ||
                (original instanceof Conjunction &&
                 transformed instanceof Conjunction));
    }

}

export default CommutativityChecker;