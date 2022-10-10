import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { BooleanParameter, ChangedListener, Parameter } from 'rabbitcontrol';
import { Button } from 'carbon-components-react';

interface Props {
    label?: string;
    parameter: BooleanParameter;
    className?: string;
    classNamePrefix?: string;
};

interface State {
    checked: boolean;
};

export class ParameterToggleButtonC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = { 
            checked: this.props.parameter.value
        };
    }
    

    parameterChanged = (p: Parameter) =>
    {
        if (p instanceof BooleanParameter)
        {
            this.setState({
                checked: p.value
            });
        }
    }

    componentDidMount(): void {        
        this.props.parameter?.addValueChangeListener(this.parameterChanged);
    }

    componentWillUnmount(): void {
        this.props.parameter?.removeValueChangedListener(this.parameterChanged);
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
        event.stopPropagation();

        this.props.parameter.value = !this.props.parameter.value;

        if (this.props.onSubmitCb)
        {
            this.props.onSubmitCb();
        }
    }

    render() {
        const param = this.props.parameter;
        const readOnly = param?.readonly || false;

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            <Button
                className={this.props.className + (this.props.classNamePrefix ? (" " + this.props.classNamePrefix + (this.state.checked === true ? "-on" : "-off")) : "")}
                size="sm"
                kind={this.state.checked === true ? "primary" : "secondary"}
                onClick={this.onClicked}
                disabled={this.props.parameter === undefined || readOnly}
            >
                {this.props.label ? this.props.label : param?.label}
            </Button>
        );
    }
};

export const ParameterToggleButton = parameterWrapped()(ParameterToggleButtonC);