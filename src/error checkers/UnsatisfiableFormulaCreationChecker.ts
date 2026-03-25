import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {Negation, AlwaysFalse, Conjunction, AlwaysTrue} from "../model";

class UnsatisfiableFormulaCreationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkNegatedFormulaRequisites(original, transformed) ||
            this.checkNegatedTautologyRequisites(original, transformed) ||
            this.checkNegatedFormulaRequisites(transformed, original) ||
            this.checkNegatedTautologyRequisites(transformed, original)) {
            return this.equivalentResult()
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Tautology Creation rule!"
        );
    }

    checkNegatedFormulaRequisites(original: Expression, transformed: Expression): boolean {
        return original instanceof Conjunction &&
               transformed instanceof AlwaysFalse &&
               ((original.subLeft instanceof Negation &&
                 this.checkEquivalent(original.subLeft.subFormula, original.subRight)) ||
                (original.subRight instanceof Negation &&
                 this.checkEquivalent(original.subRight.subFormula, original.subLeft)));
    }
    checkNegatedTautologyRequisites(original: Expression, transformed: Expression): boolean {
        return original instanceof Negation &&
               original.subFormula instanceof AlwaysTrue &&
               transformed instanceof AlwaysFalse;
    }
    checkEquivalent(expression: Expression, other: Expression) {
        return this.checkForError(expression, other).isEquivalentOrIdentical();
    }

}

export default UnsatisfiableFormulaCreationChecker;