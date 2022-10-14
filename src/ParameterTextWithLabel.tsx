import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { NumberParameter, NumberDefinition } from 'rabbitcontrol';
import { DARK_GRAY1, GRAY1, LIGHT_GRAY5 } from './Globals';

interface Props {
    style?: React.CSSProperties;
    label?: string;
    labelDisabled?: boolean;
    labelWidth?: number;
    large?: boolean;
    fixedNumber?: number;
    defaultValue?: any;
};

interface State {
};

export class ParameterTextWithLabelC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
        };
    }    

    render() {

        const param = this.props.parameter;
        let unit = "";
        let value = this.props.defaultValue || "";
        let label = this.props.label;

        if (param) {
            label = param.label;
        }
        
        if (this.props.value !== undefined && this.props.value !== null) {
            value = this.props.value as string;
        }

        if (param instanceof NumberParameter) {
            const td = (param.typeDefinition as NumberDefinition);

            if (this.props.fixedNumber !== undefined) {
                value = this.props.value.toFixed(this.props.fixedNumber) as string;
            }

            if (td.unit) {
                unit = (param.typeDefinition as NumberDefinition).unit as string;
                value += " " + unit;
            }

            if (td.maximum && td.minimum) {
                if (param.value < td.minimum || param.value > td.maximum) {
                    value = "Err";
                }
            }            
        }

        return (
            
            <div className='sm-row'>
                <div className="dropdown-label dropdown-label-margin-left">
                    {this.props.parameter?.label}
                </div>

                <div className="grow" />

                <div className="dropdown-value">
                    {
                        value
                    }
                </div>
            </div>
        );
    }
};

export const ParameterTextWithLabel = parameterWrapped({ignoreReadonly:true})(ParameterTextWithLabelC);