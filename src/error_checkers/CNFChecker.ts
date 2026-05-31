import type Expression from "../model/Expression.ts";
import TransformationChecker, {TransformationCheckerResult} from "./TransformationChecker.ts";
import {
    Conjunction,
    Disjunction, EqualityAtom, Equivalence, ExistentialQuant, Implication,
    Negation,
    PredicateAtom, UniversalQuant,
} from "../model";

class CNFChecker extends TransformationChecker {
    public checkForError(original: Expression): TransformationCheckerResult {
        if (original instanceof Conjunction) {
            return this.checkConjunct(original);
        }
        if (original instanceof UniversalQuant) {
            return this.checkQuant(original);
        }
        if (original instanceof Disjunction) {
            return this.checkDisjunct(original);
        }
        if (original instanceof Negation || original instanceof PredicateAtom || original instanceof EqualityAtom) {
            return this.checkLiteral(original);
        }
        return this.selectError(original);
    }

    checkConjunct(original: Conjunction): TransformationCheckerResult {
        let result: TransformationCheckerResult;
        if (original.subLeft instanceof Conjunction) {
            return this.checkConjunct(original.subLeft);
        } else if (original.subLeft instanceof UniversalQuant) {
            result = this.checkQuant(original.subLeft);
        } else if (original.subLeft instanceof Disjunction) {
            result = this.checkDisjunct(original.subLeft)
        } else if (original.subLeft instanceof Negation ||
                   original.subLeft instanceof PredicateAtom ||
                   original.subLeft instanceof EqualityAtom) {
            result = this.checkLiteral(original.subLeft);
        } else {
            return this.selectError(original.subLeft);
        }

        if (original.subRight instanceof Conjunction) {
            result.combine(this.checkConjunct(original.subRight));
        } else if (original.subRight instanceof UniversalQuant) {
            result.combine(this.checkQuant(original.subRight));
        } else if (original.subRight instanceof Disjunction) {
            result.combine(this.checkDisjunct(original.subRight));
        } else if (original.subRight instanceof Negation ||
                   original.subRight instanceof PredicateAtom ||
                   original.subRight instanceof EqualityAtom) {
            result.combine(this.checkLiteral(original.subRight));
        } else {
            return this.selectError(original.subRight);
        }
        return result;
    }

    checkQuant(original: UniversalQuant): TransformationCheckerResult {
        if (original.subFormula instanceof Conjunction) {
            return TransformationCheckerResult.errorResult(
                "Universal quantifiers must be at the start of the clause in CNF!"
            );
        } else if (original.subFormula instanceof UniversalQuant) {
            return this.checkQuant(original.subFormula);
        } else if (original.subFormula instanceof Disjunction) {
            return this.checkDisjunct(original.subFormula)
        } else if (original.subFormula instanceof Negation ||
            original.subFormula instanceof PredicateAtom ||
            original.subFormula instanceof EqualityAtom) {
            return this.checkLiteral(original.subFormula);
        }
        return this.selectError(original.subFormula);
    }

    checkDisjunct(original: Disjunction): TransformationCheckerResult {
        let result: TransformationCheckerResult;
        if (original.subLeft instanceof Conjunction) {
            return TransformationCheckerResult.errorResult(
                "Disjunction cannot contain conjunction in CNF!"
            );
        } else if (original.subLeft instanceof UniversalQuant) {
            return TransformationCheckerResult.errorResult(
                "Universal quantifiers must be at the start of the clause in CNF!"
            );
        } else if (original.subLeft instanceof Disjunction) {
            result = this.checkDisjunct(original.subLeft)
        } else if (original.subLeft instanceof Negation ||
                   original.subLeft instanceof PredicateAtom ||
                   original.subLeft instanceof EqualityAtom) {
            result = this.checkLiteral(original.subLeft);
        } else {
            return this.selectError(original.subLeft);
        }

        if (original.subRight instanceof Conjunction) {
            return TransformationCheckerResult.errorResult(
                "Disjunction cannot contain conjunction in CNF!"
            );
        } else if (original.subRight instanceof UniversalQuant) {
            return TransformationCheckerResult.errorResult(
                "Universal quantifiers must be at the start of the clause in CNF!"
            );
        } else if (original.subRight instanceof Disjunction) {
            result.combine(this.checkDisjunct(original.subRight));
        } else if (original.subRight instanceof Negation ||
                   original.subRight instanceof PredicateAtom ||
                   original.subRight instanceof EqualityAtom) {
            result.combine(this.checkLiteral(original.subRight));
        } else {
            return this.selectError(original.subRight);
        }
        return result;
    }

    checkLiteral(original: Negation | PredicateAtom | EqualityAtom): TransformationCheckerResult {
        if (original instanceof PredicateAtom || original instanceof EqualityAtom) {
            return TransformationCheckerResult.equivalentResult();
        }
        if (original.subFormula instanceof PredicateAtom || original.subFormula instanceof EqualityAtom) {
            return TransformationCheckerResult.equivalentResult();
        }
        return TransformationCheckerResult.errorResult(
            "Negation must be before an atomic formula!"
        );
    }

    selectError(original: Expression): TransformationCheckerResult {
        if (original instanceof Implication) {
            return TransformationCheckerResult.errorResult(
                "Implication is not allowed in CNF!"
            );
        }
        if (original instanceof Equivalence) {
            return TransformationCheckerResult.errorResult(
                "Equivalence is not allowed in CNF!"
            );
        }
        if (original instanceof ExistentialQuant) {
            return TransformationCheckerResult.errorResult(
                "Existential quantifier is not allowed in CNF!"
            );
        }
        return TransformationCheckerResult.errorResult(
            original.toString() + " is not allowed in CNF!"
        )
    }

    checkTransformationApplied(): TransformationCheckerResult {
        return TransformationCheckerResult.errorResult("")
    }

}

export default CNFChecker;