import {Form, InputGroup} from "react-bootstrap";
import type {ChangeEvent, ReactNode} from "react";
import ErrorFeedback from "../mainTask/ErrorFeedback.tsx";

interface Props {
    label: string;
    prefix: ReactNode;
    suffix: ReactNode;
    text: string;
    onChange(event: ChangeEvent<HTMLInputElement>): void;
    error?: Error;
}

export default function LanguageInput({
    label,
    prefix,
    suffix,
    text,
    onChange,
    error,
} : Props) {
    return (
        <>
            {label != "" && (<Form.Label> {label} </Form.Label>)}
            <InputGroup className="mb-3">
                <InputGroup.Text>{prefix}</InputGroup.Text>
                <Form.Control value={text} onChange={onChange} isInvalid={!!error} />
                <InputGroup.Text>{suffix}</InputGroup.Text>
                <ErrorFeedback error={error} text={text}></ErrorFeedback>
            </InputGroup>
        </>
    );
}