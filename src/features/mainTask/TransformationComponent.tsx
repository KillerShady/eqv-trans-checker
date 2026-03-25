import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "../../state/store.ts";
import {selectTransformations, transSequenceRemoved} from "./mainTaskSlice.ts";
import FormulaComponent from "./FormulaComponent.tsx";

export default function TransformationComponent({ index, id, canRemove }: { index: number, id: number, canRemove: boolean }) {
    const formulas = useSelector((state: RootState)  => selectTransformations(state, id));
    const dispatch = useDispatch();
    console.log("drawing Box", id, canRemove);
    if (formulas.length === 0) {
        dispatch(transSequenceRemoved(id));
    }

    return (
        <div>
            <h4>
                Transformation Sequence {index+1}
            </h4>
            {formulas.map((formula) => <FormulaComponent key={formula} TransId={id} id={formula} />)}
        </div>
    )
}