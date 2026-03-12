import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {QuantifiedFormula, Variable} from "../model";

class QuantifierEliminationChecker extends TransformationChecker {
    deleted: Set<string> = new Set<string>();

    public checkForError(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkSameFunctor(original, transformed) &&
            ! (original instanceof Variable) &&
            ! (original instanceof QuantifiedFormula)) {
            return this.checkChildren(original, transformed);
        }
        return this.checkTransformationApplied(original, transformed);
    }

    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (original instanceof QuantifiedFormula &&
            transformed instanceof QuantifiedFormula &&
            this.checkSameFunctor(original, transformed)) {
            const addBack = this.deleted.has(transformed.variableName);
            this.deleted.delete(transformed.variableName);
            const result = this.checkChildren(original, transformed);
            if (addBack) this.deleted.add(transformed.variableName);
            return result;
        } else if (original instanceof QuantifiedFormula &&
                   transformed instanceof QuantifiedFormula) {
            const result = this.checkQuant(original, transformed)
            if (result.isEquivalentOrIdentical()) {
                return result;
            }
            return this.checkQuant(transformed, original);
        } else if (original instanceof QuantifiedFormula) {
            return this.checkQuant(original, transformed);
        } else if (transformed instanceof QuantifiedFormula) {
            return this.checkQuant(transformed, original);
        } else if (original instanceof Variable &&
                   transformed instanceof Variable &&
                   original.name === transformed.name) {
            if (this.deleted.has(transformed.name)) {
                return this.errorResult(
                    "Cannot apply rule, because free variable " + transformed.name + " was found!"
                );
            }
            return this.identicalResult();
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Quantifier Elimination rule!"
        );
    }

    private checkQuant(withQuant: QuantifiedFormula, withoutQuant: Expression) {
        this.deleted.add(withQuant.variableName);
        const result = this.checkForError(withQuant.subFormula, withoutQuant);
        result.combine(this.equivalentResult());
        this.deleted.delete(withQuant.variableName);
        return result;
    }

}

export default QuantifierEliminationChecker;