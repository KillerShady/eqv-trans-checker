import {createSelector, createSlice} from "@reduxjs/toolkit";
import type {RootState} from "../store.ts";
import {
    parseConstants,
    parsePredicates,
    parseFunctions,
    SyntaxError, type SymbolWithArity,
} from "@fmfi-uk-1-ain-412/js-fol-parser";

interface LanguageState {
    constants: string;
    predicates: string;
    functions: string;
    parsedConstants: string[];
    parsedPredicates: SymbolWithArity[];
    parsedFunctions: SymbolWithArity[];
}

const initialState: LanguageState = {
    constants: "",
    predicates: "",
    functions: "",
    parsedConstants: [],
    parsedPredicates: [],
    parsedFunctions: [],
}

const languageSlice = createSlice({
    name:"language",
    initialState,
    reducers: {
        "updateConstants": (state, action) => {
            state.constants = action.payload;
            const parsed = getConstantsError(state.constants);
            if (parsed.parsed) {
                state.parsedConstants = parsed.parsed;
            }
        },
        "updatePredicates": (state, action) => {
            state.predicates = action.payload;
            const parsed = getPredicatesError(state.predicates);
            if (parsed.parsed) {
                state.parsedPredicates = parsed.parsed;
            }
        },
        "updateFunctions": (state, action) => {
            state.functions = action.payload;
            const parsed = getFunctionsError(state.functions);
            if (parsed.parsed) {
                state.parsedFunctions = parsed.parsed;
            }
        },
    },
})

export const { updateConstants, updateFunctions, updatePredicates } = languageSlice.actions;
export default languageSlice.reducer;

export const selectConstantsText = (state: RootState) =>
    state.language.constants;
export const selectPredicatesText = (state: RootState) =>
    state.language.predicates;
export const selectFunctionsText = (state: RootState) =>
    state.language.functions;
export const selectParsedConstants = (state: RootState) =>
    state.language.parsedConstants;
export const selectParsedPredicates = (state: RootState) =>
    state.language.parsedPredicates;
export const selectParsedFunctions = (state: RootState) =>
    state.language.parsedFunctions;

export const selectConstantsError = createSelector(
    [selectConstantsText],
    (constants) => getConstantsError(constants)
)

export const selectPredicatesError = createSelector(
    [selectPredicatesText],
    (predicates) => getPredicatesError(predicates)
)

export const selectFunctionsError = createSelector(
    [selectFunctionsText],
    (functions) => getFunctionsError(functions)
)

const getConstantsError = (constants: string) => {
    try {
        const parsed = parseConstants(constants);
        parsed.forEach((element) => {
            if (parsed.filter((element2) => element2 === element).length > 1) {
                throw new Error("Constant " + element + " is already defined.");
            }
        })
        return {parsed: parsed};
    } catch (error) {
        if (error instanceof SyntaxError || error instanceof Error) {
            return {error: error};
        }
        throw error;
    }
}
const getPredicatesError = (predicates: string) => {
    try {
        const parsed = parsePredicates(predicates);
        parsed.forEach((element) => {
            if (parsed.filter((element2) => element2.name === element.name).length > 1) {
                throw new Error("Predicate " + element.name + " is already defined.");
            }
        })
        return {parsed: parsed};
    } catch (error) {
        if (error instanceof SyntaxError || error instanceof Error) {
            return {error: error};
        }
        throw error;
    }
}
const getFunctionsError = (functions: string) => {
    try {
        const parsed = parseFunctions(functions);
        parsed.forEach((element) => {
            if (parsed.filter((element2) => element2.name === element.name).length > 1) {
                throw new Error("Function " + element.name + " is already defined.");
            }
        })
        return {parsed: parsed};
    } catch (error) {
        if (error instanceof SyntaxError || error instanceof Error) {
            return {error: error};
        }
        throw error;
    }
}

export const selectSymbolsClash = createSelector(
    [selectParsedConstants, selectParsedPredicates, selectParsedFunctions],
    (constants, preds, funcs) => {
        let constantsClash, predicatesClash, functionsClash: Error;
        const predicates = new Set(preds.map((element) => element.name));
        const functions = new Set(funcs.map((element) => element.name));

        predicates.forEach((element) => {
            if (functions.has(element)) {
                predicatesClash = new Error("Predicate " + element + " is also defined in functions.");
                functionsClash = new Error("Function " + element + " is also defined in predicates.");
            }
        });

        constants.forEach((element: string) => {
            if (predicates.has(element)) {
                constantsClash = new Error("Constant " + element + " is also defined in predicates.");
                predicatesClash = new Error("Predicate " + element + " is also defined in constants.");
            }

            if (functions.has(element)) {
                constantsClash = new Error("Constant " + element + " is also defined in functions.");
                functionsClash = new Error("Function " + element + " is also defined in constants.");
            }
        });

        return {constantsClash: constantsClash,
                predicatesClash: predicatesClash,
                functionsClash: functionsClash};
    }
);

export const selectLanguage = createSelector(
    [selectParsedConstants, selectParsedPredicates, selectParsedFunctions],
    (consts, preds, funcs) => {
        const constants = new Set(consts);
        const predicates = new Map(preds.map(({ name, arity }) => [name, arity]))
        const functions = new Map(funcs.map(({ name, arity }) => [name, arity]))

        return {
            isConstant: (symbol: string): boolean => constants.has(symbol),
            isPredicate: (symbol: string): boolean => predicates.has(symbol),
            isFunction: (symbol: string): boolean => functions.has(symbol),
            isVariable: (symbol: string): boolean => !constants.has(symbol) && !predicates.has(symbol) && !functions.has(symbol),
            checkFunctionArity: (symbol: string,
                                 args: Term[],
                                 ee: { expected: (arg0: string) => void}): void => {
                const arity = functions.get(symbol);
                if (arity !== args.length) {
                    ee.expected(arity + " argument" + (arity == 1 ? "" : "s") + " to " + symbol);
                }
            },
            checkPredicateArity: (symbol: string,
                                  args: Term[],
                                  ee: { expected: (arg0: string) => void}): void => {
                const arity = predicates.get(symbol);
                if (arity !== args.length) {
                    ee.expected(arity + " argument" + (arity == 1 ? "" : "s") + " to " + symbol);
                }
            },
        }
    }
);