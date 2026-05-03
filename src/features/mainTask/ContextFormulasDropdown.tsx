import {useDispatch, useSelector} from "react-redux";
import {useUpdateFormulasContext} from "../../LogicContext.ts";
import {Dropdown, DropdownButton, DropdownItem} from "react-bootstrap";
import {allContextFormulasAdded, contextFormulaAdded, selectContextFormulasNames} from "./mainTaskSlice.ts";

export default function ContextFormulasDropdown() {

    const addedContextFormulas = new Set<string>(useSelector(selectContextFormulasNames));
    const {formulas, formulasByType} = useUpdateFormulasContext();
    console.log(formulas, addedContextFormulas);
    const notAddedFormulas = formulas.filter((f) => ! addedContextFormulas.has(f.name));

    const handleAddAllFormulas = () => {
        dispatch(allContextFormulasAdded(notAddedFormulas));
    }

    const dispatch = useDispatch();

    return (
        <DropdownButton title="Add Formula From Context"
                        className="view-mode-hide"
                        variant="success">
            <Dropdown.Item
                onClick={handleAddAllFormulas}
                disabled={notAddedFormulas.length === 0}
            >
                Add all
            </Dropdown.Item>
            {formulasByType.axioms.length > 0 &&
                <>
                    <Dropdown.Divider />
                    <Dropdown.ItemText>
                        Axioms
                    </Dropdown.ItemText>
                    {formulasByType.axioms.map((axiom) => (
                        <DropdownItem key={axiom.name}
                                      disabled={addedContextFormulas.has(axiom.name)}
                                      onClick={() => dispatch(contextFormulaAdded(axiom))}>
                            {axiom.name}
                        </DropdownItem>
                    ))
                    }
                </>
            }
            {formulasByType.formulas.length > 0 &&
                <>
                    <Dropdown.Divider />
                    <Dropdown.ItemText>
                        Formulas
                    </Dropdown.ItemText>
                    {formulasByType.formulas.map((formula) => (
                        <DropdownItem key={formula.name}
                                      disabled={addedContextFormulas.has(formula.name)}
                                      onClick={() => dispatch(contextFormulaAdded(formula))}>
                            {formula.name}
                        </DropdownItem>
                    ))
                    }
                </>
            }
        </DropdownButton>
    );
}