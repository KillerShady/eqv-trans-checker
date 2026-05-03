import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {AppDispatch, RootState} from "../../state/store.ts";
import {type serializedAppState, serializedAppStateSchema} from "./validationSchema.ts";
import {z, ZodError} from "zod";

interface ImportExportState {
    error: string;
}

const initialState: ImportExportState = {
    error: "",
}

const importExportSlice = createSlice({
    name:"importExport",
    initialState,
    reducers: {
        // to be used by other slices with the use of extra reducers
        "importAppState": (state, _action: PayloadAction<serializedAppState>) => {
            state.error = "";
        },
        "setError": (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        "clearError": (state) => {
            state.error = "";
        },
    },
});

export const {importAppState, setError, clearError} = importExportSlice.actions;
export default importExportSlice.reducer;

export const exportAppState =
    ()=> (_: AppDispatch, getState: () => RootState) => {
        const state = getState();

        const json = getStateToJson(state);
        const blob = new Blob([json], { type: "application/json" });
        const downloadURL = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = downloadURL;
        downloadLink.download = "eqv-trans-checker.json";
        downloadLink.click();

        URL.revokeObjectURL(downloadURL);
    };

export function importAppStateFromJSON(importedState: string, dispatch: AppDispatch) {
    try {
        const json = JSON.parse(importedState);
        const serializedAppState = serializedAppStateSchema.parse(json);
        dispatch(importAppState(serializedAppState));
    } catch (error) {
        if (error instanceof ZodError) {
            const prettyError = z.prettifyError(error);
            console.error(prettyError);
            dispatch(setError(prettyError));
        } else if (error instanceof Error) {
            console.error(error);
            dispatch(setError(error.message));
        }
    }
}

export const getStateToJson = (state: RootState) => {
    return JSON.stringify(serializeState(state), null, 2);
}

export const selectImportError = (state: RootState) =>
    state.importExport.error;

function serializeState(state: RootState) {
    return {
        "language": state.language,
        "mainTask": state.mainTask,
    }
}