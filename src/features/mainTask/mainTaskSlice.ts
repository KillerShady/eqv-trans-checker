import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {RootState} from "../../state/store.ts"
import {parseFormulaWithPrecedence} from "@fmfi-uk-1-ain-412/js-fol-parser";
import {
    selectAllLanguageSymbols,
    selectLanguage,
} from "../language/languageSlice.ts";
import {getFactories} from "../../model";
import {importAppState} from "../import/importExportSlice.ts";
import type {serializedAppState} from "../import/validationSchema.ts";
import {EquivalentTransformationsRecord} from "./EquivalentTransformationsRecord.ts";
import {
    parseSkolemSymbols,
    SyntaxError, type SymbolWithArity,
} from "@fmfi-uk-1-ain-412/js-fol-parser";
import SkolemizationChecker from "../../error checkers/SkolemizationChecker.ts";

interface transformationState {
    id: number,
    formulas: number[],
}

interface formulaState {
    id: number,
    formula: string,
    operation: string,
    prevFormula?: number,
    name?: string,
}

interface skolemSymbolsState {
    text: string,
    constants: string[],
    functions: SymbolWithArity[],
}

interface MainTaskState {
    transSequences: number[];
    transSequenceKey: number;
    transformations: Record<number, transformationState>;
    formulas: Record<number, formulaState>;
    formulasKey: number;
    skolemSymbols: Record<number, skolemSymbolsState>;
    contextFormulaNames: string[];
}

