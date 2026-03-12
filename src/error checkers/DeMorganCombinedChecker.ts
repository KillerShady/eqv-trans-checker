import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Conjunction, Disjunction, ExistentialQuant, Negation, UniversalQuant} from "../model";

class DeMorganCombinedChecker extends TransformationChecker {
    negated = false;

    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.negated) {
            if ((original instanceof Conjunction && transformed instanceof Disjunction) ||
                (original instanceof Disjunction && transformed instanceof Conjunction)) {
                const result = this.equivalentResult();
                result.combine(this.checkTransformationApplied(original.subLeft, transformed.subLeft));
                result.combine(this.checkTransformationApplied(original.subRight, transformed.subRight));
                return result;
            }
            if (((original instanceof UniversalQuant && transformed instanceof ExistentialQuant) ||
                 (original instanceof ExistentialQuant && transformed instanceof UniversalQuant)   ) &&
                original.variableName === transformed.variableName) {
                const result = this.equivalentResult();
                result.combine(this.checkTransformationApplied(original.subFormula, transformed.subFormula));
                return result;
            }
            if (original instanceof Negation) {
                const result = this.equivalentResult();
                result.combine(this.checkForError(original.subFormula, transformed));
                return result;
            }
            if (transformed instanceof Negation) {
                const result = this.equivalentResult();
                result.combine(this.checkForError(original, transformed.subFormula));
                return result;
            }
            return this.errorResult(
                original.toString() + " and " + transformed.toString() + " are not equivalent according to the De Morgan rule!"
            );
        } else {
            if (original instanceof Negation) {
                this.negated = true;
                return this.checkTransformationApplied(original.subFormula, transformed);
            }
            if (transformed instanceof Negation) {
                this.negated = true;
                return this.checkTransformationApplied(original, transformed.subFormula);
            }
            return this.errorResult(
                original.toString() + " and " + transformed.toString() + " are not equivalent according to the De Morgan rule!"
            );
        }
    }

}

export default DeMorganCombinedChecker;