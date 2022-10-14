import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';

interface Props {
};

type State = {
    isOpen: boolean;
};

export class ParameterImageC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            isOpen: false,
        };
    }

    render() {

        const param = this.props.parameter;
        const label = param?.label || "";
        
        const blob = new Blob([this.props.value]);
        const url = window.URL.createObjectURL(blob);

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            <div className='flex-h-only'>
                <img className='parameter-image' src={url} alt={label || "image"}/>
                <div className='image-title flex-h'>
                    <div className='margin-left'>
                    {label}
                    </div>
                </div>
            </div>
        );
    }
};

export const ParameterImage = parameterWrapped()(ParameterImageC);
