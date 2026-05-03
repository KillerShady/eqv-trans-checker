import {combineReducers, configureStore, type Middleware} from '@reduxjs/toolkit';
import languageReducer from "../features/language/languageSlice.ts";
import mainTaskReducer from "../features/mainTask/mainTaskSlice.ts";
import importExportReducer from "../features/import/importExportSlice.ts";

const reducer = combineReducers({
    language: languageReducer,
    mainTask: mainTaskReducer,
    importExport: importExportReducer,
});

export const createStore = (middleware?: Middleware) =>
    configureStore({
        reducer: reducer,
        middleware: (getDefaultMiddleware) =>
            middleware ? getDefaultMiddleware().concat(middleware) : getDefaultMiddleware()
        ,
    });

export type RootState = ReturnType<typeof reducer>;
export type AppState = ReturnType<typeof createStore>;
export type AppDispatch = AppState["dispatch"];
