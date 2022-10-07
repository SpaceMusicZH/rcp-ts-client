import React, { Component, useState, PropsWithChildren, useEffect } from "react";
import { Dropdown, Button } from 'carbon-components-react'
import { COLOR_LABEL, COUNT_LABEL, SOLO_LABEL, MUTE_LABEL, LOCK_LABEL } from './WidgetConfig'; 
import { ParameterTabsGroupC } from './ParameterTabsGroup';

const ParameterTrackSelector = ({ children, parameter, value, handleValue, onSubmitCb, tabId, selectedTab }) => {

    var childNames = [];
    var groupChildren = [];
    var currentParam;

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

    if (parameter)
    {
        var current_name = "";
        
        groupChildren = parameter.children            
            .sort((a, b) => ((a.order || 0) - (b.order || 0)));
    
        childNames = groupChildren
            .map((param, index) => {
                const l = param.label !== undefined ? param.label : "";
                if (index === currentChild) {
                    current_name = l
                }
                return l;
            });
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
                itemToString={(item) => item?.label}
                itemToElement={(item) => 
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        minHeight: "48px"
                    }}>
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
                        <Button className="in-dropdown-button" size="sm" kind="secondary">Solo</Button>
                        <Button className="in-dropdown-button" size="sm" kind="secondary">Mute</Button>
                        <Button className="in-dropdown-button" size="sm" kind="secondary">Lock</Button>
                    </div>
                }
                renderSelectedItem={(item) =>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                    }}>
                        <div className="colorCircle" style={{
                            width: 20,
                            borderRadius: "50%",
                            backgroundColor: "#F7F383",
                            marginRight: "1em"
                        }}></div>
                        <div>{item.label}</div>
                        <div className="grow"/>
                        <div className="track-note-count">{ noteCountParam?.value }</div>
                        <Button className="in-dropdown-button" size="sm" kind="secondary">Solo</Button>
                        <Button className="in-dropdown-button" size="sm" kind="secondary">Mute</Button>
                        <Button className="in-dropdown-button" size="sm" kind="secondary">Lock</Button>
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