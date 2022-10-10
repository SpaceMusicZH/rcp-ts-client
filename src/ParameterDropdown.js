import React, { Component, useState, PropsWithChildren } from "react";
import { Dropdown, Button } from 'carbon-components-react'
import { ChevronLeft32, ChevronRight32 } from '@carbon/icons-react';
// import 'carbon-components-react/index.scss'

const ParameterDropdown = ({ children, parameter, value, handleValue, onSubmitCb }) => {

    const [isOpen, setIsOpen] = useState(false);

    function handleChange(data) {
        // console.log("data: " + data.selectedItem);

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

    function setEntry(e)
    {
        handleChange({
            selectedItem: e
        });

        setIsOpen(!isOpen);
    }

    return (

        <div>
            <div className="sm-row"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="dropdown-label dropdown-label-margin-left">{parameter?.label}</div>
                <div className="grow" />
                <div className="dropdown-value">{value}</div>
                <Button className="button-dark" kind="secondary" hasIconOnly renderIcon={ChevronLeft32} iconDescription="next" onClick={onPreviousChild}></Button>
                <Button className="button-dark" kind="secondary" hasIconOnly renderIcon={ChevronRight32} iconDescription="previous" onClick={onNextChild}></Button>
            </div>

            <div hidden={isOpen !== true}>
                {
                    parameter?.enumDefinition?.entries.map(e => {
                        return (
                            <div
                                key={e}
                                className="sm-row sm-lighter"
                                onClick={() => setEntry(e)}
                            >
                                <div className="dropdown-label-margin-left">
                                {e}
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>
    )
}

export default ParameterDropdown