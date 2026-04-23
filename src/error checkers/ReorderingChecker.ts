import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import type Expression from "../model/Expression.ts";
import {
    Conjunction,
    Disjunction,
} from "../model";

class ReorderingChecker extends TransformationChecker {
    public checkForError(original: Expression, transformed: Expression): TransformationCheckerResult {
    //console.log("CHECKING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n", original.toString(), "\n", transformed.toString());
        if (this.checkSameFunctor(original, transformed)) {
            const childrenResults = this.checkChildren(original, transformed);
            if (childrenResults.isEquivalentOrIdentical()) return childrenResults;
            return this.checkTransformationApplied(original, transformed, childrenResults);
        }
        return this.checkTransformationApplied(original, transformed, undefined);
    }

    checkTransformationApplied(original: Expression, transformed: Expression, childrenResults: TransformationCheckerResult | undefined): TransformationCheckerResult {
        //console.log("error on\n", original.toString(), "\n", transformed.toString());
        if (original instanceof Conjunction && transformed instanceof Conjunction) {
            return this.checkConjunctionDisjunction(original, transformed, "conjunct");
        } else if (original instanceof Disjunction && transformed instanceof Disjunction) {
            return this.checkConjunctionDisjunction(original, transformed, "disjunct");
        }
        if (childrenResults !== undefined) {
            return childrenResults;
        }
        return this.errorResult(
            original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to a combination of Associativity and Commutativity rule!"
        );
    }

    checkConjunctionDisjunction(original: Conjunction | Disjunction, transformed: Conjunction | Disjunction, type: string) {
        //console.log(original.toString(), type, transformed.toString());
        const originalSubFormulas = original.flatten().getSubFormulas();
        const transformedSubFormulas = transformed.flatten().getSubFormulas();
        /*console.log(originalSubFormulas.length, transformedSubFormulas.length);
        for (let i = 0; i < originalSubFormulas.length; i++) {
            console.log(originalSubFormulas[i].toString());
        }
        for (let i = 0; i < transformedSubFormulas.length; i++) {
            console.log(originalSubFormulas[i].toString());
        }*/

        if (originalSubFormulas.length < transformedSubFormulas.length) {
            return this.errorResult(
                transformed.toString() + " has more " + type + "s than " + original.toString()
            );
        } else if (originalSubFormulas.length > transformedSubFormulas.length) {
            return this.errorResult(
                original.toString() + " has more " + type + "s than " + transformed.toString()
            );
        }
        for (let i = 0; i < transformedSubFormulas.length; i++) {
            const result = this.checkForError(originalSubFormulas[i], transformedSubFormulas[i]);
            if (result.isError()) {
                return this.errorResult(
                    original.toString() + " and " + transformed.toString() + " are neither equivalent nor identical according to a combination of Associativity and Commutativity rules!"
                );
            }
        }
        return this.equivalentResult();
    }
}

export default ReorderingChecker;