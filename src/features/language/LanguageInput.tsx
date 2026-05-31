import {Form, InputGroup} from "react-bootstrap";
import type {ChangeEvent, ReactNode} from "react";
import ErrorFeedback from "../transformations/ErrorFeedback.tsx";

interface Props {
    label: string;
    prefix: ReactNode;
    suffix: ReactNode;
    text: string;
    onChange(event: ChangeEvent<HTMLInputElement>): void;
    error?: Error;
    disabled: boolean;
}

export default function LanguageInput({
    label,
    prefix,
    suffix,
    text,
    onChange,
    error,
    disabled,
} : Props) {
    return (
        <>
            {label != "" && (<Form.Label> {label} </Form.Label>)}
            <InputGroup size="sm" className="mb-3">
                <InputGroup.Text>{prefix}</InputGroup.Text>
                <Form.Control value={text} onChange={onChange} isInvalid={!!error} disabled={disabled}/>
                <InputGroup.Text>{suffix}</InputGroup.Text>
                <ErrorFeedback error={error} text={text}></ErrorFeedback>
            </InputGroup>
        </>
    );
}