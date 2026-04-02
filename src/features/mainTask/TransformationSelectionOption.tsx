import {Dropdown, OverlayTrigger, Tooltip, type TooltipProps} from "react-bootstrap";
import {EquivalentTransformationsRecord} from "./EquivalentTransfromationsRecord.ts";
import {InlineMath} from "react-katex";
import type {RefAttributes} from "react";
import type {JSX} from "react/jsx-runtime";

export default function TransformationSelectionOption({transKey}: { transKey: string }) {
    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
        <Tooltip {...props}>
            <small><InlineMath>{EquivalentTransformationsRecord[transKey].tex}</InlineMath></small>
        </Tooltip>
    );

    return (
        <OverlayTrigger placement="left" overlay={renderTooltip}>
            <Dropdown.Item eventKey={EquivalentTransformationsRecord[transKey].key}>
                {EquivalentTransformationsRecord[transKey].name}
            </Dropdown.Item>
        </OverlayTrigger>
    )
}