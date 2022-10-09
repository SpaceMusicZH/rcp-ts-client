import React, { Component, useState, PropsWithChildren } from "react";
import { Dropdown, Button } from 'carbon-components-react'
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';
// import 'carbon-components-react/index.scss'

const ParameterDropdown = ({ children, parameter, value, handleValue, onSubmitCb }) => {

    // var [value, setValue] = useState("dos");

    function handleChange(data) {
        // console.log("data: " + data.selectedItem);
        // setValue(data.selectedItem);

        if (handleValue) {
            handleValue(data.selectedItem);
        }

        if (onSubmitCb) {
            onSubmitCb();
        }
    }

    function onPreviousChild(event)
    {
        event.stopPropagation();
        
        var idx = parameter?.enumDefinition?.entries.indexOf(parameter?.value) - 1;
        if (idx < 0)
        {
            idx = parameter?.enumDefinition?.entries.length - 1;
        }

        handleChange({
            selectedItem: parameter?.enumDefinition?.entries[idx]
        });
    }
    function onNextChild(event)
    {
        event.stopPropagation();

        var idx = parameter?.enumDefinition?.entries.indexOf(parameter?.value) + 1;
        if (idx >= parameter?.enumDefinition?.entries.length)
        {
            idx = 0;
        }

        handleChange({
            selectedItem: parameter?.enumDefinition?.entries[idx]
        });
    }

    return (
        <Dropdown
            id={parameter?.id.toString() || "dropdown"}
            label=""
            hideLabel={true}
            onChange={handleChange}
            disabled={parameter?.readonly === true}
            items={parameter?.enumDefinition?.entries || []}
            selectedItem={value || ""}
            renderSelectedItem={(item) =>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                }}>
                    <div>{parameter?.label}</div>
                    <div style={{ flexGrow: 1 }} />
                    <div>{item}</div>
                    <Button kind="secondary" hasIconOnly renderIcon={ChevronLeft32} iconDescription="next" onClick={onPreviousChild}></Button>
                    <Button kind="secondary" hasIconOnly renderIcon={ChevronRight32} iconDescription="previous" onClick={onNextChild}></Button>
                </div>
            }
        >
        </Dropdown>
    )
}

export default ParameterDropdown