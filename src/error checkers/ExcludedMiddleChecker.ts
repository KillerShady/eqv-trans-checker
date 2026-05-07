import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {Disjunction, Negation, AlwaysTrue, AlwaysFalse} from "../model";

class ExcludedMiddleChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkNegatedFormulaRequisites(original, transformed) ||
            this.checkNegatedUnsatRequisites(original, transformed) ||
            this.checkNegatedFormulaRequisites(transformed, original) ||
            this.checkNegatedUnsatRequisites(transformed, original)) {
                return this.equivalentResult()
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Excluded Middle rule!"
        );
    }

    checkNegatedFormulaRequisites(original: Expression, transformed: Expression): boolean {
        return original instanceof Disjunction &&
               transformed instanceof AlwaysTrue &&
               ((original.subLeft instanceof Negation &&
                 this.checkEquivalent(original.subLeft.subFormula, original.subRight)) ||
                (original.subRight instanceof Negation &&
                 this.checkEquivalent(original.subRight.subFormula, original.subLeft)));
    }
    checkNegatedUnsatRequisites(original: Expression, transformed: Expression): boolean {
        return original instanceof Negation &&
               original.subFormula instanceof AlwaysFalse &&
               transformed instanceof AlwaysTrue;
    }
    checkEquivalent(expression: Expression, other: Expression) {
        return this.checkForError(expression, other).isEquivalentOrIdentical();
    }

}

export default ExcludedMiddleChecker;