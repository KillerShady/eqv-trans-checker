import type Expression from "../../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "../TransformationChecker.ts";
import {Conjunction, Disjunction, Negation} from "../../model";

class DeMorganChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            // @ts-expect-error instance has been checked in if statement
            const result = this.checkForError(original.subFormula.subLeft, transformed.subLeft.subFormula);
            // @ts-expect-error instance has been checked in if statement
            if (result.isNotError()) result.combine(this.checkForError(original.subFormula.subRight, transformed.subRight.subFormula));
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            // @ts-expect-error instance has been checked in if statement
            const result = this.checkForError(original.subLeft.subFormula, transformed.subFormula.subLeft);
            // @ts-expect-error instance has been checked in if statement
            if (result.isNotError()) result.combine(this.checkForError(original.subRight.subFormula, transformed.subFormula.subRight));
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
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

    checkRequisites(original: Expression, transformed: Expression): boolean {
        return ((original instanceof Negation &&
                 original.subFormula instanceof Disjunction &&
                 transformed instanceof Conjunction &&
                 transformed.subLeft instanceof Negation &&
                 transformed.subRight instanceof Negation) ||
                (original instanceof Negation &&
                 original.subFormula instanceof Conjunction &&
                 transformed instanceof Disjunction &&
                 transformed.subLeft instanceof Negation &&
                 transformed.subRight instanceof Negation));
    }

}

export default DeMorganChecker;