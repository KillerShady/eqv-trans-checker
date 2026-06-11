import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {AlwaysFalse, AlwaysTrue, Conjunction, Disjunction} from "../model";

class IdentityChecker extends TransformationChecker {
    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkConjunction(original)) {
            const result = (original as Conjunction).subLeft instanceof AlwaysTrue ?
                this.checkForError((original as Conjunction).subRight, transformed) :
                this.checkForError((original as Conjunction).subLeft, transformed);
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if (this.checkConjunction(transformed)) {
            const result = (transformed as Conjunction).subLeft instanceof AlwaysTrue ?
                this.checkForError(original, (transformed as Conjunction).subRight) :
                this.checkForError(original, (transformed as Conjunction).subLeft);
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if (this.checkDisjunction(original)) {
            const result = (original as Disjunction).subLeft instanceof AlwaysFalse ?
                this.checkForError((original as Disjunction).subRight, transformed) :
                this.checkForError((original as Disjunction).subLeft, transformed);
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        } else if (this.checkDisjunction(transformed)) {
            const result = (transformed as Disjunction).subLeft instanceof AlwaysFalse ?
                this.checkForError(original, (transformed as Disjunction).subRight) :
                this.checkForError(original, (transformed as Disjunction).subLeft);
            if (result.isEquivalentOrIdentical()) return TransformationCheckerResult.equivalentResult();
            return result;
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Identity rule!"
        );
    }

    checkConjunction(formula: Expression) {
        return (formula instanceof Conjunction &&
                (formula.subLeft instanceof AlwaysTrue ||
                 formula.subRight instanceof AlwaysTrue)
        );
    }

    checkDisjunction(formula: Expression) {
        return (formula instanceof Disjunction &&
                (formula.subLeft instanceof AlwaysFalse ||
                 formula.subRight instanceof AlwaysFalse)
        );
    }

}

export default IdentityChecker;