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
        "importAppState": (_state, _action: PayloadAction<serializedAppState>) => {},
    },
});

export const {importAppState} = importExportSlice.actions;
export default importExportSlice.reducer;

export const exportAppState =
    ()=> (_: AppDispatch, getState: () => RootState) => {
        const state = getState();

        const json = JSON.stringify(state, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const downloadURL = URL.createObjectURL(blob);

        const downloadLink = document.createElement("a");
        downloadLink.href = downloadURL;
        downloadLink.download = "eqv-transformation-checker.json";
        downloadLink.click();

        URL.revokeObjectURL(downloadURL);
    };