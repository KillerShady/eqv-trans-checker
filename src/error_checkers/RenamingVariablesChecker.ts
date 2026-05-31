import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {ExistentialQuant, QuantifiedFormula, UniversalQuant, Variable} from "../model";

class RenamingVariablesChecker extends TransformationChecker {
    renaming: Map<string, string> = new Map<string, string>();

    public checkForError(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkSameFunctor(original, transformed) &&
            ! (original instanceof Variable) &&
            ! (original instanceof QuantifiedFormula)) {
            return this.checkChildren(original, transformed);
        }
        return this.checkTransformationApplied(original, transformed);
    }

    checkTransformationApplied(original: Expression, transformed: Expression): TransformationCheckerResult {
        if ((original instanceof UniversalQuant && transformed instanceof UniversalQuant) ||
            (original instanceof ExistentialQuant && transformed instanceof ExistentialQuant)) {
            return this.checkQuant(original, transformed);
        } else if (original instanceof Variable &&
                   transformed instanceof Variable) {
            return this.checkVariables(original, transformed);
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Renaming Variables rule!"
        );
    }

    private checkQuant(original: QuantifiedFormula, transformed: QuantifiedFormula) {
        let previousTransformed: string | undefined;
        if (this.renaming.has(original.variableName)) {
            previousTransformed = this.renaming.get(original.variableName);
        }
        this.renaming.set(original.variableName, transformed.variableName);
        const result = this.checkForError(original.subFormula, transformed.subFormula);
        if (previousTransformed) {
            this.renaming.set(original.variableName, previousTransformed);
        } else {
            this.renaming.delete(original.variableName);
        }
        return result;
    }

    private checkVariables(original: Variable, transformed: Variable) {
        if (this.renaming.has(original.name)) {
            if (this.renaming.get(original.name) === transformed.name) {
                return original.name === transformed.name ?
                    TransformationCheckerResult.identicalResult() :
                    TransformationCheckerResult.equivalentResult();
            }
            return TransformationCheckerResult.errorResult(
                "Expected " + this.renaming.get(original.name) + ", found " + transformed.name + "!"
            );
        }
        if (new Set(this.renaming.values()).has(transformed.name)) {
            return TransformationCheckerResult.errorResult(
                "Free variable " + original.name + " cannot be changed to a bound variable " + transformed.name + "!"
            );
        }
        return original.name === transformed.name ?
            TransformationCheckerResult.identicalResult() :
            TransformationCheckerResult.equivalentResult();
    }

}

export default RenamingVariablesChecker;