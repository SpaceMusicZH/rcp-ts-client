import { BangParameter, ImageParameter } from 'rabbitcontrol';
import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';

interface Props {
    imageParameter?: ImageParameter
    bangParameter?: BangParameter
    onSubmitCb: () => void;
};

type State = {
    isPressed: boolean;
};

export class ParameterImageButtonC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            isPressed: false,
        };
    }

    handleClick = (event: React.MouseEvent<HTMLElement>) => {

        const parameter = this.props.bangParameter;

console.log("click");


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
        
        var url = ""
        if (this.props.imageParameter)
        {            
            const blob = new Blob([this.props.imageParameter.value]);
            url = window.URL.createObjectURL(blob);
        }


        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            <div
                className={'flex-h-only' + (this.state.isPressed === true ? " imagebutton-pressed" : "")}
                onClick={this.handleClick}                
            >
                <img className={'parameter-image' + (this.props.bangParameter === undefined ? " parameter-imagebutton-inactive" : "")} src={url} alt={label || "image"}/>                    
                
                <div className='image-title flex-h'>
                    <div className={'margin-left' + (this.props.bangParameter === undefined ? " parameter-imagebutton-inactive" : "")}>
                    {label}
                    </div>
                </div>
            </div>            
        );
    }
};

export const ParameterImageButton = parameterWrapped()(ParameterImageButtonC);
