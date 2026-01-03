import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "./state/store.ts";
import {
    formulaAdded,
    formulaModified,
    formulaRemoved,
    selectFormulaByID,
    selectParsedFormula
} from "./state/slices/mainTaskSlice.ts";

export default function FormulaComponent({ TransId, id, canRemove }: { TransId: number; id: number, canRemove: boolean }) {
    const formula = useSelector((state: RootState)  => selectFormulaByID(state, id));
    const error = useSelector((state: RootState)  => selectParsedFormula(state, id));
    const dispatch = useDispatch();
    console.log("drawing line", id, "in", TransId);
    console.log(formula.prevFormula);

    return (
        <div className="line-box">
            <p>henlo :3 {id}</p>
            <div className="tmp_row">
                {!isNaN(formula.prevFormula) && <span>    &lt;==&gt;    </span>}
                <input type="text" value={formula.formula}
                       onChange={(e) => dispatch(formulaModified({id: id, formula: e.target.value, operation: formula.operation}))} />
                <button onClick={() => dispatch(formulaAdded({transformation: TransId, prevFormula:id}))}>+ line</button>
                <button disabled={!canRemove} onClick={() => dispatch(formulaRemoved({transformation: TransId, id:id}))}>- line</button>
                <select value={formula.operation} onChange={(e) => dispatch(formulaModified({id: id, formula:formula.formula, operation: e.target.value}))}>
                    <option value="">---</option>
                    <option value="OP 1">OP 1</option>
                    <option value="OP 2">OP 2</option>
                    <option value="OP 3">OP 3</option>
                </select>
                <span>you selected {formula.operation}</span>
                <span>{error.error && error.error.message}</span>
            </div>
        </div>
    )
}