import * as React from 'react';
import { RemoteProject } from './ConnectionList';
import { InjectedProps } from './ElementWrapper';

interface Props {
    project: RemoteProject;
    connectCb: (project: RemoteProject) => void;
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
                onClick={() => this.props.connectCb(this.props.project)}
            >
                <div className='tunnel-circle'></div>

                <label className='tunnel-row-child'
                    style={{ marginLeft: "10px"}}>
                    {this.props.project.name}
                </label>

                <div className='grow'></div>

                <img
                    style={{
                        width: "auto",
                        height: "auto",
                        margin: "auto",
                        marginRight: "1em"
                    }}
                    src={this.props.project.local ? "localIcon.png" : "remoteIcon.png"}
                />

            </div>
        );
    }
}