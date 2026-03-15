import {configureStore} from '@reduxjs/toolkit';
import languageReducer from "./slices/languageSlice.ts";
import mainTaskReducer from "./slices/mainTaskSlice.ts";

export const store = configureStore({
    reducer: {
        language: languageReducer,
        mainTask: mainTaskReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store['dispatch'];