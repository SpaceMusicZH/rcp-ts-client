import { Button, Modal } from 'carbon-components-react';
import { GroupParameter, Parameter } from 'rabbitcontrol';
import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { Settings16, Close16 } from '@carbon/icons-react';
import ParameterWidget from './ParameterWidget';
import ContentContainer from './ContentContainer';

interface Props {
    offsrc?: string;
    onsrc?: string;
    parameter?: GroupParameter;
};

interface State {
    on: boolean;
    settingY: number;
    width: number;
    height: number;
};

export class SettingsToggleButtonC extends React.Component<Props & InjectedProps, State>
{
    private ref: React.RefObject<HTMLDivElement>;


    constructor(props: Props & InjectedProps)
    {
        super(props);

        this.ref = React.createRef();

        this.state = {
            on: false,
            settingY: 0,
            width: 0,
            height: 0
        };
    }

    componentDidMount(): void {

        const top = ((this.ref.current?.offsetTop || 0) + (this.ref.current?.offsetHeight || 0));
        this.setState({
            settingY: top,
            width: window.innerWidth,
            height: window.innerHeight - top
        })
    }

    toggle = () => {
        this.setState({ on: !this.state.on });
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
            }).
            map( (p) => { 
                return (
                    <ParameterWidget 
                        key={p.id}
                        parameter={p} 
                        onSubmitCb={this.onSubmit}
                    />
                );
            });
    }

    render() {
        return (
            // <Button
            //     ref={this.ref}
            //     className={"settings-" + (this.state.on ? "on" : "off")}
            //     hasIconOnly
            //     iconDescription="Settings"
            //     renderIcon={(this.props.offsrc && this.props.onsrc) ?  undefined : (this.state.on ? Close16 : Settings16)}
            //     onClick={this.toggle}
            //     disabled={this.props.parameter === undefined}
            // >
            // </Button>
            <div
            ref={this.ref}
            >
                <a
                    onClick={this.toggle}
                >
                    <img
                        className='sm-row-maxheight'
                        src={this.state.on ? this.props.onsrc : this.props.offsrc}
                    />
                </a>
                <div
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    className='settings-modal'
                    style={{
                        height: this.state.height,
                        top: this.state.settingY,                        
                        display: this.state.on ? "block" : "none"
                    }}
                >
                    {/* {
                        this.props.parameter !== undefined
                            ?
                            <ContentContainer
                                parameter={this.props.parameter}
                                onSubmitCb={this.props.onSubmitCb}
                                selectedTab={this.state.on ? 0 : -1}
                                tabId={0}
                            >
                            </ContentContainer>

                            :
                            ""
                    } */}

                    {this.renderChildren()}
                </div>
            </div>
        );
    }
}

export const SettingsToggleButton = parameterWrapped({ignoreReadonly: true})(SettingsToggleButtonC);