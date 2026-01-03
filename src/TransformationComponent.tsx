import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "./state/store.ts";
import {selectTransformations, transSequenceAdded, transSequenceRemoved} from "./state/slices/mainTaskSlice.ts";
import FormulaComponent from "./FormulaComponent.tsx";
import {Button, Card, Col} from "react-bootstrap";

export default function TransformationComponent({ index, id }: { index: number, id: number }) {
    const formulas = useSelector((state: RootState)  => selectTransformations(state, id));
    const dispatch = useDispatch();
    console.log("drawing Box", id)


    return (
        <Card className="mb-3 mt-3">
            <Card.Header as="h4">
                Transformation Sequence {index}
            </Card.Header>
            <Card.Body as={Col}>
                {formulas.map((formula) => <FormulaComponent key={formula} TransId={id} id={formula} canRemove={formulas.length > 1} />)}
                <Button variant="primary" onClick={() => dispatch(transSequenceAdded(id))}>Add Equivalent Change</Button>
                <Button variant="primary" onClick={() => dispatch(transSequenceRemoved(id))}>Remove Equivalent Change</Button>
            </Card.Body>
        </Card>
    )
}