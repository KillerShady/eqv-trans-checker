import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../state/store.ts";
import {
    formulaAdded,
    formulaModified,
    formulaRemoved,
    selectFormulaByID,
    selectParsedFormula, selectTransformationError
} from "../state/slices/mainTaskSlice.ts";
import {Button, Dropdown, DropdownButton, Form, InputGroup} from "react-bootstrap";
import ErrorFeedback from "./ErrorFeedback.tsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function FormulaComponent({ TransId, id, canRemove }: { TransId: number; id: number, canRemove: boolean }) {
    const formula = useSelector((state: RootState)  => selectFormulaByID(state, id));
    const error = useSelector((state: RootState)  => selectParsedFormula(state, id));
    const transformationError = useSelector((state: RootState)  => selectTransformationError(state, formula.prevFormula, id))
    const dispatch = useDispatch();
    console.log("drawing line", id, "in", TransId);
    console.log(formula.prevFormula);
    console.log(transformationError);
    console.log(" ")

    return (
        <InputGroup className="mb-3">
            {!isNaN(formula.prevFormula) && <InputGroup.Text>&lt;==&gt;</InputGroup.Text>}
            <Form.Control value={formula.formula} isInvalid={!!(error.error ?? transformationError.error)} onChange={(e) => dispatch(formulaModified({id: id, formula: e.target.value, operation: formula.operation}))} />
            {!isNaN(formula.prevFormula) &&
             <DropdownButton variant="secondary" title={formula.operation} onSelect={(e) => dispatch(formulaModified({id: id, formula:formula.formula, operation: e}))}>
                <Dropdown.Item eventKey={"Operation"}>---</Dropdown.Item>
                <Dropdown.Item eventKey={"Associativity"}>Associativity</Dropdown.Item>
                <Dropdown.Item eventKey={"Commutativity"}>Commutativity</Dropdown.Item>
                <Dropdown.Item eventKey={"DeMorganPROP"}>DeMorganPROP</Dropdown.Item>
                <Dropdown.Item eventKey={"DeMorganQUANT"}>DeMorganQUANT</Dropdown.Item>
                <Dropdown.Item eventKey={"DeMorganCOMBINED"}>DeMorganCOMBINED</Dropdown.Item>
                <Dropdown.Item eventKey={"Distributivity"}>Distributivity</Dropdown.Item>
                <Dropdown.Item eventKey={"DistributivityQUANT"}>DistributivityQUANT</Dropdown.Item>
                <Dropdown.Item eventKey={"DoubleNEG"}>DoubleNEG</Dropdown.Item>
                <Dropdown.Item eventKey={"RemoveFormula"}>RemoveFormula</Dropdown.Item>
                <Dropdown.Item eventKey={"RemoveIMPL"}>RemoveIMPL</Dropdown.Item>
                <Dropdown.Item eventKey={"RemoveQUANT"}>RemoveQUANT</Dropdown.Item>
                <Dropdown.Item eventKey={"RemoveQUANTPROP"}>RemoveQUANTPROP</Dropdown.Item>
                <Dropdown.Item eventKey={"RenameVAR"}>RenameVAR</Dropdown.Item>
                <Dropdown.Item eventKey={"CreateTRUE"}>CreateTRUE</Dropdown.Item>
                <Dropdown.Item eventKey={"RemoveTRUE"}>RemoveTRUE</Dropdown.Item>
                <Dropdown.Item eventKey={"CreateFALSE"}>CreateFALSE</Dropdown.Item>
                <Dropdown.Item eventKey={"RemoveFALSE"}>RemoveFALSE</Dropdown.Item>
             </DropdownButton>
            }
            <Button variant="success" onClick={() => dispatch(formulaAdded({transformation: TransId, prevFormula:id}))}>+</Button>
            <Button variant="outline-danger" disabled={!canRemove} onClick={() => dispatch(formulaRemoved({transformation: TransId, id:id}))}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
            <ErrorFeedback error={error.error ?? transformationError.error} text={formula.formula}></ErrorFeedback>
        </InputGroup>
    );
}