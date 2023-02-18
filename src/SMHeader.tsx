import { GroupParameter, StringParameter } from 'rabbitcontrol';
import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { SettingsToggleButtonC } from './SettingsToggleButton';

interface Props {
    settingsParameter?: GroupParameter
    threeDViewParameter?: GroupParameter
    sceneNameParameter?: StringParameter
};

interface State {
    threedViewOn: boolean
    settingsViewOn: boolean
};

export default class SMHeaderC extends React.Component<Props & InjectedProps, State>
{

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            threedViewOn: false,
            settingsViewOn: false
        };
    }

    render() {
        return (
            <div className="smheader">

                <div className="header-empty">                    
                </div>

                <div className="header-line grow">
                                        
                    <SettingsToggleButtonC
                        {...this.props}
                        parameter={this.props.threeDViewParameter}
                        offsrc='/sm_logo_off.png'
                        onsrc='/sm_logo_on.png'
                        forceOff={this.state.settingsViewOn}
                        onOpenChanged={(open: boolean) => {
                            this.setState({ threedViewOn: open });
                        }}
                    />
                    
                    <div className='grow scene-name flex-h margin-left'>
                        {this.props.sceneNameParameter?.value || ""}
                    </div>

                    <SettingsToggleButtonC
                        style={{
                            display: this.props.settingsParameter ? undefined : "none"
                        }}
                        {...this.props}
                        parameter={this.props.settingsParameter}
                        offsrc='/settings_off.png'
                        onsrc='/settings_on.png'
                        forceOff={this.state.threedViewOn}
                        onOpenChanged={(open: boolean) => {
                            this.setState({ settingsViewOn: open });
                        }}
                    />
                </div>

            </div>
        );
    }
}

export const SMHeader = parameterWrapped({ignoreReadonly: true})(SMHeaderC);