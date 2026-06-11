import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Disjunction} from "../model";

class DistributivityChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError((original as Disjunction).subLeft, ((transformed as Conjunction).subLeft as Disjunction).subLeft);
            if (result.isNotError()) result.combine(this.checkForError((original as Disjunction).subLeft, ((transformed as Conjunction).subRight as Disjunction).subLeft));
            if (result.isNotError()) result.combine(this.checkForError(((original as Disjunction).subRight as Conjunction).subLeft, ((transformed as Conjunction).subLeft as Disjunction).subRight));
            if (result.isNotError()) result.combine(this.checkForError(((original as Disjunction).subRight as Conjunction).subRight, ((transformed as Conjunction).subRight as Disjunction).subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = this.checkForError(((original as Conjunction).subLeft as Disjunction).subLeft, (transformed as Disjunction).subLeft);
            if (result.isNotError()) result.combine(this.checkForError(((original as Conjunction).subRight as Disjunction).subLeft, (transformed as Disjunction).subLeft));
            if (result.isNotError()) result.combine(this.checkForError(((original as Conjunction).subLeft as Disjunction).subRight, ((transformed as Disjunction).subRight as Conjunction).subLeft));
            if (result.isNotError()) result.combine(this.checkForError(((original as Conjunction).subRight as Disjunction).subRight, ((transformed as Disjunction).subRight as Conjunction).subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Distributivity rule!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return ((original instanceof Disjunction &&
                 original.subRight instanceof Conjunction &&
                 transformed instanceof Conjunction &&
                 transformed.subLeft instanceof Disjunction &&
                 transformed.subRight instanceof Disjunction) ||
                (original instanceof Conjunction &&
                 original.subRight instanceof Disjunction &&
                 transformed instanceof Disjunction &&
                 transformed.subLeft instanceof Conjunction &&
                 transformed.subRight instanceof Conjunction));
    }

}

export default DistributivityChecker;