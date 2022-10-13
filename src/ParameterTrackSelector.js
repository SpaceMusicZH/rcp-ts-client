import React, { useState, useEffect } from "react";
import { Icon } from 'carbon-components-react'
import { iconChevronDown, iconChevronUp } from 'carbon-icons'
import { COUNT_ID, SOLO_ID, MUTE_ID, LOCK_ID, SYNC_ALL_TRACKS_ID } from './WidgetConfig'; 
import { ParameterTabsGroupC } from './ParameterTabsGroup';
import { ParameterToggleButtonC } from './ParameterToggleButton'
import { ParameterColorDivC } from "./ParameterColorDiv";

export const ParameterTrackSelector = ({ children, parameter, value, handleValue, onSubmitCb, tabId, selectedTab }) =>
{
    var groupChildren = [];
    var currentParam;

    var [isOpen, setIsOpen] = useState(false);
    var [currentChild, setCurrentChild] = useState(0);
    var [lastSelected, setLastSelected] = useState(-1);

    useEffect(() => {
        if (selectedTab !== tabId) {
            setCurrentChild(-1);
        }
    }, []);

    useEffect(() => {
        if (currentChild >= 0 &&
            currentChild < groupChildren.length)
        {
            currentParam = groupChildren[currentChild];
        }
        else
        {
            currentParam = undefined;
        }

    }, [currentChild]);


    useEffect(() => {
        
        if (lastSelected !== selectedTab)
        {
            if (selectedTab === tabId) {

                if (currentChild < 0)
                {     
                    setCurrentChild(0);
                }
            }
            else
            {
                setCurrentChild(-1);
            }
            
            setLastSelected(selectedTab);
        }

    }, [tabId, selectedTab]);


    function renderCurrentChildGroups()
    {
        if (currentChild >= 0)
        {
            const child = groupChildren[currentChild];
    
            if (child !== undefined)
            {
                // check for group
                // check for special widget
                if (child.typeDefinition.datatype === 40 &&
                    child.widget &&
                    child.widget.widgetType === 32770)
                {                        
                    return (
                        <ParameterTabsGroupC
                            parameter={child}
                            value={undefined}
                            selectedTab={currentChild}
                            tabId={currentChild}
                        >
                        </ParameterTabsGroupC>
                    );
                }
    
                // don't render anything else!

                // else
                // return parameter.children
                // .filter(param => param instanceof GroupParameter)
                // .sort((a: Parameter, b: Parameter): number => ((a.order || 0) - (b.order || 0)))
                // .map((p, i) =>
                // { 
                //     return (
                //         <ParameterWidget 
                //             key={p.id}
                //             parameter={p}
                //             onSubmitCb={this.onSubmit}
                //             tabId={i}
                //             selectedTab={currentChild}
                //         />
                //     );
                // });
            }
        }
        
        return ("");
    }

    function changedTrack(track)
    {
        if (groupChildren.indexOf(track) > -1)
        {
            setCurrentChild(groupChildren.indexOf(track));
        }

        setIsOpen(false);
    }


    if (parameter)
    {
        groupChildren = parameter.children
            .filter((e) => e.typeDefinition.datatype === 40)
            .sort((a, b) => ((a.order || 0) - (b.order || 0)));
        
        if (currentChild >= 0)
        {
            currentParam = groupChildren[currentChild];
        }
        else
        {
            currentParam = undefined;
        }
    }


    return (

        <div>

            {/* header */}
            {
                isOpen === true ?

                    <div className="sm-row"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Icon
                            description=""
                            className="sm-icon"
                            icon={iconChevronUp}
                            fill="white"
                        ></Icon>
                        
                        <div
                            className="dropdown-label dropdown-label-margin-left">
                            All Tracks
                        </div>
                        
                        <div className="grow" />

                        {/* sum of notes */}
                        <div className="dropdown-value">
                            {
                            groupChildren.reduce((total, current) => {
                                var count_param = current.children.find((e) => e.userid === COUNT_ID);
                                if (count_param !== undefined &&
                                    count_param.value !== undefined) {
                                    if (typeof (count_param.value) === "number") {
                                        return total + count_param.value;
                                    }
                                    else {
                                        var num = parseInt(count_param.value);
                                        if (!Number.isNaN(num)) {
                                            // parse ok - add
                                            return total + num;
                                        }

                                        console.log("string is not a number: " + count_param.value);
                                        // parsing not ok
                                    }
                                }
                                return total;
                            }, 0)
                            }
                        </div>

                        <ParameterToggleButtonC
                            className="in-dropdown-button"
                            classNamePrefix="sync-all-tracks"
                            onSubmitCb={onSubmitCb}
                            parameter={parameter?.children?.find((e) => e.userid === SYNC_ALL_TRACKS_ID)}
                        ></ParameterToggleButtonC>
                    </div>

                :

                    <div className="sm-row"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <Icon
                            description=""
                            className="sm-icon"
                            icon={iconChevronDown}
                            fill="white"
                        ></Icon>

                        <div
                            className={"color-circle color-circle-" + currentChild}>                            
                        </div>

                        <div className="dropdown-label dropdown-label-margin-left">{currentParam?.label || "no"}</div>
                        
                        <div className="grow" />
                        
                        <div className="dropdown-value">{currentParam?.children.find((e) => e.userid === COUNT_ID)?.value}</div>
                        
                        <ParameterToggleButtonC
                            className="in-dropdown-button"
                            classNamePrefix="solo-btn"
                            onSubmitCb={onSubmitCb}
                            parameter={currentParam?.children.find((e) => e.userid === SOLO_ID)}
                        ></ParameterToggleButtonC>
                        
                        <ParameterToggleButtonC
                            className="in-dropdown-button"
                            classNamePrefix="mute-btn"
                            onSubmitCb={onSubmitCb}
                            parameter={currentParam?.children.find((e) => e.userid === MUTE_ID)}
                        ></ParameterToggleButtonC>
                        
                        <ParameterToggleButtonC
                            className="in-dropdown-button"
                            classNamePrefix="lock-btn"
                            onSubmitCb={onSubmitCb}
                            parameter={currentParam?.children.find((e) => e.userid === LOCK_ID)}
                        ></ParameterToggleButtonC>
                    </div>
            }

        
            {/* all tracks */}
            <div hidden={isOpen !== true}>
                {
                    groupChildren
                        .filter(((parammeter) => parammeter.typeDefinition.datatype === 40))
                        .map((parameter, idx) => {
                        return (

                            <div
                                key={parameter.id}
                                className="sm-row sm-lighter"
                                onClick={() => changedTrack(parameter)}
                            >

                                <div
                                    className={"color-circle color-circle-" + idx}>                            
                                </div>
                                
                                <div className="dropdown-label dropdown-label-margin-left">
                                    {parameter.label}
                                </div>
                                
                                <div className="grow" />
                                
                                <div className="dropdown-value">
                                    {
                                        parameter.children.find((e) => e.userid === COUNT_ID)?.value?.toString()
                                    }
                                </div>

                                <ParameterToggleButtonC
                                    className="in-dropdown-button"
                                    classNamePrefix="solo-btn"
                                    onSubmitCb={onSubmitCb}
                                    parameter={parameter.children.find((e) => e.userid === SOLO_ID)}
                                ></ParameterToggleButtonC>
                                
                                <ParameterToggleButtonC
                                    className="in-dropdown-button"
                                    classNamePrefix="mute-btn"
                                    onSubmitCb={onSubmitCb}
                                    parameter={parameter.children.find((e) => e.userid === MUTE_ID)}
                                ></ParameterToggleButtonC>
                                
                                <ParameterToggleButtonC
                                    className="in-dropdown-button"
                                    classNamePrefix="lock-btn"
                                    onSubmitCb={onSubmitCb}
                                    parameter={parameter.children.find((e) => e.userid === LOCK_ID)}
                                ></ParameterToggleButtonC>
                            </div>

                        );
                    })
                }

            </div>

            {/* group parameter */}
            {renderCurrentChildGroups()}
        </div>
    )
}