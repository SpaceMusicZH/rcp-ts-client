import React, { useState } from "react";
import { Dropdown, Button, Slider } from 'carbon-components-react'
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';

const ParameterDropdownSlider = ({ children, parameter, value, handleValue, onSubmitCb }) => {

    // var [value, setValue] = useState("dos");

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
            value: parameter?.value - 0.01
        });
    }
    function stepUp(event)
    {
        event.stopPropagation();

        handleChange({
            value: parameter?.value + 0.01
        });
    }

    function onSliderValueChanged(value)
    {
        console.log(value);
        // event.stopPropagation();
    }

    // NOTE: calling function from inner Slider looses _this
    const elm = { p: parameter, f: handleChange.bind(ParameterDropdownSlider) };

    return (
        <Dropdown
            className="dropdown-slider"
            id={parameter?.id.toString() || "dropdown"}
            label=""
            hideLabel={true}
            disabled={parameter?.readonly === true}
            items={[elm]}
            selectedItem={elm}
            renderSelectedItem={(item) =>
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <div className="dropdown-label">{item.p.label}</div>
                    <div className="grow" />
                    <div className="dropdown-value">{item.p.value.toFixed(3)}</div>
                    <Button kind="secondary" hasIconOnly renderIcon={ChevronLeft32} iconDescription="step down" onClick={stepDown}></Button>
                    <Button kind="secondary" hasIconOnly renderIcon={ChevronRight32} iconDescription="step up" onClick={stepUp}></Button>
                </div>
            }
            itemToString={(item) => item.p.label}
            itemToElement={(item) =>
                <Slider
                    className="dropdown-slider-slider"
                    id={item.p.id.toString() || "value-slider"}
                    min={item.p.typeDefinition.minimum}
                    max={item.p.typeDefinition.maximum}
                    value={item.p.value || 0}
                    step={0.01}
                    // onChange={({ value }) => {
                    //     // debugger;

                    //     var t = this._this;

                    //     if (handleValue) {
                    //         handleValue(value);
                    //     }
                    //     // console.log("item: " + item.p.value + ": " + value);
                    //     // item.p.value = value;
                
                    //     if (onSubmitCb) {
                    //         onSubmitCb();
                    //     }

                    //     this._this = t;
                    // }}
                    // onRelease={() => handleChange}
                >
                </Slider>
            }
        >
        </Dropdown>
    )
}

export default ParameterDropdownSlider