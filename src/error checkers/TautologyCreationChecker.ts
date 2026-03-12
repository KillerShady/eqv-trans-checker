import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {Disjunction, Negation, AlwaysTrue, AlwaysFalse} from "../model";

class TautologyCreationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkNegatedFormulaRequisites(original, transformed) ||
            this.checkNegatedUnsatRequisites(original, transformed) ||
            this.checkORTautologyRequisites(original, transformed) ||
            this.checkNegatedFormulaRequisites(transformed, original) ||
            this.checkNegatedUnsatRequisites(transformed, original) ||
            this.checkORTautologyRequisites(transformed, original)) {
                return this.equivalentResult()
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Tautology Creation rule!"
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
    checkORTautologyRequisites(original: Expression, transformed: Expression): boolean {
        return transformed instanceof AlwaysTrue &&
               original instanceof Disjunction &&
               (original.subLeft instanceof AlwaysTrue ||
                original.subRight instanceof AlwaysTrue);
    }
    checkEquivalent(expression: Expression, other: Expression) {
        return this.checkForError(expression, other).isEquivalentOrIdentical();
    }

}

export default TautologyCreationChecker;