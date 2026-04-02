import TransformationChecker from "../../error checkers/TransformationChecker.ts";
import AssociativityChecker from "../../error checkers/AssociativityChecker.ts";
import CommutativityChecker from "../../error checkers/CommutativityChecker.ts";
import UnsatisfiableFormulaEliminationChecker from "../../error checkers/UnsatisfiableFormulaEliminationChecker.ts";
import UnsatisfiableFormulaCreationChecker from "../../error checkers/UnsatisfiableFormulaCreationChecker.ts";
import TautologyEliminationChecker from "../../error checkers/TautologyEliminationChecker.ts";
import TautologyCreationChecker from "../../error checkers/TautologyCreationChecker.ts";
import RenamingVariablesChecker from "../../error checkers/RenamingVariablesChecker.ts";
import QuantifierEliminationPropositionalChecker
    from "../../error checkers/QuantifierEliminationPropositionalChecker.ts";
import QuantifierEliminationChecker from "../../error checkers/QuantifierEliminationChecker.ts";
import ImplicationEliminationChecker from "../../error checkers/ImplicationEliminationChecker.ts";
import FormulaEliminationChecker from "../../error checkers/FormulaEliminationChecker.ts";
import DoubleNegationEliminationChecker from "../../error checkers/DoubleNegationEliminationChecker.ts";
import DistributivityQuantifierChecker from "../../error checkers/DistributivityQuantifierChecker.ts";
import DistributivityChecker from "../../error checkers/DistributivityChecker.ts";
import DeMorganCombinedChecker from "../../error checkers/DeMorganCombinedChecker.ts";
import DeMorganQuantifierChecker from "../../error checkers/DeMorganQuantifierChecker.ts";
import DeMorganChecker from "../../error checkers/DeMorganChecker.ts";