const initialState: MainTaskState = {
    transSequences: [0],
    transSequenceKey: 1,
    transformations: {0: {id: 0, formulas: [0]}},
    formulas: {0: {id: 0, formula: "", operation: 'Operation'}},
    formulasKey: 1,
    skolemSymbols: {},
    contextFormulaNames: [],
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
            state.transformations[action.payload].formulas.forEach((formula) => {
                const name = state.formulas[formula].name;
                if (name !== undefined) {
                    const nameIndex = state.contextFormulaNames.indexOf(name);
                    if (nameIndex > -1) {
                        state.contextFormulaNames.splice(nameIndex, 1);
                    }
                }
                delete state.formulas[formula];
                delete state.skolemSymbols[formula];
            });
            delete state.transformations[action.payload];
        },
        "formulaAdded": (state, action) => {
            state.formulas[state.formulasKey] = {id: state.formulasKey,
                                                 formula: state.formulas[action.payload.prevFormula].formula,
                                                 operation: action.payload.operation,
                                                 prevFormula: action.payload.prevFormula};
            const formulas = state.transformations[action.payload.transformation].formulas;
            const prevFormulaIndex = formulas.indexOf(action.payload.prevFormula);
            if (prevFormulaIndex < formulas.length - 1) {
                state.formulas[formulas[prevFormulaIndex + 1]].prevFormula = state.formulasKey;
            }
            formulas.splice(formulas.indexOf(action.payload.prevFormula)+1, 0, state.formulasKey);
            if (action.payload.operation === EquivalentTransformationsRecord["Skolem"].key) {
                state.skolemSymbols[state.formulasKey] = {text: "", constants: [], functions: []};
            }
            state.formulasKey++;
        },
        "formulaRemoved": (state, action) => {
            const formulas = state.transformations[action.payload.transformation].formulas;
            const index = formulas.indexOf(action.payload.id);
            if (index < formulas.length - 1) {
                state.formulas[formulas[index + 1]].prevFormula = state.formulas[action.payload.id].prevFormula;
            }
            formulas.splice(index, 1);
            const name = state.formulas[action.payload.id].name;
            if (name !== undefined) {
                const nameIndex = state.contextFormulaNames.indexOf(name);
                if (nameIndex > -1) {
                    state.contextFormulaNames.splice(nameIndex, 1);
                }
            }
            delete state.formulas[action.payload.id];
            delete state.skolemSymbols[action.payload.id];
        },
        "formulaModified": (state, action) => {
            state.formulas[action.payload.id].formula = action.payload.formula;
            if (state.formulas[action.payload.id].operation === EquivalentTransformationsRecord["Skolem"].key &&
                action.payload.operation !== EquivalentTransformationsRecord["Skolem"].key) {
                delete state.skolemSymbols[action.payload.id];
            } else if (state.formulas[action.payload.id].operation !== EquivalentTransformationsRecord["Skolem"].key &&
                       action.payload.operation === EquivalentTransformationsRecord["Skolem"].key) {
                state.skolemSymbols[action.payload.id] = {text: "", constants: [], functions: []};
            }
            state.formulas[action.payload.id].operation = action.payload.operation;
        },
        "skolemSymbolsUpdated": (state, action) => {
            state.skolemSymbols[action.payload.id].text = action.payload.skolemSymbols;
            const parsed = getSkolemSymbolsError(action.payload.skolemSymbols);
            if (parsed.parsed) {
                state.skolemSymbols[action.payload.id].constants =
                    parsed.parsed
                    .filter((skolem) => skolem.arity === 0)
                    .map((skolem) => skolem.name);
                state.skolemSymbols[action.payload.id].functions =
                    parsed.parsed
                        .filter((skolem) => skolem.arity !== 0);
            }
        },
        "contextFormulaAdded": (state, action) => {
            state.transSequences.push(state.transSequenceKey);
            state.transformations[state.transSequenceKey] = {id: state.transSequenceKey, formulas: [state.formulasKey]};
            state.formulas[state.formulasKey] = {id: state.formulasKey, formula: action.payload.formula, operation: 'Operation', name: action.payload.name};
            state.transSequenceKey++;
            state.formulasKey++;
            state.contextFormulaNames.push(action.payload.name);
        },
        "allContextFormulasAdded": (state, action) => {
            for (const formula of action.payload) {
                state.transSequences.push(state.transSequenceKey);
                state.transformations[state.transSequenceKey] = {id: state.transSequenceKey, formulas: [state.formulasKey]};
                state.formulas[state.formulasKey] = {id: state.formulasKey, formula: formula.formula, operation: 'Operation', name: formula.name};
                state.transSequenceKey++;
                state.formulasKey++;
                state.contextFormulaNames.push(formula.name);
            }
        },
        "contextFormulasUpdated": (state, action) => {
            for (const transId of state.transSequences) {
                const formulaId = state.transformations[transId].formulas[0];
                const formulaName = state.formulas[formulaId].name;
                if (formulaName !== undefined) {
                    const formulaText = action.payload[formulaName];
                    if (formulaText !== undefined) {
                        state.formulas[formulaId].formula = formulaText;
                    }
                }
            }
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
            const seenContextFormulas: string[] = [];
            const seenSkolemFormulas = new Set<number>();
            let maxFormulasKey = 0;
            for (const transformation of Object.values(importedState.transformations)) {
                const contextName = importedState.formulas[transformation.formulas[0]].name;
                if (contextName !== undefined) {
                    seenContextFormulas.push(contextName);
                }
                for (const formula of transformation.formulas) {
                    seenFormulas.add(formula);
                    maxFormulasKey = Math.max(maxFormulasKey, formula);
                    if (importedState.formulas[formula].operation === EquivalentTransformationsRecord["Skolem"].key) {
                        seenSkolemFormulas.add(formula);
                    }
                }
            }
            for (const key in importedState.formulas) {
                if (! seenFormulas.has(parseInt(key))) {
                    delete importedState.formulas[key];
                }
            }
            for (const key in importedState.skolemSymbols) {
                if (! seenSkolemFormulas.has(parseInt(key))) {
                    delete importedState.skolemSymbols[key];
                }
            }
            for (const key of seenSkolemFormulas) {
                if (importedState.skolemSymbols[key] === undefined) {
                    importedState.skolemSymbols[key] = {text: "", constants: [], functions: []};
                }
            }
            importedState.formulasKey = maxFormulasKey+1;
            importedState.contextFormulaNames = seenContextFormulas;
            return importedState;
        })
    },
});

export const {transSequenceAdded, transSequenceRemoved, formulaAdded,
              formulaRemoved, formulaModified, skolemSymbolsUpdated,
              contextFormulaAdded, allContextFormulasAdded, contextFormulasUpdated} = MainTaskSlice.actions;
export default MainTaskSlice.reducer;

export const selectTransSequences = (state: RootState) =>
    state.mainTask.transSequences;
export const selectTransformations = (state: RootState, id: number) =>
    state.mainTask.transformations[id].formulas;
export const selectFormulaByID = (state: RootState, id: number) =>
    state.mainTask.formulas[id];
