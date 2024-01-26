import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { ImageParameter, Parameter } from 'rabbitcontrol';

interface Props {
    inactive?: boolean;
};

type State = {
    image?: HTMLImageElement;
};

export class ParameterImageC extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);

        let image;
        if (this.props.parameter instanceof ImageParameter)
        {
            image = this.loadImageData(this.props.parameter);
        }
            
    
        this.state = {
            image: image
        };
    }

    componentDidMount()
    {
        // setup callbacks
        if (this.props.parameter instanceof ImageParameter)
        {
            this.props.parameter.addValueChangeListener(this.parameterValueChanged);
        }
    }

    componentWillUnmount(): void
    {        
        if (this.props.parameter instanceof ImageParameter)
        {
            this.props.parameter.removeValueChangedListener(this.parameterValueChanged);
        }

        // remove resources
        window.URL.revokeObjectURL(this.state.image?.src || "");

        this.setState({
            image: undefined
        });
    }

    // parameter callbacks
    parameterValueChanged = (p: Parameter) =>
    {
        if (p instanceof ImageParameter)
        {            
            this.setState({
                image: this.loadImageData(p)
            });
        }
    }

    loadImageData = (p: ImageParameter) : HTMLImageElement =>
    {
        // create blob
        const blob = new Blob([p.value], { type: 'application/octet-binary' });
        // return url string
        const url = window.URL.createObjectURL(blob);

        let image = new Image();
        image.onload = () => {               
            URL.revokeObjectURL(url);
        }
        image.src = url;

        return image;
    }

    render() {

        const param = this.props.parameter;
        const label = param?.label || "";

        const { onSubmitCb, handleValue, tabId, selectedTab, ...filteredProps } = this.props;

        return (
            <div className='flex-h-only'>
                {
                    this.state.image !== undefined
                        ?

                        React.createElement("img", {
                            className: "parameter-image" + (this.props.inactive === true ? " parameter-imagebutton-inactive" : ""),
                            src: this.state.image.src,
                            alt: label || "image",                            
                        }, null)

                        :

                        "no image"
                }
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
