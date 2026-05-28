import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {Conjunction, Disjunction, ExistentialQuant, QuantifiedFormula, UniversalQuant, Variable} from "../model";

class QuantifierEliminationPropositionalChecker extends TransformationChecker {
    deleted: Set<string> = new Set<string>();

    public checkForError(original: Expression, transformed: Expression): TransformationCheckerResult {
        if (this.checkSameFunctor(original, transformed) &&
            ! (original instanceof Variable) &&
            ! (original instanceof QuantifiedFormula)) {
            const childrenResults = this.checkChildren(original, transformed);
            if (childrenResults.isEquivalentOrIdentical()) return childrenResults;
            return this.checkTransformationApplied(original, transformed, childrenResults);
        }
        return this.checkTransformationApplied(original, transformed, undefined);
    }

    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        if (this.checkRequisitesStandard(original, transformed)) {
            return this.performCheck(original.subFormula.subRight, original.subFormula.subLeft,
                                     transformed.subRight, transformed.subLeft.subFormula,
                                     original.variableName);
        } else if (this.checkRequisitesFlipped(original, transformed)) {
            return this.performCheck(original.subFormula.subLeft, original.subFormula.subRight,
                                     transformed.subLeft, transformed.subRight.subFormula,
                                     original.variableName);
        } else if (this.checkRequisitesStandard(transformed, original)) {
            return this.performCheck(original.subRight, original.subLeft.subFormula,
                                     transformed.subFormula.subRight, transformed.subFormula.subLeft,
                                     transformed.variableName);
        } else if (this.checkRequisitesFlipped(transformed, original)) {
            return this.performCheck(original.subLeft, original.subRight.subFormula,
                                     transformed.subFormula.subLeft, transformed.subFormula.subRight,
                                     transformed.variableName);
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
        if (this.checkSameFunctor(original, transformed)) {
            return this.checkChildren(original, transformed);
        }
        if (childrenResults &&
            (this.hasOneChild(original) ||
                ! childrenResults.isAllError())) {
            return childrenResults;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to the Quantifier Prenexing rule!"
        );
    }

    checkRequisitesStandard(original: Expression, transformed: Expression): boolean {
        return (original instanceof UniversalQuant &&
                original.subFormula instanceof Conjunction &&
                transformed instanceof Conjunction &&
                transformed.subLeft instanceof UniversalQuant &&
                original.variableName === transformed.subLeft.variableName) ||

               (original instanceof UniversalQuant &&
                original.subFormula instanceof Disjunction &&
                transformed instanceof Disjunction &&
                transformed.subLeft instanceof UniversalQuant &&
                original.variableName === transformed.subLeft.variableName) ||

               (original instanceof ExistentialQuant &&
                original.subFormula instanceof Conjunction &&
                transformed instanceof Conjunction &&
                transformed.subLeft instanceof ExistentialQuant &&
                original.variableName === transformed.subLeft.variableName) ||

               (original instanceof ExistentialQuant &&
                original.subFormula instanceof Disjunction &&
                transformed instanceof Disjunction &&
                transformed.subLeft instanceof ExistentialQuant &&
                original.variableName === transformed.subLeft.variableName)
    }
    checkRequisitesFlipped(original: Expression, transformed: Expression): boolean {
        return (original instanceof UniversalQuant &&
                original.subFormula instanceof Conjunction &&
                transformed instanceof Conjunction &&
                transformed.subRight instanceof UniversalQuant &&
                original.variableName === transformed.subRight.variableName) ||

            (original instanceof UniversalQuant &&
                original.subFormula instanceof Disjunction &&
                transformed instanceof Disjunction &&
                transformed.subRight instanceof UniversalQuant &&
                original.variableName === transformed.subRight.variableName) ||

            (original instanceof ExistentialQuant &&
                original.subFormula instanceof Conjunction &&
                transformed instanceof Conjunction &&
                transformed.subRight instanceof ExistentialQuant &&
                original.variableName === transformed.subRight.variableName) ||

            (original instanceof ExistentialQuant &&
                original.subFormula instanceof Disjunction &&
                transformed instanceof Disjunction &&
                transformed.subRight instanceof ExistentialQuant &&
                original.variableName === transformed.subRight.variableName)
    }

    performCheck(originalDeleted: Expression,
                 originalNotDeleted: Expression,
                 transformedDeleted: Expression,
                 transformedNotDeleted: Expression,
                 variable: string): TransformationCheckerResult {
        const addBack = this.deleted.has(variable);
        const result = this.equivalentResult();

        this.deleted.add(variable);
        result.combine(this.checkForError(originalDeleted, transformedDeleted));
        this.deleted.delete(variable);
        if (result.isNotError()) result.combine(this.checkForError(originalNotDeleted, transformedNotDeleted));

        if (addBack) this.deleted.add(variable);
        return result;
    }

}

export default QuantifierEliminationPropositionalChecker;