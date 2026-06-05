import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Disjunction, ExistentialQuant, UniversalQuant} from "../model";

class DistributivityQuantifierChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError(((original as UniversalQuant).subFormula as Conjunction).subLeft, ((transformed as Conjunction).subLeft as UniversalQuant).subFormula);
            if (result.isNotError()) result.combine(this.checkForError(((original as UniversalQuant).subFormula as Conjunction).subRight, ((transformed as Conjunction).subRight as UniversalQuant).subFormula));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = this.checkForError(((original as Conjunction).subLeft as UniversalQuant).subFormula, ((transformed as UniversalQuant).subFormula as Conjunction).subLeft);
            if (result.isNotError()) result.combine(this.checkForError(((original as Conjunction).subRight as UniversalQuant).subFormula, ((transformed as UniversalQuant).subFormula as Conjunction).subRight));
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Distributivity of Quantifiers rule!"
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