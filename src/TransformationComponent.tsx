import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "./state/store.ts";
import {selectTransformations, transSequenceAdded, transSequenceRemoved} from "./state/slices/mainTaskSlice.ts";
import FormulaComponent from "./FormulaComponent.tsx";
import {Button, Card, Col, Row} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";

export default function TransformationComponent({ index, id, canRemove }: { index: number, id: number, canRemove: boolean }) {
    const formulas = useSelector((state: RootState)  => selectTransformations(state, id));
    const dispatch = useDispatch();
    console.log("drawing Box", id, canRemove);


    return (
        <>
            <Card className="mb-3 mt-3">
                <Card.Header as="h4">
                    <Row>
                        <Col>Transformation Sequence {index}</Col>
                        <Col xs="auto">
                            <Button variant="outline-danger" disabled={!canRemove} onClick={() => dispatch(transSequenceRemoved(id))}>
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body as={Col}>
                    {formulas.map((formula) => <FormulaComponent key={formula} TransId={id} id={formula} canRemove={formulas.length > 1} />)}
                </Card.Body>
            </Card>
            <Button variant="success" onClick={() => dispatch(transSequenceAdded(id))}>
                <FontAwesomeIcon icon={faPlus} /> Add
            </Button>
        </>
    )
}