import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {Formula, Negation, AlwaysFalse, Conjunction} from "../model";

class UnsatisfiableFormulaCreationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            if (original.subLeft instanceof Negation) {
                return this.formulasEqual(original.subLeft.subFormula, original.subRight);
            }
            return this.formulasEqual(original.subLeft, original.subRight.subFormula);
        } else if (this.checkRequisites(transformed, original)) {
            if (original.subLeft instanceof Negation) {
                return this.formulasEqual(transformed.subLeft.subFormula, transformed.subRight);
            }
            return this.formulasEqual(transformed.subLeft, transformed.subRight.subFormula);
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Unsatisfiable Formula Creation rule!"
        );
    }

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return (original instanceof Conjunction &&
                (original.subRight instanceof Negation ||
                    original.subLeft instanceof Negation) &&
                transformed instanceof AlwaysFalse)
    }

    formulasEqual(left: Formula, right: Formula): TransformationCheckerResult {
        if (left.equals(right)) {
            return this.equivalentResult()
        }
        return this.errorResult(
            "Cannot apply Unsatisfiable Formula Creation rule, because " + left + " and " + right + " are not identical!"
        );
    }

}

export default UnsatisfiableFormulaCreationChecker;