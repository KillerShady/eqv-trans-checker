import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../state/store.ts";
import {
    formulaAdded,
    formulaModified,
    formulaRemoved,
    selectFormulaByID,
    selectParsedFormula, selectTransformationError,
    skolemSymbolsUpdated,
    selectSkolemSymbolsErrorByID,
    selectSkolemSymbolsTextByID, selectSkolemConstantSymbolsClash, selectIsFormulaLast
} from "./mainTaskSlice.ts";
import {Button, DropdownButton, Form, InputGroup, OverlayTrigger, Tooltip, type TooltipProps} from "react-bootstrap";
import ErrorFeedback from "./ErrorFeedback.tsx";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {InlineMath} from "react-katex";
import {EquivalentTransformationsRecord} from "./EquivalentTransformationsRecord.tsx";
import TransformationSelectionOption from "./TransformationSelectionOption.tsx";
import type {JSX} from "react/jsx-runtime";
import type {RefAttributes} from "react";
import {useFormulasContext} from "../../LogicContext.ts";

export default function FormulaComponent({ TransId, id }: { TransId: number; id: number }) {
    const formula = useSelector((state: RootState)  => selectFormulaByID(state, id));
    const skolemSymbols = useSelector((state: RootState) => selectSkolemSymbolsTextByID(state, id));
    const isCNF = formula.operation == "CNF";
    const prevFormula = useSelector((state: RootState) => selectFormulaByID(state, formula.prevFormula !== undefined ? formula.prevFormula : id));
    const isFormulaLast = useSelector((state: RootState) => selectIsFormulaLast(state, TransId, id));

    const error = useSelector((state: RootState)  => selectParsedFormula(state, TransId, id));
    const transformationError = useSelector((state: RootState)  => selectTransformationError(state, TransId, formula.prevFormula, id));
    const skolemError = useSelector((state: RootState) => selectSkolemSymbolsErrorByID(state, id));
    const skolemSymbolClash = useSelector((state: RootState) => selectSkolemConstantSymbolsClash(state, id));

    if (isCNF) {
        error.error = undefined;
    }

    const dispatch = useDispatch();

    const {formulas} = useFormulasContext();
    const isContextFormula = formula.name !== undefined;
    const missingInContextError = isContextFormula && formulas.filter((f) => f.name === formula.name).length === 0 ?
        new Error("Formula is missing in context!") :
        undefined;
    console.log(missingInContextError);

    console.log("drawing line", id, "in", TransId);
    console.log("prevFormula", formula.prevFormula);
    console.log("transformationError", transformationError);
    console.log("skolemError", skolemError);
    console.log("skolemError", skolemSymbolClash);
    console.log("prevFormula", prevFormula);
    console.log(" ");

    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
        <Tooltip {...props}>
            <small>{EquivalentTransformationsRecord[formula.operation].name}</small><br/>
            <small><InlineMath>{EquivalentTransformationsRecord[formula.operation].tex}</InlineMath></small>
        </Tooltip>
    );

    let isValid: boolean | undefined = undefined;
    if (error.error !== undefined || missingInContextError !== undefined ||
        skolemError.error !== undefined || skolemSymbolClash !== undefined) {
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
            <Form.Control value={isCNF ? prevFormula.formula : formula.formula}
                          disabled={isContextFormula || isCNF}
                          isValid={isValid}
                          isInvalid={isValid === undefined ? undefined : !isValid}
                          onChange={(e) => dispatch(formulaModified({id: id, formula: e.target.value, operation: formula.operation}))}
            />
            {formula.operation === "Skolem" &&
             <Form.Control className="skolem-symbol-input"
                           placeholder="constant, function/arity, ..."
                           value={skolemSymbols}
                           isInvalid={skolemError.error !== undefined || skolemSymbolClash !== undefined}
                           onChange={(e) => dispatch(skolemSymbolsUpdated({id: id, skolemSymbols:e.target.value}))}
             />
            }
            {formula.prevFormula !== undefined &&
                <DropdownButton className="operation-selection text-truncate"
                                variant="secondary"
                                title={
                    <OverlayTrigger placement="top" overlay={renderTooltip} show={EquivalentTransformationsRecord[formula.operation] === undefined ? false: undefined}>
                        <span className="text-truncate">{EquivalentTransformationsRecord[formula.operation]?.name ?? formula.operation}</span>
                    </OverlayTrigger>
                                }
                                onSelect={(e) => dispatch(formulaModified({id: id, formula:formula.formula, operation: e}))}>
                    {Object.keys(EquivalentTransformationsRecord).map((key) => <TransformationSelectionOption key={key} transKey={key} isLast={isFormulaLast} />)}
                </DropdownButton>

            }
            {! isCNF &&
                <DropdownButton variant="success"
                                title={
                                    <>+<span className="step"> Step</span></>
                                }
                                onSelect={(e) => dispatch(formulaAdded({transformation: TransId, prevFormula:id, operation: e}))}>
                    {Object.keys(EquivalentTransformationsRecord).map((key) => <TransformationSelectionOption key={key} transKey={key} isLast={isFormulaLast} />)}
                </DropdownButton>
            }
            <Button variant="outline-danger"
                    className="view-mode-hide"
                    onClick={() => dispatch(formulaRemoved({transformation: TransId, id:id}))}>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
            <ErrorFeedback error={missingInContextError ?? error.error ?? transformationError.error} text={formula.formula}></ErrorFeedback>
            <ErrorFeedback error={skolemError.error ?? skolemSymbolClash} text={skolemSymbols}></ErrorFeedback>
        </InputGroup>
    );
}