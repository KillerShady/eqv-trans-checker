import {configureStore} from '@reduxjs/toolkit';
import languageReducer from "../features/language/languageSlice.ts";
import mainTaskReducer from "../features/mainTask/mainTaskSlice.ts";
import importExportSlice from "../features/import/importExportSlice.ts";

export const store = configureStore({
    reducer: {
        language: languageReducer,
        mainTask: mainTaskReducer,
        importExport: importExportSlice,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store['dispatch'];