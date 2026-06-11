import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Disjunction, Implication, Negation} from "../model";

class ImplicationEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError((original as Implication).subLeft, ((transformed as Disjunction).subLeft as Negation).subFormula);
            if (result.isNotError()) result.combine(this.checkForError((original as Implication).subRight, (transformed as Disjunction).subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if ((this.checkRequisites(transformed, original))) {
            const result = this.checkForError(((original as Disjunction).subLeft as Negation).subFormula, (transformed as Implication).subLeft);
            if (result.isNotError()) result.combine(this.checkForError((original as Disjunction).subRight, (transformed as Implication).subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Implication Elimination rule!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return (original instanceof Implication &&
                transformed instanceof Disjunction &&
                transformed.subLeft instanceof Negation);
    }

}

export default ImplicationEliminationChecker;