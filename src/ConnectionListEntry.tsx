import * as React from 'react';
import { RemoteTunnel } from './ConnectionList';
import { InjectedProps } from './ElementWrapper';

interface Props {
    tunnel: RemoteTunnel;
    connectCb: (tunnel: RemoteTunnel) => void;
};

interface State {
};

export default class ConnectionListEntry extends React.Component<Props, State>
{
    constructor(props: Props & InjectedProps) {
        super(props);
    }

    render() {

        return (
            <div
                className='tunnel-row'
                onClick={() => {
                    if (this.props.tunnel.active)
                    {
                        this.props.connectCb(this.props.tunnel)
                    }                    
                }}
            >
                <div className={`tunnel-circle${this.props.tunnel.active ? "" : " offline"}`}></div>

                <label className={`tunnel-row-child${this.props.tunnel.active ? "" : " offline"}`}>
                    {this.props.tunnel.name}
                </label>

                <div className='grow'></div>

                <img className={`tunnel-icon${this.props.tunnel.active ? "" : " offline"}`}
                    src={this.props.tunnel.localAddress !== undefined && this.props.tunnel.localAddress !== "" && !window.location.protocol.startsWith("https") ? "localIcon.png" : "remoteIcon.png"}
                />

            </div>
        );
    }
}