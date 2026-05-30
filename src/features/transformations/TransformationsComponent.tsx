import {useDispatch, useSelector} from "react-redux";
import {
    selectTransSequences,
    transSequenceAdded
} from "./transformationsSlice.ts";
import SequenceComponent from "./SequenceComponent.tsx";
import {Button, Stack} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {useUpdateFormulasContext} from "../../LogicContext.ts";
import ContextFormulasDropdown from "./ContextFormulasDropdown.tsx";

export default function TransformationsComponent() {
    const tasks: number[] = useSelector(selectTransSequences);

    const {hasContext} = useUpdateFormulasContext();


    const dispatch = useDispatch();

    return (
        <div>
            {tasks.map((task, index) => <SequenceComponent key={task} id={task} index={index} canRemove={tasks.length > 1} />)}
            <Stack direction={"horizontal"} gap={2} className="view-mode-hide">
                <Button variant="success"
                        className="view-mode-hide"
                        onClick={() => dispatch(transSequenceAdded())}>
                    <FontAwesomeIcon icon={faPlus} /> Add Transformation Sequence
                </Button>
                {hasContext &&
                    <ContextFormulasDropdown />
                }
            </Stack>
        </div>
    );
}