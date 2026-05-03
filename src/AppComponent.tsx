import type {Middleware} from "@reduxjs/toolkit";
import {useEffect} from "react";
import {Provider} from "react-redux";
import App from "./App.tsx";
import type {JSX} from "react/jsx-runtime";
import {createStore, type AppState} from "./state/store.ts";
import {getStateToJson, importAppStateFromJSON} from "./features/import/importExportSlice.ts";
import { LogicContext } from "./LogicContext.ts";

interface PrepareResult {
    instance: any;
    getState: (instance: any) => any;
}

export function prepare(initialState?: any): PrepareResult {
    const storeListener: Middleware<object, AppState> =
        () => (next) => (action) => {
            if (instance?.handleStoreChange) //&& filterAction(action))
                instance.handleStoreChange();

            return next(action);
        };

    const store = createStore(storeListener);
    const instance: {
        store: AppState;
        handleStoreChange: (() => void) | undefined;
    } = { store, handleStoreChange: undefined };

    const getState = (instance: any) => {
        const storeState = instance.store.getState();
        return getStateToJson(storeState);
    };

    if (initialState !== null) {
        importAppStateFromJSON(initialState, store.dispatch);
    }

    return { instance, getState };
}

interface AppComponentProps {
    instance: any;
    onStateChange: () => void;
    isEdited: boolean;
    context?: LogicContext;
}

export function AppComponent({instance,
                              onStateChange,
                              isEdited,
                              context,
                             }: AppComponentProps): JSX.Element {
    const appstore = instance.store;

    useEffect(() => {
        instance.handleStoreChange = onStateChange;
        return () => (instance.handleStoreChange = undefined);
    }, [instance, onStateChange]);

    return (
        <Provider store={appstore}>
            <LogicContext.Provider value={context}>
                <App viewOnly={isEdited}/>
            </LogicContext.Provider>
        </Provider>
    );
}

export default { prepare, AppComponent };