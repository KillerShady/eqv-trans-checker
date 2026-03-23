import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Negation} from "../model";


class DoubleNegationEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = this.checkForError(original.subFormula.subFormula, transformed);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = this.checkForError(original, transformed.subFormula.subFormula);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Double Negation Elimination rule!"
        );
    }

    checkRequisites(original: Expression, _transformed: Expression): boolean {
        return (original instanceof Negation &&
                original.subFormula instanceof Negation);
    }

}

export default DoubleNegationEliminationChecker;