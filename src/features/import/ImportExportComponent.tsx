import {Button, Stack, Form} from "react-bootstrap";
import type {AppDispatch} from "../../state/store.ts";
import {useDispatch} from "react-redux";
import {type ChangeEvent, useRef} from "react";
import {exportAppState, importAppState} from "./importExportSlice.ts";
import {serializedAppStateSchema} from "./validationSchema.ts";

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
            } catch (err) {
                console.error(err);
            } finally {
                event.target.value = "";
            }
        };
        reader.readAsText(file);
    };
    return (
        <Stack direction={"horizontal"} gap={2} >
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