import React, { Component, useState, PropsWithChildren } from "react";
import { Dropdown } from 'carbon-components-react'
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
                </div>
            }
        >
        </Dropdown>
    )
}

export default ParameterDropdown