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
            const parsed = getConstantError(state.constants);
            if (parsed.parsed) {
                state.parsedConstants = parsed.parsed;
            }
        },
        "updatePredicates": (state, action) => {
            state.predicates = action.payload;
            const parsed = getPredicateError(state.predicates);
            if (parsed.parsed) {
                state.parsedPredicates = parsed.parsed;
            }
        },
        "updateFunctions": (state, action) => {
            state.functions = action.payload;
            const parsed = getFunctionError(state.functions);
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

export const selectConstantsError = createSelector(
    [selectConstantsText],
    (constants) => getConstantError(constants)
)

export const selectPredicatesError = createSelector(
    [selectPredicatesText],
    (predicates) => getPredicateError(predicates)
)

export const selectFunctionsError = createSelector(
    [selectFunctionsText],
    (functions) => getFunctionError(functions)
)

const getConstantError = (constants: string) => {
    try {
        const parsed = parseConstants(constants);
        parsed.forEach((element) => {
            if (parsed.filter((element2) => element2 === element).length > 1) {
                throw new Error("Constant" + element + "is already defined");
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
const getPredicateError = (predicates: string) => {
    try {
        const parsed = parsePredicates(predicates);
        parsed.forEach((element) => {
            if (parsed.filter((element2) => element2.name === element.name).length > 1) {
                throw new Error("Predicate" + element.name + "is already defined");
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
const getFunctionError = (functions: string) => {
    try {
        const parsed = parseFunctions(functions);
        parsed.forEach((element) => {
            if (parsed.filter((element2) => element2.name === element.name).length > 1) {
                throw new Error("Function" + element.name + "is already defined");
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