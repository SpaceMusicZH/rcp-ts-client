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
                onClick={() => this.props.connectCb(this.props.tunnel)}
            >
                <div className='tunnel-circle'></div>

                <label className='tunnel-row-child'
                    style={{ marginLeft: "10px"}}>
                    {this.props.tunnel.name}
                </label>

                <div className='grow'></div>

                <img
                    style={{
                        width: "auto",
                        height: "auto",
                        margin: "auto",
                        marginRight: "1em"
                    }}
                    src={this.props.tunnel.localAddress !== undefined && this.props.tunnel.localAddress !== "" ? "localIcon.png" : "remoteIcon.png"}
                />

            </div>
        );
    }
}