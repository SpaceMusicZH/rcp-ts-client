import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { GroupParameter, Parameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';
import { Accordion, AccordionItem } from 'carbon-components-react';
import { WIDGET_EXPANDEDBYDEFAULT_STR, WIDGET_NOTFOLDABLE_STR } from './WidgetConfig';

interface Props {
    style?: React.CSSProperties;
};

interface State {
    isOpen: boolean;
};

export class ParameterFoldableGroupC extends React.Component<Props & InjectedProps, State>
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
    
    render()
    {        
        const param = this.props.parameter;
        const label = param?.label ?? "no label";

        return (
            <Accordion
                className='widget_foldablegroup'
                id={param?.id.toString() || "group"}
            >
                <AccordionItem
                    className={param?.userid ?? "foldable_group"}
                    title={label}
                    open={this.state.isOpen}
                >
                    {this.renderChildren()}
                </AccordionItem>
            </Accordion>
            // <div style={this.props.style}>
            //     <ControlGroup 
            //         style={{marginBottom: this.state.isOpen ? 5 : 0}}
            //         vertical={false} 
            //         onClick={this.handleButtonClick}
            //     >
            //         <Icon icon={this.state.isOpen ? "remove" : "add"}/>
            //         <div style={{marginLeft: 10}}/>
            //         <label className="bx--label">{label}</label>
            //     </ControlGroup>
            //     <Collapse isOpen={this.state.isOpen}>
            //         {this.renderChildren()}
            //     </Collapse>
            // </div>
        );
    }

    // private handleButtonClick = () => {

    //     this.setState({
    //         isOpen: !this.state.isOpen,
    //     });
    // }
};

export const ParameterFoldableGroup = parameterWrapped({ignoreReadonly: true})(ParameterFoldableGroupC);