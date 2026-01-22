import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "./state/store.ts";
import {
    formulaAdded,
    formulaModified,
    formulaRemoved,
    selectFormulaByID,
    selectParsedFormula
} from "./state/slices/mainTaskSlice.ts";
import {Button, Dropdown, DropdownButton, Form, InputGroup} from "react-bootstrap";
import ErrorFeedback from "./ErrorFeedback.tsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function FormulaComponent({ TransId, id, canRemove }: { TransId: number; id: number, canRemove: boolean }) {
    const formula = useSelector((state: RootState)  => selectFormulaByID(state, id));
    const error = useSelector((state: RootState)  => selectParsedFormula(state, id));
    const dispatch = useDispatch();
    console.log("drawing line", id, "in", TransId);
    console.log(formula.prevFormula);

    return (
        <InputGroup className="mb-3">
            {!isNaN(formula.prevFormula) && <InputGroup.Text>&lt;==&gt;</InputGroup.Text>}
            <Form.Control value={formula.formula} isInvalid={!!error.error} onChange={(e) => dispatch(formulaModified({id: id, formula: e.target.value, operation: formula.operation}))} />
            <DropdownButton variant="secondary" title={formula.operation} onSelect={(e) => dispatch(formulaModified({id: id, formula:formula.formula, operation: e}))}>
                <Dropdown.Item eventKey={"Operation"}>---</Dropdown.Item>
                <Dropdown.Item eventKey={"OP 1"}>OP 1</Dropdown.Item>
                <Dropdown.Item eventKey={"OP 2"}>OP 2</Dropdown.Item>
                <Dropdown.Item eventKey={"OP 3"}>OP 3</Dropdown.Item>
            </DropdownButton>
            <Button variant="success" onClick={() => dispatch(formulaAdded({transformation: TransId, prevFormula:id}))}>+</Button>
            <Button variant="outline-danger" disabled={!canRemove} onClick={() => dispatch(formulaRemoved({transformation: TransId, id:id}))}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
            <ErrorFeedback error={error.error} text={formula.formula}></ErrorFeedback>
        </InputGroup>
    );
}