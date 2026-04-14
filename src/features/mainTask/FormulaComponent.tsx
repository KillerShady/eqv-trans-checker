import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../state/store.ts";
import {
    formulaAdded,
    formulaModified,
    formulaRemoved,
    selectFormulaByID,
    selectParsedFormula, selectTransformationError
} from "./mainTaskSlice.ts";
import {Button, DropdownButton, Form, InputGroup} from "react-bootstrap";
import ErrorFeedback from "./ErrorFeedback.tsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {InlineMath} from "react-katex";
import {EquivalentTransformationsRecord} from "./EquivalentTransformationsRecord.ts";
import TransformationSelectionOption from "./TransformationSelectionOption.tsx";

export default function FormulaComponent({ TransId, id }: { TransId: number; id: number }) {
    const formula = useSelector((state: RootState)  => selectFormulaByID(state, id));
    const error = useSelector((state: RootState)  => selectParsedFormula(state, id));
    const transformationError = useSelector((state: RootState)  => selectTransformationError(state, formula.prevFormula, id))
    const dispatch = useDispatch();
    console.log("drawing line", id, "in", TransId);
    console.log(formula.prevFormula);
    console.log(transformationError);
    console.log(" ")
    let isValid: boolean | undefined = undefined;
    if (error.error !== undefined) {
        isValid = false;
    } else if (transformationError.validated) {
        isValid = transformationError.error === undefined;
    }
    console.log(isValid);

    return (
        <InputGroup size="sm" className="mb-3" hasValidation={isValid === false ? true : undefined}>
            {formula.prevFormula !== undefined &&
                <InputGroup.Text><InlineMath>\Leftrightarrow</InlineMath></InputGroup.Text>
            }
            <Form.Control value={formula.formula}
                          isValid={isValid}
                          isInvalid={isValid === undefined ? undefined : !isValid}
                          onChange={(e) => dispatch(formulaModified({id: id, formula: e.target.value, operation: formula.operation}))} />
            {formula.prevFormula !== undefined &&
             <DropdownButton variant="secondary"
                             title={EquivalentTransformationsRecord[formula.operation]?.name ?? formula.operation}
                             onSelect={(e) => dispatch(formulaModified({id: id, formula:formula.formula, operation: e}))}>
                 {Object.keys(EquivalentTransformationsRecord).map((key) => <TransformationSelectionOption key={key} transKey={key} />)}
             </DropdownButton>
            }
            <DropdownButton variant="success"
                            title="+ Step"
                            onSelect={(e) => dispatch(formulaAdded({transformation: TransId, prevFormula:id, operation: e}))}>
                {Object.keys(EquivalentTransformationsRecord).map((key) => <TransformationSelectionOption key={key} transKey={key} />)}
            </DropdownButton>
            <Button variant="outline-danger" onClick={() => dispatch(formulaRemoved({transformation: TransId, id:id}))}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
            <ErrorFeedback error={error.error ?? transformationError.error} text={formula.formula}></ErrorFeedback>
        </InputGroup>
    );
}