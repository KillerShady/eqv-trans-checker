import TransformationChecker from "../../error checkers/TransformationChecker.ts";
import AssociativityChecker from "../../error checkers/AssociativityChecker.ts";
import CommutativityChecker from "../../error checkers/CommutativityChecker.ts";
import ContradictionChecker from "../../error checkers/ContradictionChecker.ts";
import ExcludedMiddleChecker from "../../error checkers/ExcludedMiddleChecker.ts";
import RenamingVariablesChecker from "../../error checkers/RenamingVariablesChecker.ts";
import QuantifierEliminationPropositionalChecker
    from "../../error checkers/QuantifierEliminationPropositionalChecker.ts";
import QuantifierEliminationChecker from "../../error checkers/QuantifierEliminationChecker.ts";
import ImplicationEliminationChecker from "../../error checkers/ImplicationEliminationChecker.ts";
import AbsorptionIdempotenceChecker from "../../error checkers/AbsorptionIdempotenceChecker.ts";
import DoubleNegationEliminationChecker from "../../error checkers/DoubleNegationEliminationChecker.ts";
import DistributivityQuantifierChecker from "../../error checkers/DistributivityQuantifierChecker.ts";
import DistributivityChecker from "../../error checkers/DistributivityChecker.ts";
import DeMorganCombinedChecker from "../../error checkers/DeMorganCombinedChecker.ts";
import SkolemizationChecker from "../../error checkers/SkolemizationChecker.ts";
import ReorderingChecker from "../../error checkers/ReorderingChecker.ts";
import IdentityChecker from "../../error checkers/IdentityChecker.ts";

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
        tex: "(A \\land (B \\land C)) \\Leftrightarrow ((A \\land B) \\land C) \\\\ (A \\lor (B \\lor C)) \\Leftrightarrow ((A \\lor B) \\lor C)",
        checker: new AssociativityChecker(),
        help: ""
    },
    "Reorder": {
        key: "Reorder",
        name: "A&C",
        tex: "(A \\land (B \\land C)) \\Leftrightarrow ((A \\land B) \\land C) \\\\ (A \\lor (B \\lor C)) \\Leftrightarrow ((A \\lor B) \\lor C) \\\\ (A \\land B) \\Leftrightarrow (B \\land A) \\\\ (A \\lor B) \\Leftrightarrow (B \\lor A)",
        checker: new ReorderingChecker(),
        help: ""
    },
    "Commutativity": {
        key: "Commutativity",
        name: "Commutativity",
        tex: "(A \\land B) \\Leftrightarrow (B \\land A) \\\\ (A \\lor B) \\Leftrightarrow (B \\lor A)",
        checker: new CommutativityChecker(),
        help: ""
    },
    /*"DeMorganPROP": {
        key: "DeMorganPROP",
        name: "DeMorgan Propositional",
        tex: "\\neg(A \\land B) \\Leftrightarrow (\\neg A \\lor \\neg B) \\\\ \\neg(A \\lor B) \\Leftrightarrow (\\neg A \\land \\neg B)",
        checker: new DeMorganChecker(),
        help: ""
    },
    "DeMorganQUANT": {
        key: "DeMorganQUANT",
        name: "DeMorgan Quantifier",
        tex: "\\neg \\exists x A \\Leftrightarrow \\forall x \\neg A  \\\\ \\neg \\forall x A \\Leftrightarrow \\exists x \\neg A",
        checker: new DeMorganQuantifierChecker(),
        help: ""
    },*/
    "DeMorganCOMBINED": {
        key: "DeMorganCOMBINED",
        name: "DeMorgan",
        tex: "\\neg\\neg A \\Leftrightarrow A \\\\ \\neg \\exists x A(x) \\Leftrightarrow \\forall x \\neg A(x) \\\\ \\neg \\forall x A(x) \\Leftrightarrow \\exists x \\neg A(x) \\\\ \\neg(A \\land B) \\Leftrightarrow (\\neg A \\lor \\neg B) \\\\ \\neg(A \\lor B) \\Leftrightarrow (\\neg A \\land \\neg B) \\\\ \\neg \\bot \\Leftrightarrow \\top \\\\ \\neg \\top \\Leftrightarrow \\bot",
        checker: new DeMorganCombinedChecker(),
        help: ""
    },
    "Distributivity": {
        key: "Distributivity",
        name: "Distributivity Propositional",
        tex: "(A \\land (B \\lor C)) \\Leftrightarrow ((A \\land B) \\lor (A \\land C)) \\\\ (A \\lor (B \\land C)) \\Leftrightarrow ((A \\lor B) \\land (A \\lor C))",
        checker: new DistributivityChecker(),
        help: ""
    },
    "DistributivityQUANT": {
        key: "DistributivityQUANT",
        name: "Distributivity Quantifier",
        tex: "\\exists x(A(x) \\lor B(x)) \\Leftrightarrow (\\exists x A(x) \\lor \\exists x B(x)) \\\\ \\forall x (A(x) \\land B(x)) \\Leftrightarrow (\\forall x A(x) \\land \\forall x B(x))",
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
    "AbsorptionIdem": {
        key: "AbsorptionIdem",
        name: "Absorption and Idempotence",
        tex: "(A \\land A) \\Leftrightarrow A \\\\ (A \\lor A) \\Leftrightarrow A \\\\ (A \\lor (A \\land B)) \\Leftrightarrow A \\\\ (A \\land (A \\lor B)) \\Leftrightarrow A \\\\ A \\lor \\top \\Leftrightarrow \\top \\\\ A \\land \\bot \\Leftrightarrow \\bot",
        checker: new AbsorptionIdempotenceChecker(),
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
        tex: "\\exists x D \\Leftrightarrow D \\\\ \\forall x D \\Leftrightarrow D",
        checker: new QuantifierEliminationChecker(),
        help: ""
    },
    "RemoveQUANTPROP": {
        key: "RemoveQUANTPROP",
        name: "Quantifier Prenexing",
        tex: "\\exists x A(x) \\lor D \\Leftrightarrow \\exists x(A(x) \\lor D) \\\\ \\forall x A(x) \\lor D \\Leftrightarrow \\forall x (A(x) \\lor D) \\\\ \\exists x A(x) \\land D \\Leftrightarrow \\exists x (A(x) \\land D) \\\\ \\forall x A(x) \\land D \\Leftrightarrow \\forall x (A(x) \\land D)",
        checker: new QuantifierEliminationPropositionalChecker(),
        help: ""
    },
    "RenameVAR": {
        key: "RenameVAR",
        name: "Renaming Variables",
        tex: "\\exists x A(x) \\Leftrightarrow \\exists y A(y)\\{x \\mapsto y\\} \\\\ \\forall x A(x) \\Leftrightarrow \\forall y A(y)\\{x \\mapsto y\\}",
        checker: new RenamingVariablesChecker(),
        help: ""
    },
    "Skolem": {
        key: "Skolem",
        name: "Skolemization",
        tex: "...\\forall x_1 (...\\forall x_n ...(\\exists y A(y))...)... \\Rightarrow \\\\ A \\{ y \\mapsto f(x_1,...,x_n) \\}",
        checker: new SkolemizationChecker(),
        help: ""
    },
    "CreateTRUE": {
        key: "ExcludedMiddle",
        name: "Excluded middle",
        tex: "(A \\lor \\neg A) \\Leftrightarrow \\top",
        checker: new ExcludedMiddleChecker(),
        help: ""
    },
    /*"RemoveTRUE": {
        key: "RemoveTRUE",
        name: "Tautology Elimination",
        tex: "(A \\land \\top) \\Leftrightarrow A",
        checker: new TautologyEliminationChecker(),
        help: ""
    },*/
    "CreateFALSE": {
        key: "CreateFALSE",
        name: "Contradiction",
        tex: "(A \\land \\neg A) \\Leftrightarrow \\bot",
        checker: new ContradictionChecker(),
        help: ""
    },
    /*"RemoveFALSE": {
        key: "RemoveFALSE",
        name: "Unsatisfiable Formula Elimination",
        tex: "(A \\lor \\bot) \\Leftrightarrow A",
        checker: new UnsatisfiableFormulaEliminationChecker(),
        help: ""
    },*/
    "Identity": {
        key: "Identity",
        name: "Identity",
        tex: "(A \\lor \\bot) \\Leftrightarrow A \\\\ (A \\land \\top) \\Leftrightarrow A",
        checker: new IdentityChecker(),
        help: ""
    },
}