export const selectAllFormulas = (state: RootState) =>
    state.mainTask.formulas;
export const selectSkolemSymbols = (state: RootState) =>
    state.mainTask.skolemSymbols;
export const selectSkolemSymbolsTextByID = (state: RootState, id: number) =>
    state.mainTask.skolemSymbols[id]?.text;
export const selectContextFormulasNames = (state: RootState) =>
    state.mainTask.contextFormulaNames;

export const selectParsedSkolemSymbolsByIDs = createSelector(
    [selectTransformations, selectSkolemSymbols, (_state, _TransId, id) => id],
    (formulas, skolemSymbols, id) => {
        const result: {constants: string[], functions: SymbolWithArity[]} = {constants: [], functions: []};
        for (const formula of formulas) {
            if (skolemSymbols[formula] !== undefined) {
                result.constants = [...result.constants, ...skolemSymbols[formula].constants];
                result.functions = [...result.functions, ...skolemSymbols[formula].functions];
            }
            if (formula === id) {
                break;
            }
        }
        return result;
    }
);

export const selectParsedFormula = createSelector(
    [(state, _TransId, id) => selectFormulaByID(state, id),
     (state, TransId, id) => selectLanguage(state, selectParsedSkolemSymbolsByIDs(state, TransId, id))],
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
);

export const selectTransformationError = createSelector(
    [(state, TransId, prevId) => selectParsedFormula(state, TransId, prevId),
     (state, TransId, _prevId, id) => selectParsedFormula(state, TransId, id),
     (state, _TransId, _prevId, id) => selectFormulaByID(state, id).operation,
     (state, TransId, _prevId, id) => selectParsedSkolemSymbolsByIDs(state, TransId, id)],
    (original, transformed, operation, skolemSymbols) => {
        if (!original.parsed || !transformed.parsed) return {validated: false}
        const checker = EquivalentTransformationsRecord[operation]?.checker;
        if (!checker) return {error: new Error("Operation was not selected!"),
                              validated: true}
        if (checker instanceof SkolemizationChecker) {
            checker.reset(skolemSymbols);
        }
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
);

export const selectSkolemSymbolsErrorByID = createSelector(
    [selectSkolemSymbolsTextByID],
    (skolemSymbols) => getSkolemSymbolsError(skolemSymbols)
);

const getSkolemSymbolsError = (skolemSymbols: string) => {
    if (skolemSymbols === undefined) {
        return {};
    }
    try {
        const parsed = parseSkolemSymbols(skolemSymbols);
        parsed.forEach((element) => {
            if (parsed.filter((element2) => element2.name === element.name).length > 1) {
                throw new Error("Skolem symbol " + element.name + " is already defined.");
            }
        })
        return {parsed: parsed};
    } catch (error) {
        if (error instanceof SyntaxError || error instanceof Error) {
            return {error: error};
        }
        throw error;
    }
};

export const selectSkolemConstantSymbolsClash = createSelector(
    [selectAllLanguageSymbols,
     selectSkolemSymbols,
     (_state, id) => id],
    (languageSymbols, skolemSymbols, id) => {
        if (skolemSymbols[id] === undefined) {
            return undefined;
        }

        for (const constant of skolemSymbols[id].constants) {
            if (languageSymbols.has(constant)) {
                return new Error("Skolem constant " + constant + " is already a language symbol!.");
            }
        }
        for (const funct of skolemSymbols[id].functions) {
            if (languageSymbols.has(funct.name)) {
                return new Error("Skolem function " + funct.name + " is already a language symbol!.");
            }
        }

        const usedSkolemSymbols = new Set<string>();
        for (const key in skolemSymbols) {
            if (parseInt(key) === id) continue;
            skolemSymbols[key].constants.forEach(cons => {usedSkolemSymbols.add(cons)});
            skolemSymbols[key].functions.forEach(func => {usedSkolemSymbols.add(func.name)});
        }
        for (const constant of skolemSymbols[id].constants) {
            if (usedSkolemSymbols.has(constant)) {
                return new Error("Skolem constant " + constant + " was previously defined!.");
            }
        }
        for (const funct of skolemSymbols[id].functions) {
            if (usedSkolemSymbols.has(funct.name)) {
                return new Error("Skolem function " + funct.name + " was previously defined!.");
            }
        }

        return undefined;
    }
);
