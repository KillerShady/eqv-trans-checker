import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Equivalence, Implication} from "../model";

class EquivalenceEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError((original as Equivalence).subLeft, ((transformed as Conjunction).subLeft as Implication).subLeft);
            result.combine(this.checkForError((original as Equivalence).subLeft, ((transformed as Conjunction).subRight as Implication).subRight));
            result.combine(this.checkForError((original as Equivalence).subRight, ((transformed as Conjunction).subLeft as Implication).subRight));
            result.combine(this.checkForError((original as Equivalence).subRight, ((transformed as Conjunction).subRight as Implication).subLeft));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();

            const reversedResult = this.checkForError((original as Equivalence).subLeft, ((transformed as Conjunction).subLeft as Implication).subRight);
            reversedResult.combine(this.checkForError((original as Equivalence).subLeft, ((transformed as Conjunction).subRight as Implication).subLeft));
            reversedResult.combine(this.checkForError((original as Equivalence).subRight, ((transformed as Conjunction).subLeft as Implication).subLeft));
            reversedResult.combine(this.checkForError((original as Equivalence).subRight, ((transformed as Conjunction).subRight as Implication).subRight));
            if (reversedResult.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();

            return result.errors.length < reversedResult.errors.length ? result : reversedResult;
        } else if ((this.checkRequisites(transformed, original))) {
            const result = this.checkForError(((original as Conjunction).subLeft as Implication).subLeft, (transformed as Implication).subLeft);
            result.combine(this.checkForError(((original as Conjunction).subRight as Implication).subRight, (transformed as Implication).subLeft));
            result.combine(this.checkForError(((original as Conjunction).subLeft as Implication).subRight, (transformed as Implication).subRight));
            result.combine(this.checkForError(((original as Conjunction).subRight as Implication).subLeft, (transformed as Implication).subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();

            const reversedResult = this.checkForError(((original as Conjunction).subLeft as Implication).subRight, (transformed as Implication).subLeft);
            reversedResult.combine(this.checkForError(((original as Conjunction).subRight as Implication).subLeft, (transformed as Implication).subLeft));
            reversedResult.combine(this.checkForError(((original as Conjunction).subLeft as Implication).subLeft, (transformed as Implication).subRight));
            reversedResult.combine(this.checkForError(((original as Conjunction).subRight as Implication).subRight, (transformed as Implication).subRight));
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