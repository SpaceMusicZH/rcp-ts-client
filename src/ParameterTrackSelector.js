import React, { Component, useState, PropsWithChildren, useEffect } from "react";
import { Dropdown, Button } from 'carbon-components-react'
import { COLOR_LABEL, COUNT_LABEL, SOLO_LABEL, MUTE_LABEL, LOCK_LABEL } from './WidgetConfig'; 
import { ParameterTabsGroupC } from './ParameterTabsGroup';
import { ParameterToggleButtonC } from './ParameterToggleButton'

const ParameterTrackSelector = ({ children, parameter, value, handleValue, onSubmitCb, tabId, selectedTab }) =>
{
    var groupChildren = [];
    var currentParam;

     var[isOpen, setIsOpen] = useState(false);
    var [currentChild, setCurrentChild] = useState(0);
    var [lastSelected, setLastSelected] = useState(-1);

    var [colorParam, setColorParam] = useState({});
    var [noteCountParam, setNoteCountParam] = useState({});
    var [soloParam, setSoloParam] = useState({});
    var [muteParam, setMuteParam] = useState({});
    var [lockParam, setLockParam] = useState({});

    useEffect(() => {
        if (selectedTab !== tabId) {
            setCurrentChild(-1);
        }
    }, []);

    useEffect(() => {
        console.log("ParameterTrackSelector current child changed!!");

        if (currentChild >= 0 &&
            currentChild < groupChildren.length)
        {
            currentParam = groupChildren[currentChild];

            currentParam.children.forEach(element => {
                if (element.label === COLOR_LABEL)
                {
                    console.log("found color param!");
                    setColorParam(element);
                }
                else if (element.label === COUNT_LABEL)
                {
                    console.log("found count param!");
                    setNoteCountParam(element);
                }
                else if (element.label === SOLO_LABEL)
                {
                    console.log("found solo param!");
                    setSoloParam(element);
                }
                else if (element.label === MUTE_LABEL)
                {
                    console.log("found mute param!");
                    setMuteParam(element);
                }
                else if (element.label === LOCK_LABEL)
                {
                    console.log("found lock param!");
                    setLockParam(element);
                }
            });
        }
        else
        {
            // ?
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


    function handleChange(data)
    {
        setCurrentChild(groupChildren.indexOf(data.selectedItem));

        if (isOpen === true)
        {
            setIsOpen(false);
        }

        // if (handleValue) {
        //     handleValue(data.selectedItem);
        // }

        // if (onSubmitCb) {
        //     onSubmitCb();
        // }
    }

    function renderCurrentChildGroups()
    {
        if (currentChild >= 0)
        {
            const child = groupChildren[currentChild];
    
            if (child !== undefined)
            {
                // check for widget-type somehow??
                if (child.widget &&
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

    function onSoloClicked(event, param)
    {
        event.stopPropagation();

        if (param)
        {
            console.log("solo: " + (param.label || param._label || "no label"));
        }
    }
    function onMuteClicked(event, param)
    {
        event.stopPropagation();

        if (param)
        {
            console.log("mute: " + (param.label || param._label || "no label"));
        }
    }
    function onLockClicked(event, param)
    {
        event.stopPropagation();

        if (param)
        {
            console.log("lock: " + (param.label || param._label || "no label"));
        }
    }

    if (parameter)
    {
        groupChildren = parameter.children            
            .sort((a, b) => ((a.order || 0) - (b.order || 0)));
    }

    return (
        <div>

            <Dropdown
                className="track-selector"
                id={parameter?.id.toString() || "dropdown"}
                label=""
                hideLabel={true}
                onChange={handleChange}
                disabled={parameter?.readonly === true}
                items={groupChildren}
                selectedItem={groupChildren[currentChild]}
                renderSelectedItem={(item) =>

                    // isOpen === true                        
                    //     ?

                    //     <div style={{
                    //         display: "flex",
                    //         flexDirection: "row",
                    //     }}
                    //         onClick={() => {if (isOpen === true) setIsOpen(false)}}
                    //     >
                    //         <div>All Tracks</div>
                    //         <div className="grow" />
                    //         <div>{
                    //             groupChildren.reduce((total, current) => {
                    //                 var count_param = current.children.find((e) => e.label === COUNT_LABEL);
                    //                 if (count_param !== undefined &&
                    //                     count_param.value !== undefined)
                    //                 {               
                    //                     if (typeof (count_param.value) === "number")
                    //                     {
                    //                         return total + count_param.value;
                    //                     }
                    //                     else
                    //                     {
                    //                         var num = parseInt(count_param.value);
                    //                         if (!Number.isNaN(num))
                    //                         {
                    //                             // parse ok - add
                    //                             return total + num;                                                
                    //                         }
                                            
                    //                         console.log("string is not a number: " + count_param.value);
                    //                         // parsing not ok
                    //                     }
                    //                 }
                    //                 return total;
                    //             }, 0)
                    //         }</div>
                    //     </div>

                    //     :

                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                        }}
                            onClick={() => { if (isOpen !== true) setIsOpen(true) }}
                        >
                            <div className="colorCircle" style={{
                                width: 20,
                                borderRadius: "50%",
                                backgroundColor: "#F7F383",
                                marginRight: "1em"
                            }}></div>
                            <div>{item.label}</div>
                            <div className="grow" />
                            <div className="track-note-count">{noteCountParam?.value}</div>
                            <ParameterToggleButtonC
                                className="in-dropdown-button"
                                classNamePrefix="solo-btn"
                                onSubmitCb={onSubmitCb}
                                label="Solo"
                                parameter={item.children.find((e) => e.label === SOLO_LABEL)}></ParameterToggleButtonC>
                            <ParameterToggleButtonC
                                className="in-dropdown-button"
                                classNamePrefix="mute-btn"
                                onSubmitCb={onSubmitCb}
                                label="Mute"
                                parameter={item.children.find((e) => e.label === MUTE_LABEL)}></ParameterToggleButtonC>
                            <ParameterToggleButtonC
                                className="in-dropdown-button"
                                classNamePrefix="lock-btn"
                                onSubmitCb={onSubmitCb}
                                label="Lock"
                                parameter={item.children.find((e) => e.label === LOCK_LABEL)}></ParameterToggleButtonC>
                        </div>

                }
                itemToString={(item) => item?.label}
                itemToElement={(item) => 
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        minHeight: "48px"
                    }}                    
                    >
                        <div className="colorCircle" style={{
                            backgroundColor: "#F7F383",
                        }}></div>                    
                        <div>{
                            item.label || item._label || "no"
                        }</div>
                        <div className="grow"/>
                        <div className="track-note-count">{
                            item.children.find((e) => e.label === COUNT_LABEL)?.value?.toString()
                        }</div>
                        <ParameterToggleButtonC
                            className="in-dropdown-button"
                            classNamePrefix="solo-btn"
                            onSubmitCb={onSubmitCb}
                            label="Solo"
                            parameter={item.children.find((e) => e.label === SOLO_LABEL)}></ParameterToggleButtonC>
                        <ParameterToggleButtonC
                            className="in-dropdown-button"
                            classNamePrefix="mute-btn"
                            onSubmitCb={onSubmitCb}
                            label="Mute"
                            parameter={item.children.find((e) => e.label === MUTE_LABEL)}></ParameterToggleButtonC>
                        <ParameterToggleButtonC
                            className="in-dropdown-button"
                            classNamePrefix="lock-btn"                            
                            onSubmitCb={onSubmitCb}
                            label="Lock"
                            parameter={item.children.find((e) => e.label === LOCK_LABEL)}></ParameterToggleButtonC>
                    </div>
                }
            >
            </Dropdown>

            {/* group parameter */}
            {renderCurrentChildGroups()}
        </div>
    )
}

export default ParameterTrackSelector