import {Button, Stack, Form} from "react-bootstrap";
import type {AppDispatch} from "../../state/store.ts";
import {useDispatch} from "react-redux";
import {type ChangeEvent, useRef} from "react";
import {exportAppState, importAppState, setError} from "./importExportSlice.ts";
import {serializedAppStateSchema} from "./validationSchema.ts";
import {z, ZodError} from "zod";
import ImportedErrorDisplay from "./ImportErrorDisplay.tsx";

export default function ImportExportComponent() {
    const dispatch: AppDispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImport = () => {
        fileInputRef.current?.click();
    };
    const handleExport = () => {
        dispatch(exportAppState());
    };
    const handleImportFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result?.toString() ?? "");
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
            event.target.value = "";
        };
        reader.readAsText(file);
    };
    return (
        <Stack direction={"horizontal"} gap={2} >
            <ImportedErrorDisplay />
            <div className={"ms-auto"}></div>
            <Button variant={"secondary"} onClick={handleImport}>Import</Button>
            <Button variant={"secondary"} onClick={handleExport}>Export</Button>
            <Form.Control
                type="file"
                accept="application/json"
                ref={fileInputRef}
                onChange={handleImportFileChange}
                className="d-none"
            />
        </Stack>
    )
}