interface EquivalentTransformationData {
    key: string,
    name: string,
    tex: string,
    checker: TransformationChecker,
    help: string,
}
export const EquivalentTransformationsRecord: Record<string, EquivalentTransformationData> = {
    "Associativity": {
        key: "Associativity",
        name: "Associativity",
        tex: "(A \\land (B \\land C)) \\Leftrightarrow ((A \\land B) \\land C)\\\\(A \\lor (B \\lor C)) \\Leftrightarrow ((A \\lor B) \\lor C)",
        checker: new AssociativityChecker(),
        help: ""
    },
    "Commutativity": {
        key: "Commutativity",
        name: "Commutativity",
        tex: "(A \\land B) \\Leftrightarrow (B \\land A)\\\\(A \\lor B) \\Leftrightarrow (B \\lor A)",
        checker: new CommutativityChecker(),
        help: ""
    },
    "DeMorganPROP": {
        key: "DeMorganPROP",
        name: "DeMorgan Propositional",
        tex: "\\neg(A \\land B) \\Leftrightarrow (\\neg A \\lor \\neg B)\\\\\\neg(A \\lor B) \\Leftrightarrow (\\neg A \\land \\neg B)",
        checker: new DeMorganChecker(),
        help: ""
    },
    "DeMorganQUANT": {
        key: "DeMorganQUANT",
        name: "DeMorgan Quantifier",
        tex: "\\neg \\exists x A \\Leftrightarrow \\forall x \\neg A \\\\\\neg \\forall x A \\Leftrightarrow \\exists x \\neg A",
        checker: new DeMorganQuantifierChecker(),
        help: ""
    },
    "DeMorganCOMBINED": {
        key: "DeMorganCOMBINED",
        name: "DeMorgan Combined",
        tex: "\\neg \\exists x A \\Leftrightarrow \\forall x \\neg A \\\\\\neg \\forall x A \\Leftrightarrow \\exists x \\neg A\\\\\\neg(A \\land B) \\Leftrightarrow (\\neg A \\lor \\neg B)\\\\\\neg(A \\lor B) \\Leftrightarrow (\\neg A \\land \\neg B)",
        checker: new DeMorganCombinedChecker(),
        help: ""
    },
    "Distributivity": {
        key: "Distributivity",
        name: "Distributivity",
        tex: "(A \\land (B \\lor C)) \\Leftrightarrow ((A \\land B) \\lor (A \\land C))\\\\(A \\lor (B \\land C)) \\Leftrightarrow ((A \\lor B) \\land (A \\lor C))",
        checker: new DistributivityChecker(),
        help: ""
    },
    "DistributivityQUANT": {
        key: "DistributivityQUANT",
        name: "Distributivity Quantifier",
        tex: "\\exists x(A \\lor B) \\Leftrightarrow (\\exists x A \\lor \\exists x B)\\\\\\forall x (A \\land B) \\Leftrightarrow (\\forall x A \\land \\forall x B)",
        checker: new DistributivityQuantifierChecker(),
        help: ""
    },
    "DoubleNEG": {
        key: "DoubleNEG",
        name: "Double Negation Elimination",
        tex: "\\neg\\neg A \\Leftrightarrow A",
        checker: new DoubleNegationEliminationChecker(),
        help: ""
    },
    "RemoveFormula": {
        key: "RemoveFormula",
        name: "Formula Elimination",
        tex: "(A \\land A) \\Leftrightarrow A \\\\(A \\lor A) \\Leftrightarrow A\\\\(A \\lor (A \\land B)) \\Leftrightarrow A \\\\(A \\land (A \\lor B)) \\Leftrightarrow A",
        checker: new FormulaEliminationChecker(),
        help: ""
    },
    "RemoveIMPL": {
        key: "RemoveIMPL",
        name: "Implication Elimination",
        tex: "(A \\to B) \\Leftrightarrow (\\neg A \\lor B)",
        checker: new ImplicationEliminationChecker(),
        help: ""
    },
    "RemoveQUANT": {
        key: "RemoveQUANT",
        name: "Quantifier Elimination",
        tex: "\\exists x D \\Leftrightarrow D \\\\\\forall x D \\Leftrightarrow D",
        checker: new QuantifierEliminationChecker(),
        help: ""
    },
    "RemoveQUANTPROP": {
        key: "RemoveQUANTPROP",
        name: "Quantifier Elimination Propositional",
        tex: "\\exists x(A \\lor D) \\Leftrightarrow \\exists x A \\lor D \\\\\\forall x (A \\lor D) \\Leftrightarrow \\forall x A \\lor D\\\\\\exists x (A \\land D) \\Leftrightarrow \\exists x A \\land D \\\\\\forall x (A \\land D) \\Leftrightarrow \\forall x A \\land D",
        checker: new QuantifierEliminationPropositionalChecker(),
        help: ""
    },
    "RenameVAR": {
        key: "RenameVAR",
        name: "Renaming Variables",
        tex: "\\exists x A \\Leftrightarrow \\exists y A\\{x \\mapsto y\\}\\\\\\forall x A \\Leftrightarrow \\forall y A\\{x \\mapsto y\\}",
        checker: new RenamingVariablesChecker(),
        help: ""
    },
    "CreateTRUE": {
        key: "CreateTRUE",
        name: "Tautology Creation",
        tex: "(A \\lor \\neg A) \\Leftrightarrow \\top\\\\\\neg \\bot \\Leftrightarrow \\top",
        checker: new TautologyCreationChecker(),
        help: ""
    },
    "RemoveTRUE": {
        key: "RemoveTRUE",
        name: "Tautology Elimination",
        tex: "(A \\land \\top) \\Leftrightarrow A",
        checker: new TautologyEliminationChecker(),
        help: ""
    },
    "CreateFALSE": {
        key: "CreateFALSE",
        name: "Unsatisfiable Formula Creation",
        tex: "(A \\land \\neg A) \\Leftrightarrow \\bot\\\\\\neg \\top \\Leftrightarrow \\bot",
        checker: new UnsatisfiableFormulaCreationChecker(),
        help: ""
    },
    "RemoveFALSE": {
        key: "RemoveFALSE",
        name: "Unsatisfiable Formula Elimination",
        tex: "(A \\lor \\bot) \\Leftrightarrow A",
        checker: new UnsatisfiableFormulaEliminationChecker(),
        help: ""
    },
}