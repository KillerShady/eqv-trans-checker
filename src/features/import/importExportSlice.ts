import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {AppDispatch, RootState} from "../../state/store.ts";
import type {serializedAppState} from "./validationSchema.ts";

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

        const json = JSON.stringify(serializeState(state), null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const downloadURL = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = downloadURL;
        downloadLink.download = "eqv-transformation-checker.json";
        downloadLink.click();

        URL.revokeObjectURL(downloadURL);
    };

export const selectImportError = (state: RootState) =>
    state.importExport.error;

function serializeState(state: RootState) {
    return {
        "language": state.language,
        "mainTask": state.mainTask,
    }
}