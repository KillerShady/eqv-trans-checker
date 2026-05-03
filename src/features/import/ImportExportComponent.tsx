import {Button, Stack, Form} from "react-bootstrap";
import type {AppDispatch} from "../../state/store.ts";
import {useDispatch} from "react-redux";
import {type ChangeEvent, useRef} from "react";
import {exportAppState, importAppStateFromJSON} from "./importExportSlice.ts";
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
            importAppStateFromJSON(e.target?.result?.toString() ?? "", dispatch);
            event.target.value = "";
        };
        reader.readAsText(file);
    };
    return (
        <Stack direction={"horizontal"} gap={2} className="view-mode-hide">
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