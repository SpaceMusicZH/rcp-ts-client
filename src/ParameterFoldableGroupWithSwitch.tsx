import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { BooleanParameter, GroupParameter, Parameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { ONOFF_TOGGLE_ID, WIDGET_EXPANDEDBYDEFAULT_STR } from './WidgetConfig';
import { ParameterSwitchC } from './ParameterSwitch';
import { Accordion, AccordionItem } from 'carbon-components-react';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    isOpen: boolean;
    switchParameter?: BooleanParameter;
    switchParameterOn: boolean;
};

export class ParameterFoldableGroupSWC extends React.Component<Props & InjectedProps, State>
{
    constructor(props: Props & InjectedProps) {
        super(props);

        let is_open = false;
        if (props.parameter &&
            props.parameter.userid !== undefined)
        {
            is_open = props.parameter.userid.includes(WIDGET_EXPANDEDBYDEFAULT_STR);
        }
    
        this.state = {
            isOpen: is_open,
            switchParameterOn: false
        };
    } 

    onSubmit = () =>
    {
        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }

    renderChildren()
    {
        const parameter = this.props.parameter;

        if (parameter === undefined)
        {
            return ("");
        }

        return (parameter as GroupParameter).children
            .filter( (p) => 
            {
                return !(p instanceof BooleanParameter) && p.userid !== ONOFF_TOGGLE_ID;
            })
            .sort((a: Parameter, b: Parameter): number => 
            {
                return ((a.order || 0) - (b.order || 0));
            })           
            .map( (p) => { 
                return (
                    <ParameterWidget 
                        key={p.id}
                        parameter={p} 
                        onSubmitCb={this.onSubmit}
                    />
                );
            });
    }

    componentDidUpdate(prevProps: Readonly<Props & InjectedProps>, prevState: Readonly<State>, snapshot?: any): void
    {
        const param = this.props.parameter;
        if (this.state.switchParameter === undefined)
        {
            // iterate children - find a BooleanParameter with label "_onoff"
            (param as GroupParameter).children.forEach(element =>
            {
                if (element instanceof BooleanParameter &&
                    element.userid?.includes(ONOFF_TOGGLE_ID))
                {
                    if (this.state.switchParameter !== element)
                    {
                        this.setState({
                            switchParameterOn: element.value,
                            switchParameter: element
                        });

                        element.addValueChangeListener((p) =>
                        {
                            this.setState({
                                switchParameterOn: (p as BooleanParameter).value
                            });
                            
                        });
                    }
                }
            });
        }
    }
    
    render()
    {
        let label = "no label";
        const param = this.props.parameter;
        if (param && param.label !== undefined) {
            label = param.label;
        }

        const { parameter, ...filteredProps } = this.props;

        return (

            <div className='widget_foldablegroup_with_switch'>
                <Accordion
                    id={param?.id.toString() || "group"}
                    title="ParameterFoldableGroupSWC"
                >
                    <AccordionItem
                        className={param?.userid ? param.userid : ""}
                        title={label + "_ParameterFoldableGroupSWC"}
                        open={this.state.isOpen}
                        renderExpando={() =>
                            <div style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center"
                            }}>
                                <button className='bx--accordion__heading'
                                    type='button'
                                    onClick={this.handleToggle}
                                >       
                                    <svg focusable="false" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" className="bx--accordion__arrow">
                                        <path d="M11 8L6 13 5.3 12.3 9.6 8 5.3 3.7 6 3z"></path>
                                    </svg>
                                    <div className='bx--accordion__title' dir='auto'>{label}</div>                                    
                                </button>
                                
                                <ParameterSwitchC
                                    {...filteredProps}
                                    parameter={this.state.switchParameter}
                                    handleValue={this.handleToggleChange}
                                    value={this.state.switchParameterOn}
                                    disabled={this.state.switchParameter === undefined}
                                    labelDisabled={true}
                                />
                                <div style={{
                                    marginRight: 15
                                }}></div>
                            </div>
                        }
                    >
                        {this.renderChildren()}
                    </AccordionItem>
                </Accordion>
            </div>
        );
    }

    private handleToggle = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }


    private handleToggleChange = (state: boolean) => 
    {        
        if (this.state.switchParameter)
        {
            this.state.switchParameter.value = state;
            this.onSubmit();
        }
    }
};

export const ParameterFoldableGroupSW = parameterWrapped({ignoreReadonly: true})(ParameterFoldableGroupSWC);