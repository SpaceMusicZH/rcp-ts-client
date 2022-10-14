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
};

export default class SMHeaderC extends React.Component<Props & InjectedProps, State>
{

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
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
                        onsrc='/sm_logo_on.png'>                        
                    </SettingsToggleButtonC>
                    
                    <div className='grow scene-name flex-h margin-left'>
                        {this.props.sceneNameParameter?.value || ""}
                    </div>

                    <SettingsToggleButtonC
                        {...this.props}
                        parameter={this.props.settingsParameter}
                        offsrc='/settings_off.png'
                        onsrc='/settings_on.png'>
                    </SettingsToggleButtonC>
                </div>

            </div>
        );
    }
}

export const SMHeader = parameterWrapped({ignoreReadonly: true})(SMHeaderC);