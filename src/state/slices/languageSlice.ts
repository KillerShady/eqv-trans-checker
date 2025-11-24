import {createSlice} from "@reduxjs/toolkit";
import type {RootState} from "../store.ts";

interface LanguageState {
    constants: string;
    predicates: string;
    functions: string;
}

const initialState: LanguageState = {
    constants: "",
    predicates: "",
    functions: "",
}

const languageSlice = createSlice({
    name:"language",
    initialState,
    reducers: {
        "updateConstants": (state, action) => {
            state.constants = action.payload;
        },
        "updateFunctions": (state, action) => {
            state.functions = action.payload;
        },
        "updatePredicates": (state, action) => {
            state.predicates = action.payload;
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