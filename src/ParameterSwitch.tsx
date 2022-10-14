import Toggle from 'carbon-components-react/lib/components/Toggle';
import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';

interface Props {
    labelDisabled?: boolean;
};

interface State {
};

export class ParameterSwitchC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {        
        };
    }    

    handleChange = (event: React.FormEvent<HTMLElement>) => {

        if (this.props.handleValue) {
            this.props.handleValue((event.target as HTMLInputElement).checked);
        }

        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as boolean;    
        let readOnly:boolean|undefined;


        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly;        
        }

        const { onSubmitCb, handleValue, tabId, selectedTab, labelDisabled, ...filteredProps } = this.props;

        return (

            <div className={this.props.labelDisabled === true ? "sm-margin-auto" : "sm-row"}>
                <div hidden={this.props.labelDisabled}
                    className="dropdown-label dropdown-label-margin-left">
                    {this.props.parameter?.label}
                </div>

                <div className="grow" />

                <Toggle
                    className='bool-switch'
                    {...filteredProps}
                    id={param?.id.toString() || "toggle"}
                    labelText=""
                    labelA=""
                    labelB=""
                    toggled={value ? value : false}
                    onChange={this.handleChange}
                    disabled={readOnly === true || filteredProps.disabled === true}
                />
            </div>
        );
    }
};

export const ParameterSwitch = parameterWrapped()(ParameterSwitchC);