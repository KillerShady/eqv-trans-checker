import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {ExistentialQuant, Negation, UniversalQuant} from "../model";

class DeMorganQuantifierChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError(original.subFormula.subFormula, transformed.subFormula.subFormula);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = this.checkForError(transformed.subFormula.subFormula, original.subFormula.subFormula);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the De Morgan rule for Quantifiers!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return ((original instanceof Negation &&
                 original.subFormula instanceof UniversalQuant &&
                 transformed instanceof ExistentialQuant &&
                 transformed.subFormula instanceof Negation &&
                 original.subFormula.variableName === transformed.variableName) ||
                (original instanceof Negation &&
                 original.subFormula instanceof ExistentialQuant &&
                 transformed instanceof UniversalQuant &&
                 transformed.subFormula instanceof Negation &&
                 original.subFormula.variableName === transformed.variableName));
    }

}

export default DeMorganQuantifierChecker;