import Conjunction from "./formula/Conjunction.ts";
import Disjunction from "./formula/Disjunction.ts";
import EqualityAtom from "./formula/EqualityAtom.ts";
import Equivalence from "./formula/Equivalence.ts";
import ExistentialQuant from "./formula/ExistentialQuant.ts";
import Formula from "./formula/Formula.ts";
import Implication from "./formula/Implication.ts";
import Negation from "./formula/Negation.ts";
import PredicateAtom from "./formula/PredicateAtom.ts";
import QuantifiedFormula from "./formula/QuantifiedFormula.ts";
import UniversalQuant from "./formula/UniversalQuant.ts";
import Constant from "./term/Constant.ts";
import FunctionTerm from "./term/FunctionTerm.ts";
import Term from "./term/Term.ts";
import Variable from "./term/Variable.ts";
import Expression from "./Expression.ts";
import Structure from "./Structure.ts";
import Language from "./Language.ts";
import type {ErrorExpected} from "@fmfi-uk-1-ain-412/js-fol-parser";
import AlwaysTrue from "./formula/AlwaysTrue.ts";
import AlwaysFalse from "./formula/AlwaysFalse.ts";

export {AlwaysTrue, AlwaysFalse, Conjunction, Disjunction, EqualityAtom, Equivalence, ExistentialQuant, Formula, Implication,
        Negation, PredicateAtom, QuantifiedFormula, UniversalQuant, Constant, FunctionTerm, Term,
        Variable, Expression, Structure, Language};

export * from "./formula/Formula.ts";
export * from "./Structure.ts";
export * from "./Language.ts";

export function getFactories(language: Language) {
    return {
        variable: (symbol: string, _ee: ErrorExpected) => new Variable(symbol),
        constant: (symbol: string, _ee: ErrorExpected) => new Constant(symbol),
        functionApplication: (
            symbol: string,
            args: Array<Term>,
            ee: ErrorExpected
        ) => {
            language.checkFunctionArity(symbol, args, ee);
            return new FunctionTerm(symbol, args);
        },
        true: (_ee: ErrorExpected) =>
            new AlwaysTrue(),
        false: (_ee: ErrorExpected) =>
            new AlwaysFalse(),
        predicateAtom: (symbol: string, args: Array<Term>, ee: ErrorExpected) => {
            language.checkPredicateArity(symbol, args, ee);
            return new PredicateAtom(symbol, args);
        },
        equalityAtom: (lhs: Term, rhs: Term, _ee: ErrorExpected) =>
            new EqualityAtom(lhs, rhs),
        negation: (subf: Formula, _ee: ErrorExpected) => new Negation(subf),
        conjunction: (lhs: Formula, rhs: Formula, _ee: ErrorExpected) =>
            new Conjunction(lhs, rhs),
        disjunction: (lhs: Formula, rhs: Formula, _ee: ErrorExpected) =>
            new Disjunction(lhs, rhs),
        implication: (lhs: Formula, rhs: Formula, _ee: ErrorExpected) =>
            new Implication(lhs, rhs),
        equivalence: (lhs: Formula, rhs: Formula, _ee: ErrorExpected) =>
            new Equivalence(lhs, rhs),
        existentialQuant: (variable: string, subf: Formula, _ee: ErrorExpected) =>
            new ExistentialQuant(variable, subf),
        universalQuant: (variable: string, subf: Formula, _ee: ErrorExpected) =>
            new UniversalQuant(variable, subf),
      };
}