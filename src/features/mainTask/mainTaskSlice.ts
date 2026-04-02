import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../../state/store.ts"
import {parseFormulaWithPrecedence} from "@fmfi-uk-1-ain-412/js-fol-parser";
import {selectLanguage} from "../language/languageSlice.ts";
import {getFactories} from "../../model";
import {importAppState} from "../import/importExportSlice.ts";
import type {serializedAppState} from "../import/validationSchema.ts";
import {EquivalentTransformationsRecord} from "./EquivalentTransformationsRecord.ts";

interface transformationState {
    id: number,
    formulas: number[],
}

interface formulaState {
    id: number,
    formula: string,
    operation: string,
    prevFormula?: number,
}

interface MainTaskState {
    transSequences: number[];
    transSequenceKey: number;
    transformations: Record<number, transformationState>;
    formulas: Record<number, formulaState>;
    formulasKey: number;
}

const initialState: MainTaskState = {
    transSequences: [0],
    transSequenceKey: 1,
    transformations: {0: {id: 0, formulas: [0]}},
    formulas: {0: {id: 0, formula: "", operation: 'Operation'}},
    formulasKey: 1,
}

const MainTaskSlice = createSlice({
    name:"mainTask",
    initialState,
    reducers: {
        "transSequenceAdded": (state) => {
            state.transSequences.push(state.transSequenceKey);
            state.transformations[state.transSequenceKey] = {id: state.transSequenceKey, formulas: [state.formulasKey]};
            state.formulas[state.formulasKey] = {id: state.formulasKey, formula: "", operation: 'Operation'};
            state.transSequenceKey++;
            state.formulasKey++;
        },
        "transSequenceRemoved": (state, action) => {
            state.transSequences.splice(state.transSequences.indexOf(action.payload), 1);
            state.transformations[action.payload].formulas.forEach((formula) => {delete state.formulas[formula]});
            delete state.transformations[action.payload];
        },
        "formulaAdded": (state, action) => {
            state.formulas[state.formulasKey] = {id: state.formulasKey, formula: "", operation: "Operation", prevFormula: action.payload.prevFormula};
            const formulas = state.transformations[action.payload.transformation].formulas;
            const index = formulas.indexOf(action.payload.prevFormula);
            if (index < formulas.length - 1) {
                state.formulas[index + 1].prevFormula = state.formulasKey;
            }
            formulas.splice(formulas.indexOf(action.payload.prevFormula)+1, 0, state.formulasKey);
            state.formulasKey++;
        },
        "formulaRemoved": (state, action) => {
            const formulas = state.transformations[action.payload.transformation].formulas;
            const index = formulas.indexOf(action.payload.id);
            if (index < formulas.length - 1) {
                state.formulas[formulas[index + 1]].prevFormula = state.formulas[action.payload.id].prevFormula;
            }
            formulas.splice(index, 1);
            delete state.formulas[action.payload.id];
        },
        "formulaModified": (state, action) => {
            state.formulas[action.payload.id].formula = action.payload.formula;
            state.formulas[action.payload.id].operation = action.payload.operation;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(importAppState, (_state, action: PayloadAction<serializedAppState>) => {
            const importedState: MainTaskState = action.payload.mainTask;

            const seenTransformations = new Set(importedState.transSequences);
            for (const key in importedState.transformations) {
                if (! seenTransformations.has(parseInt(key))) {
                    delete importedState.transformations[key];
                }
            }
            importedState.transSequenceKey = Math.max(...importedState.transSequences)+1;

            const seenFormulas = new Set<number>();
            let maxFormulasKey = 0;
            for (const transformation of Object.values(importedState.transformations)) {
                for (const formula of transformation.formulas) {
                    seenFormulas.add(formula);
                    maxFormulasKey = Math.max(maxFormulasKey, formula);
                }
            }
            for (const key in importedState.formulas) {
                if (! seenFormulas.has(parseInt(key))) {
                    delete importedState.formulas[key];
                }
            }
            importedState.formulasKey = maxFormulasKey+1;

            return importedState;
        })
    },
});

export const {transSequenceAdded, transSequenceRemoved, formulaAdded, formulaRemoved, formulaModified} = MainTaskSlice.actions;
export default MainTaskSlice.reducer;

export const selectTransSequences = (state: RootState) =>
    state.mainTask.transSequences;
export const selectTransformations = (state: RootState, id: number) =>
    state.mainTask.transformations[id].formulas;
export const selectFormulaByID = (state: RootState, id: number) =>
    state.mainTask.formulas[id];

export const selectParsedFormula = createSelector(
    [selectFormulaByID, selectLanguage],
    (formula, language) => {
        try {
            const parsed = parseFormulaWithPrecedence(
                formula.formula,
                language.getParserLanguage(),
                getFactories(language)
            );
            return {parsed: parsed};
        } catch (error) {
            if (error instanceof Error || error instanceof SyntaxError) {
                return {error: error};
            }
            throw error;
        }
    }
)

export const selectTransformationError = createSelector(
    [(state, prevId) => selectParsedFormula(state, prevId),
     (state, _prevId, id) => selectParsedFormula(state, id),
     (state, _prevId, id) => selectFormulaByID(state, id).operation],
    (original, transformed, operation) => {
        if (!original.parsed || !transformed.parsed) return {validated: false}
        const checker = EquivalentTransformationsRecord[operation]?.checker;
        if (!checker) return {error: new Error("Operation was not selected!"),
                              validated: true}
        const result = checker.checkForError(original.parsed, transformed.parsed);
        if (result.isEquivalent()) return {validated: true};
        if (result.isIdentical()) {
            return {error: new Error("Formula is identical to previous formula!"),
                    validated: true};
        }
        console.log(result.errors.length);
        return {error: result.errors[result.errors.length - 1],
                validated: true};
    }
)
