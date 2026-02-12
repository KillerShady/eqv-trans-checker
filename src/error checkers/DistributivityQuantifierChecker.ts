import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Disjunction, ExistentialQuant, UniversalQuant} from "../model";

class DistributivityQuantifierChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError(original.subFormula.subLeft, transformed.subLeft.subFormula)
            if (result.isNotError()) result.combine(this.checkForError(original.subFormula.subRight, transformed.subRight.subFormula));
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = this.checkForError(transformed.subFormula.subLeft, original.subLeft.subFormula)
            if (result.isNotError()) result.combine(this.checkForError(transformed.subFormula.subRight, original.subRight.subFormula));
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Distributivity of Quantifiers rule!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return ((original instanceof UniversalQuant &&
                 original.subFormula instanceof Conjunction &&
                 transformed instanceof Conjunction &&
                 transformed.subLeft instanceof UniversalQuant &&
                 transformed.subRight instanceof UniversalQuant &&
                 original.variableName === transformed.subLeft.variableName &&
                 original.variableName === transformed.subRight.variableName) ||
                (original instanceof ExistentialQuant &&
                 original.subFormula instanceof Disjunction &&
                 transformed instanceof Disjunction &&
                 transformed.subLeft instanceof ExistentialQuant &&
                 transformed.subRight instanceof ExistentialQuant &&
                 original.variableName === transformed.subLeft.variableName &&
                 original.variableName === transformed.subRight.variableName));
    }

}

export default DistributivityQuantifierChecker;