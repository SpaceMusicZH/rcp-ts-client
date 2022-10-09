import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { BooleanParameter } from 'rabbitcontrol';
import { Button } from 'carbon-components-react';

interface Props {
    label?: string;
    parameter: BooleanParameter;
};

interface State {
    checked: boolean;
};

export class ParameterToggleButtonC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = { 
            checked: false
        };
    }    

    handleChange = (checked: boolean, id: string, event: React.ChangeEvent<HTMLInputElement>) => {

        if (this.props.handleValue) {
            this.props.handleValue(checked);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    onClicked = (event: any) => {
        console.log("CLIICK");
        event.stopPropagation();

        this.props.parameter.value = !this.props.parameter.value;
        this.setState({ checked: this.props.parameter.value });

        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as boolean || false;
        let readOnly:boolean|undefined;


        const param = this.props.parameter;
        if (param) {
            console.log("param: " + param.label);
            
            readOnly = param.readonly;        
        }
        else {
            console.log("no param");            
        }

        const boolean_param = param as BooleanParameter || undefined;

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            // {boolean_param !== undefined ? <div></div> : <div></div>}
            <Button
                className="in-dropdown-button"
                size="sm"
                kind={this.props.parameter.value ? "primary" : "secondary"}
                onClick={this.onClicked}>
            {this.props.label ? this.props.label : param?.label}
            </Button>
        );
    }
};

export const ParameterToggleButton = parameterWrapped()(ParameterToggleButtonC);