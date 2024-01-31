import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { GroupParameter, Parameter } from 'rabbitcontrol';
import ParameterWidget from './ParameterWidget';

interface Props {
    style?: React.CSSProperties;
};

interface State {
};

export class ParameterSimpleGroupC extends React.Component<Props & InjectedProps, State>
{
    constructor(props: Props & InjectedProps) {
        super(props);
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
        return (
            <div className='widget_simplegroup'>
                {this.renderChildren()}
            </div>
        );
    }
};

export const ParameterSimpleGroup = parameterWrapped({ignoreReadonly: true})(ParameterSimpleGroupC);