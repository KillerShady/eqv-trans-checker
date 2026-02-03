import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {Disjunction, Implication, Negation} from "../model";


class ImplicationEliminationChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (original instanceof Implication &&
            transformed instanceof Disjunction &&
            transformed.subLeft instanceof Negation) {
            const result = this.checkForError(original.subLeft, transformed.subLeft.subFormula);
            if (result.isNotError()) result.combine(this.checkForError(original.subRight, transformed.subRight));
            if (result.isEquivalentOrIdentical()) return new TransformationCheckerResult([], true, false);
            return result;
        }
        return new TransformationCheckerResult([new Error(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Remove Implication rule!"
        )], false, true);
    }
}

export default ImplicationEliminationChecker;