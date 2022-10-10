import React, { useState, useEffect } from "react";
import { Dropdown, Button, Slider } from 'carbon-components-react'
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';

export const ParameterDropdownSlider = ({ children, value, parameter, handleValue, onSubmitCb }) =>
{
    const increment = (parameter.typeDefinition.maximum - parameter.typeDefinition.minimum) / 10;
    const stepSize = (parameter.typeDefinition.maximum - parameter.typeDefinition.minimum) / 200; // 200 is the width of the slider for now
    const [isOpen, setIsOpen] = useState(false);

    function handleChange(data) {
        // console.log("data: " + data.value);

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
        <div>
            <div
                className="sm-row"
                onClick={() => setIsOpen(!isOpen)}
            >
                    <div className="dropdown-label dropdown-label-margin-left">{parameter.label}</div>
                    <div className="grow" />
                    <div className="dropdown-value">{value.toFixed(3)}</div>
                    <Button className="button-dark" kind="secondary" hasIconOnly renderIcon={ChevronLeft32} iconDescription="step down" onClick={stepDown}></Button>
                    <Button className="button-dark" kind="secondary" hasIconOnly renderIcon={ChevronRight32} iconDescription="step up" onClick={stepUp}></Button>
            </div>
            
            <div hidden={isOpen !== true}>
                <div className="sm-row sm-lighter">
                    <Slider
                        className="dropdown-slider-slider"
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