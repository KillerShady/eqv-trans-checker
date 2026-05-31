import {Dropdown, OverlayTrigger, Tooltip, type TooltipProps} from "react-bootstrap";
import {EquivalentTransformationsRecord} from "./EquivalentTransformationsRecord.tsx";
import {InlineMath} from "react-katex";
import type {RefAttributes} from "react";
import type {JSX} from "react/jsx-runtime";

export default function TransformationSelectionOption({transKey, isLast}: { transKey: string, isLast: boolean }) {
    const renderTooltip = (props: JSX.IntrinsicAttributes & TooltipProps & RefAttributes<HTMLDivElement>) => (
        <Tooltip {...props}>
            <small><InlineMath>{EquivalentTransformationsRecord[transKey].tex}</InlineMath></small>
        </Tooltip>
    );

    if (EquivalentTransformationsRecord[transKey].key === "CNF" && ! isLast) {
        return null;
    }
    return (
        <OverlayTrigger placement="left" overlay={renderTooltip}>
            <Dropdown.Item eventKey={EquivalentTransformationsRecord[transKey].key}>
                {EquivalentTransformationsRecord[transKey].name}
            </Dropdown.Item>
        </OverlayTrigger>
    )
}