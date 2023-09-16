import { BangParameter, ImageParameter } from 'rabbitcontrol';
import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { ParameterImageC } from './ParameterImage';

interface Props {
    imageParameter?: ImageParameter
    bangParameter?: BangParameter
    onSubmitCb: () => void;
};

type State = {
    isPressed: boolean;
};

export class ParameterImageButtonC extends React.Component<Props & InjectedProps, State>
{
    constructor(props: Props & InjectedProps)
    {
        super(props);
    
        this.state = {
            isPressed: false
        };
    }

    handleClick = (event: React.MouseEvent<HTMLElement>) =>
    {
        if (this.props.bangParameter)
        {
            this.props.bangParameter.setDirty();
            this.props.onSubmitCb();
        }
        else
        {
            console.log("ImageButton: no bang parameter set");            
        }
    }

    render() {

        const label = this.props.parameter?.label || "";        
        const { tabId, selectedTab, parameter, ...filteredProps } = this.props;
        const inactive = this.props.bangParameter === undefined;

        return (
            <div
                className={'flex-h-only' + (this.state.isPressed === true ? " imagebutton-pressed" : "")}
                onClick={this.handleClick}                
            >
                <ParameterImageC
                    {...filteredProps}
                    parameter={this.props.imageParameter}
                    inactive={inactive}
                >
                </ParameterImageC>
                
                <div className='image-title flex-h'>
                    <div className={'margin-left' + (inactive ? " parameter-imagebutton-inactive" : "")}>
                    {label}
                    </div>
                </div>
            </div>            
        );
    }
};

export const ParameterImageButton = parameterWrapped()(ParameterImageButtonC);
