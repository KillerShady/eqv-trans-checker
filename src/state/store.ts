import {configureStore} from '@reduxjs/toolkit';
import languageReducer from "../features/language/languageSlice.ts";
import mainTaskReducer from "../features/mainTask/mainTaskSlice.ts";

export const store = configureStore({
    reducer: {
        language: languageReducer,
        mainTask: mainTaskReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store['dispatch'];