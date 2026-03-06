import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {AlwaysFalse, Disjunction} from "../model";

class UnsatisfiableFormulaEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkRequisites(original, transformed)) {
            const result = original.subLeft instanceof AlwaysFalse ?
                this.checkForError(original.subRight, transformed) :
                this.checkForError(original.subLeft, transformed);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        } else if (this.checkRequisites(transformed, original)) {
            const result = transformed.subLeft instanceof AlwaysFalse ?
                this.checkForError(original, transformed.subRight) :
                this.checkForError(original, transformed.subLeft);
            if (result.isEquivalentOrIdentical()) return this.equivalentResult();
            return result;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Tautology Creation rule!"
        );
    }

    checkRequisites(original: Expression, _transformed: Expression): boolean {
        return (original instanceof Disjunction &&
                (original.subLeft instanceof AlwaysFalse ||
                 original.subRight instanceof AlwaysFalse));
    }

}

export default UnsatisfiableFormulaEliminationChecker;