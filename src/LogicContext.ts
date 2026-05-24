import {type SymbolWithArity} from "@fmfi-uk-1-ain-412/js-fol-parser";
import {createContext, useContext, useEffect, useMemo} from "react";
import {useDispatch} from "react-redux";
import {updateConstants, updateFunctions, updatePredicates} from "./features/language/languageSlice.ts";
import {contextFormulasUpdated} from "./features/transformations/transformationsSlice.ts";

export interface NamedFormula {
    name: string;
    formula: string;
}

export interface LogicContext {
    constants: Array<string>;
    predicates: Array<SymbolWithArity>;
    functions: Array<SymbolWithArity>;

    formulas: Array<NamedFormula>;
    axioms: Array<NamedFormula>;
    theorems: Array<NamedFormula>;
}

export const LogicContext = createContext<LogicContext | undefined>(
    undefined,
);

export function useLogicContext(): LogicContext | undefined {
    return useContext(LogicContext);
}

export function useUpdateLanguageContext() {
    const context = useLogicContext();
    const dispatch = useDispatch();

    const hasContext = !!context;

    const constants = context?.constants.join(", ");
    const predicates = context?.predicates.map((pred) => pred.name + "/" + pred.arity).join(", ");
    const functions = context?.functions.map((func) => func.name + "/" + func.arity).join(", ");

    useEffect(() => {
        if (!hasContext) return;

        dispatch(updateConstants(constants ?? ""));
        dispatch(updatePredicates(predicates ?? ""));
        dispatch(updateFunctions(functions ?? ""));
    }, [constants, predicates, functions, dispatch, hasContext]);

    return hasContext;
}

export function useFormulasContext() {
    const context = useLogicContext();

    const hasContext = !!context;

    const namedFormulas = context?.formulas;
    const axioms = context?.axioms;

    const formulasByType = useMemo<{axioms: NamedFormula[], formulas: NamedFormula[]}>(
        () => { return {
            axioms: axioms ?? [],
            formulas: namedFormulas ?? [],
        }},
        [namedFormulas, axioms],
    );

    const formulas = useMemo(
        () => [...formulasByType.axioms, ...formulasByType.formulas].map(
            (namedFormula) => namedFormula,
        ),
        [formulasByType]
    );

    return { hasContext, formulas, formulasByType };
}

export function useUpdateFormulasContext() {
    const {hasContext, formulas, formulasByType} = useFormulasContext();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!hasContext) return;

        console.log("USING EFFECT");
        dispatch(contextFormulasUpdated(formulas));
    }, [hasContext, dispatch, formulas]);

    return { hasContext, formulas, formulasByType };
}