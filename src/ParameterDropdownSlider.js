import { useState } from "react";
import { Button, Slider } from 'carbon-components-react'
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';
import { RcpTypes } from 'rabbitcontrol';
import { DEFAULT_PRECISION } from "./Globals";

export const ParameterDropdownSlider = ({ children, value, parameter, handleValue, onSubmitCb, precision = DEFAULT_PRECISION }) =>
{
    const increment = (parameter.typeDefinition.maximum - parameter.typeDefinition.minimum) / 10;
    var stepSize = (parameter.typeDefinition.maximum - parameter.typeDefinition.minimum) / 200; // 200 is the width of the slider for now
    const [isOpen, setIsOpen] = useState(false);

    if (precision === 0 ||
        (parameter.typeDefinition.datatype !== RcpTypes.Datatype.FLOAT32 &&
        parameter.typeDefinition.datatype !== RcpTypes.Datatype.FLOAT64))
    {
        // int-type
        stepSize = Math.round(stepSize);
    }

    function handleChange(data)
    {
        if (handleValue) {
            handleValue(data.value);
        }

        if (onSubmitCb) {
            onSubmitCb();
        }
    }

    function stepDown(event)
    {
        event.stopPropagation();

        handleChange({
            value: parameter?.value - increment
        });
    }

    function stepUp(event)
    {
        event.stopPropagation();

        handleChange({
            value: parameter?.value + increment
        });
    }

    return (
        <div className="widget_dropdownslider">
            <div
                className="sm-row"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="dropdown-label dropdown-label-margin-left">{parameter.label}</div>
                <div className="grow" />
                <div className="dropdown-value">
                    {
                        value.toFixed(precision) + (parameter.typeDefinition.unit !== undefined ? (" " + parameter.typeDefinition.unit) : "")
                    }
                </div>
                <Button className="button-dark" kind="secondary" hasIconOnly renderIcon={ChevronLeft32} iconDescription="step down" onClick={stepDown}></Button>
                <Button className="button-dark" kind="secondary" hasIconOnly renderIcon={ChevronRight32} iconDescription="step up" onClick={stepUp}></Button>
            </div>
            
            <div hidden={isOpen !== true}>
                <div className="sm-row sm-lighter">
                    <Slider
                        className="sm-row-maxheight"
                        id={parameter.id.toString() || "value-slider"}
                        min={parameter.typeDefinition.minimum}
                        max={parameter.typeDefinition.maximum}
                        value={value}
                        step={stepSize}
                        onChange={handleChange}
                    >
                    </Slider>
                </div>
            </div>
        </div>
    )
}