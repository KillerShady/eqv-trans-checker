import {Form, InputGroup} from "react-bootstrap";
import type {ChangeEvent, ReactNode} from "react";

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
                {error && <Form.Control.Feedback type="invalid"> {error.message} </Form.Control.Feedback>}
            </InputGroup>
        </>
    );
}