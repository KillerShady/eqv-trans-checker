import {useSelector} from "react-redux";
import type {RootState} from "../../state/store.ts";
import {selectTransformations} from "./transformationsSlice.ts";
import FormulaComponent from "./FormulaComponent.tsx";

export default function SequenceComponent({ index, id }: { index: number, id: number }) {
    const formulas = useSelector((state: RootState)  => selectTransformations(state, id));
    //console.log("drawing Box", id);

    return (
        <div>
            <h4>
                Transformation Sequence {index+1}
            </h4>
            {formulas.map((formula) => <FormulaComponent key={formula} TransId={id} id={formula} />)}
        </div>
    )
}