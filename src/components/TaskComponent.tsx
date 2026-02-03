import {useSelector} from "react-redux";
import {selectTransSequences} from "../state/slices/mainTaskSlice.ts";
import {Card} from "react-bootstrap";
import TransformationComponent from "./TransformationComponent.tsx";

export default function TaskComponent() {
    const tasks: number[] = useSelector(selectTransSequences);

    return (
        <Card className="mb-3 mt-3">
            <Card.Body>
                {tasks.map((task, index) => <TransformationComponent key={task} id={task} index={index} canRemove={tasks.length > 1} />)}
            </Card.Body>
        </Card>
    )
}