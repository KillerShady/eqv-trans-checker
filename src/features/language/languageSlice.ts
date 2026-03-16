import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../../state/store.ts";
import {
    parseConstants,
    parsePredicates,
    parseFunctions,
    SyntaxError, type SymbolWithArity,
} from "@fmfi-uk-1-ain-412/js-fol-parser";
import {Language} from "../../model"
import {importAppState} from "../import/importExportSlice.ts";
import type {serializedAppState} from "../import/validationSchema.ts";

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
    extraReducers: (builder) => {
        builder.addCase(importAppState, (_state, action: PayloadAction<serializedAppState>) => {
            const parsedConstants = getConstantsError(action.payload.language.constants);
            if (parsedConstants.parsed) {
                action.payload.language.parsedConstants = parsedConstants.parsed;
            }
            const parsedPredicates = getPredicatesError(action.payload.language.predicates);
            if (parsedPredicates.parsed) {
                action.payload.language.parsedPredicates = parsedPredicates.parsed;
            }
            const parsedFunctions = getFunctionsError(action.payload.language.functions);
            if (parsedFunctions.parsed) {
                action.payload.language.parsedFunctions = parsedFunctions.parsed;
            }
            return action.payload.language;
        })
    },
});

export const {updateConstants, updateFunctions, updatePredicates} = languageSlice.actions;
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

export const getConstantsError = (constants: string) => {
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
export const getPredicatesError = (predicates: string) => {
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
export const getFunctionsError = (functions: string) => {
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
        let constantsClash, predicatesClash, functionsClash: Error | undefined;
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
        const predicates = new Map(preds.map(({ name, arity }) => [name, arity]));
        const functions = new Map(funcs.map(({ name, arity }) => [name, arity]));

        return new Language(constants, predicates, functions);
    }
);