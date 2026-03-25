import {useDispatch, useSelector} from "react-redux";
import {selectTransSequences, transSequenceAdded} from "./mainTaskSlice.ts";
import TransformationComponent from "./TransformationComponent.tsx";
import {Button} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";

export default function TaskComponent() {
    const tasks: number[] = useSelector(selectTransSequences);
    const dispatch = useDispatch();

    return (
        <div>
            {tasks.map((task, index) => <TransformationComponent key={task} id={task} index={index} canRemove={tasks.length > 1} />)}
            <div>
                <Button variant="success" onClick={() => dispatch(transSequenceAdded())}>
                    <FontAwesomeIcon icon={faPlus} /> Add Transformation Sequence
                </Button>
            </div>
        </div>
    )
}