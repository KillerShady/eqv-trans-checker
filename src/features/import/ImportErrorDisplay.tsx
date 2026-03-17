import {useDispatch, useSelector} from "react-redux";
import {clearError, selectImportError} from "./importExportSlice.ts";
import type {RootState} from "../../state/store.ts";
import {Toast, ToastContainer} from "react-bootstrap";

export default function ImportedErrorDisplay() {
    const dispatch = useDispatch();
    const error = useSelector((state: RootState) => selectImportError(state));

    return (
        <ToastContainer className="position-absolute m-2" position="top-start">
            <Toast bg="danger"
                   animation
                   onClose={() => dispatch(clearError())}
                   show={error !== ""}
                   className="overflow-hidden m-2"
            >
                <Toast.Header>
                    <strong className="me-auto">Import failed</strong>
                </Toast.Header>
                <Toast.Body className="bg-white overflow-hidden">{error}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}