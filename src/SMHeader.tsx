import { GroupParameter } from 'rabbitcontrol';
import * as React from 'react';
import { InjectedProps, parameterWrapped } from './ElementWrapper';
import { SettingsToggleButtonC } from './SettingsToggleButton';

interface Props {
    parameter?: GroupParameter
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
                    <img src='smlogo.svg' />
                    <label className='smlogofont'>SpaceMusic</label>
                    <div className='grow'></div>

                    <SettingsToggleButtonC
                        {...this.props}
                        offsrc='/smsettings.svg'
                        onsrc='/smsettings-on.svg'>                        
                    </SettingsToggleButtonC>
                </div>

            </div>
        );
    }
}

export const SMHeader = parameterWrapped({ignoreReadonly: true})(SMHeaderC);