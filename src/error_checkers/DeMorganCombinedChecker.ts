import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {AlwaysFalse, AlwaysTrue, Conjunction, Disjunction, ExistentialQuant, Negation, UniversalQuant} from "../model";

class DeMorganCombinedChecker extends TransformationChecker {
    negated = false;

    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.negated) {
            if ((original instanceof Conjunction && transformed instanceof Disjunction) ||
                (original instanceof Disjunction && transformed instanceof Conjunction)) {
                const result = this.checkTransformationApplied(original.subLeft, transformed.subLeft, childrenResults);
                result.combine(this.checkTransformationApplied(original.subRight, transformed.subRight, childrenResults));
                if (result.isEquivalentOrIdentical()) return this.equivalentResult();
                return result;
            }
            if (((original instanceof UniversalQuant && transformed instanceof ExistentialQuant) ||
                 (original instanceof ExistentialQuant && transformed instanceof UniversalQuant)   ) &&
                original.variableName === transformed.variableName) {
                const result = this.checkTransformationApplied(original.subFormula, transformed.subFormula, childrenResults);
                if (result.isEquivalentOrIdentical()) return this.equivalentResult();
                return result;
            }
            if (original instanceof Negation) {
                this.negated = false;
                const result = this.checkForError(original.subFormula, transformed);
                this.negated = true;
                if (result.isEquivalentOrIdentical()) return this.equivalentResult();
                return result;
            }
            if (transformed instanceof Negation) {
                this.negated = false;
                const result = this.checkForError(original, transformed.subFormula);
                this.negated = true;
                if (result.isEquivalentOrIdentical()) return this.equivalentResult();
                return result;
            }
            if (original instanceof AlwaysTrue && transformed instanceof AlwaysFalse) {
                return this.equivalentResult();
            }
            if (original instanceof AlwaysFalse && transformed instanceof AlwaysTrue) {
                return this.equivalentResult();
            }
            if (childrenResults &&
                (this.hasOneChild(original) ||
                    ! childrenResults.isAllError())) {
                return childrenResults;
            }
            return this.errorResult(
                "Expected " + original.toString() + " to be a negation of " + transformed.toString() + "!"
            );
        }
        if (original instanceof Negation) {
            this.negated = true;
            const result =  this.checkTransformationApplied(original.subFormula, transformed, childrenResults);
            this.negated = false;
            return result;
        }
        if (transformed instanceof Negation) {
            this.negated = true;
            const result =  this.checkTransformationApplied(original, transformed.subFormula, childrenResults);
            this.negated = false;
            return result;
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the De Morgan rule!"
        );
    }

}

export default DeMorganCombinedChecker;