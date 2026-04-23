import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../state/store.ts";
import {
    formulaAdded,
    formulaModified,
    formulaRemoved,
    selectFormulaByID,
    selectParsedFormula, selectTransformationError,
    updateSkolemSymbols,
    selectSkolemSymbolsErrorByID,
    selectSkolemSymbolsTextByID, selectSkolemConstantSymbolsClash
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
    const skolemSymbols = useSelector((state: RootState) => selectSkolemSymbolsTextByID(state, id));
    const error = useSelector((state: RootState)  => selectParsedFormula(state, TransId, id));
    const transformationError = useSelector((state: RootState)  => selectTransformationError(state, TransId, formula.prevFormula, id));
    const skolemError = useSelector((state: RootState) => selectSkolemSymbolsErrorByID(state, id));
    const skolemSymbolClash = useSelector((state: RootState) => selectSkolemConstantSymbolsClash(state, id));
    const dispatch = useDispatch();
    console.log("drawing line", id, "in", TransId);
    console.log("prevFormula", formula.prevFormula);
    console.log("transformationError", transformationError);
    console.log("skolemError", skolemError);
    console.log("skolemError", skolemSymbolClash);
    console.log(" ")
    let isValid: boolean | undefined = undefined;
    if (error.error !== undefined || skolemError.error !== undefined || skolemSymbolClash !== undefined) {
        isValid = false;
    } else if (transformationError.validated) {
        isValid = transformationError.error === undefined;
    }
    console.log(isValid);

    return (
        <InputGroup size="sm" className="mb-3" hasValidation={isValid === false ? true : undefined}>
            {formula.prevFormula !== undefined &&
                <InputGroup.Text>
                    <InlineMath>
                        {formula.operation === "Skolem" ? "\\leftrightsquigarrow" : "\\Leftrightarrow"}
                    </InlineMath>
                </InputGroup.Text>
            }
            <Form.Control value={formula.formula}
                          isValid={isValid}
                          isInvalid={isValid === undefined ? undefined : !isValid}
                          onChange={(e) => dispatch(formulaModified({id: id, formula: e.target.value, operation: formula.operation}))}
            />
            {formula.operation === "Skolem" &&
             <Form.Control className="skolem-symbol-input"
                           placeholder="constant, function/arity, ..."
                           value={skolemSymbols}
                           isInvalid={skolemError.error !== undefined || skolemSymbolClash !== undefined}
                           onChange={(e) => dispatch(updateSkolemSymbols({id: id, skolemSymbols:e.target.value}))}
             />
            }
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
            <ErrorFeedback error={skolemError.error ?? skolemSymbolClash} text={skolemSymbols}></ErrorFeedback>
        </InputGroup>
    );
}