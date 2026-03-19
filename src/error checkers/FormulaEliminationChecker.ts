import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Disjunction} from "../model";

class FormulaEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if ((original instanceof Conjunction && this.checkConjunction(original, transformed)) ||
            (original instanceof Disjunction && this.checkDisjunction(original, transformed)) ||
            (transformed instanceof Conjunction && this.checkConjunction(transformed, original)) ||
            (transformed instanceof Disjunction && this.checkDisjunction(transformed, original))
        ) {
            return this.equivalentResult();
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Association rule!"
        );
    }

    checkConjunction(conjunction: Conjunction, other: Expression) {
        if (other instanceof AlwaysFalse) {
            return (conjunction.subRight instanceof AlwaysFalse || conjunction.subLeft instanceof AlwaysFalse);
        }
        if (this.checkEquivalent(conjunction.subLeft, other)) {
            if (this.checkEquivalent(conjunction.subRight, other)) {
                return true;
            }
            return conjunction.subRight instanceof Disjunction &&
                   (this.checkEquivalent(conjunction.subRight.subLeft, other) ||
                    this.checkEquivalent(conjunction.subRight.subRight, other));
        }
        return conjunction.subLeft instanceof Disjunction &&
               this.checkEquivalent(conjunction.subRight, other) &&
               (this.checkEquivalent(conjunction.subLeft.subLeft, other) ||
                this.checkEquivalent(conjunction.subLeft.subRight, other));
    }
    checkDisjunction(disjunction: Disjunction, other: Expression) {
        if (other instanceof AlwaysTrue) {
            return (disjunction.subRight instanceof AlwaysTrue || disjunction.subLeft instanceof AlwaysTrue);
        }
        if (this.checkEquivalent(disjunction.subLeft, other)) {
            if (this.checkEquivalent(disjunction.subRight, other)) {
                return true;
            }
            return disjunction.subRight instanceof Conjunction &&
                   (this.checkEquivalent(disjunction.subRight.subLeft, other) ||
                    this.checkEquivalent(disjunction.subRight.subRight, other));
        }
        return disjunction.subLeft instanceof Conjunction &&
               this.checkEquivalent(disjunction.subRight, other) &&
               (this.checkEquivalent(disjunction.subLeft.subLeft, other) ||
                this.checkEquivalent(disjunction.subLeft.subRight, other));
    }
    checkEquivalent(expression: Expression, other: Expression) {
        return this.checkForError(expression, other).isEquivalentOrIdentical();
    }
}

export default FormulaEliminationChecker;