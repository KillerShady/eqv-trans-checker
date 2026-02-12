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
        console.log(original.constructor.name + ": " + transformed.constructor.name);
        if ((original instanceof UniversalQuant && transformed instanceof UniversalQuant) ||
            (original instanceof ExistentialQuant && transformed instanceof ExistentialQuant)) {
            if (this.renaming.has(original.variableName)) {
                if (this.renaming.get(original.variableName) === transformed.variableName) {
                    return this.equivalentResult();
                } else {
                    return this.errorResult(
                        "Expected " + this.renaming.get(original.variableName) + ", found " + transformed.variableName
                    );
                }
            } else {
                this.renaming.set(original.variableName, transformed.variableName);
                const result = this.checkForError(original.subFormula, transformed.subFormula);
                this.renaming.delete(original.variableName);
                return result;
            }
        } else if (original instanceof Variable &&
                   transformed instanceof Variable) {
            if (this.renaming.has(original.name) &&
                this.renaming.get(original.name) !== transformed.name) {
                return this.errorResult(
                    "Expected " + this.renaming.get(original.name) + ", found " + transformed.name
                );
            }
            return this.equivalentResult();
        }
        console.log("unknown");
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are not equivalent according to the Renaming Variables rule!"
        );
    }

}

export default RenamingVariablesChecker;