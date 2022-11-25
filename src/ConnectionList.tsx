import * as React from 'react';
import { Button, TextInput } from 'carbon-components-react';
import ConnectionListEntry from './ConnectionListEntry';

interface Props {
    connectCb: (host: string, port: number) => void;
};

type State = {
    host: string;
    port: number;
    projects?: Array<RemoteProject>;
    apikey?: string;
};

export class RemoteProject {

    public name: string;
    public remoteAddress: string;
    public localAddress: string;

    constructor(name: string, remote: string, local: string)
    {
        this.name = name;
        this.remoteAddress = remote;
        this.localAddress = local;
    }
}


export default class ConnectionList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    
        this.state = {
            host: "",
            port: 10000
        };
    }
    
    componentDidMount(): void {
        
        if (window.location.search !== "") {
            const params = new URLSearchParams(window.location.search);

            // apikey
            if (params.has("apikey"))
            {
                const apikey = params.get("apikey") || undefined;
                this.getProjects(apikey);
                this.setState({ apikey: apikey });
            }
        }
    }

    getProjects = (apikey?: string) =>
    {       
        if (apikey === undefined || apikey === "") return;

        const resultCb = this.parseProjects;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://rabbithole.rabbitcontrol.cc/api/v1/projects');
        // xhr.setRequestHeader('x-real-ip', 'test');
        xhr.setRequestHeader('rcp-key', apikey);
        xhr.responseType = 'text';
        xhr.onload = function () {
            if (xhr.status === 200) {
                if (resultCb) resultCb(xhr.response);
            } else {
                console.error("error code: " + xhr.status);
            }
        };

        try {
            xhr.send();
        } catch (e){
            console.error(e);
        }
    }


    parseProjects = (content: string) =>
    {        
        const obj = JSON.parse(content);
        const rip = obj.requestip;
        const arr = new Array<RemoteProject>();

        if (obj.projects)
        {
            obj.projects.forEach((p: any) =>
            {
                if (p.active === true)
                {
                    // add as remote project
                    let localAddress: string = "";
                    if (rip !== undefined &&
                        rip === p.remoteip &&
                        p.metadata &&
                        p.metadata.local_ip)
                    {
                        localAddress = p.metadata.local_ip;
                    }

                    const rp = new RemoteProject(p.name, `wss://rabbithole.rabbitcontrol.cc/rcpclient/connect?key=${p.key}`, localAddress);
                    arr.push(rp);
                }
            });
        }

        this.setState({ projects: arr.length > 0 ? arr : undefined });
    }

    projectConnectCb = (project: RemoteProject) =>
    {
        if (project.localAddress !== undefined && project.localAddress !== "")
        {
            let port = 10000;
            let parts = project.localAddress.split(":");
            if (parts.length > 0)
            {
                port = parseInt(parts[1]);
                if (port === 0) port = 10000;
            }

            this.props.connectCb(parts[0], port);
        }
        else if (project.remoteAddress !== undefined && project.remoteAddress !== "")
        {
            this.props.connectCb(project.remoteAddress, 443);
        }
        else
        {
            console.error("no valid address");
            
        }
    }

    renderProjects()
    {
        if (this.state.projects)
        {
            return this.state.projects.map((p, index) => {
                return <ConnectionListEntry
                    key={index}
                    project={p}
                    connectCb={this.projectConnectCb}
                />
            })
        }
    }

    setHost = (e: any) => {
        this.setState({
            host: e.currentTarget.value as string,
        });
    }

    setPort = (e: any, direction: any, value: any) => {
        
        if (direction !== undefined &&
            direction.value !== undefined)
        {        
            this.setState({
                port: direction.value,
            });
        }
        else if (value !== undefined &&
            !isNaN(value))
        {
            this.setState({
                port: value,
            });
        }
        else
        {
            console.error("invalid direction from NumberInput");            
        }
    }

    doManualConnect = () =>
    {
        let port = 10000;
        if (this.state.host.startsWith("wss") ||
            this.state.host.startsWith("https"))
        {
            port = 443;
        }
        else if (this.state.host.startsWith("ws") ||
                 this.state.host.startsWith("http"))
        {
            port = 80;
        }

        let host = this.state.host;

        if (host.startsWith("https://rabbithole.rabbitcontrol.cc") &&
            host.includes("client/index.html"))
        {
            if (host.includes("mode=private#"))
            {
                host = host.replace("client/index.html?mode=private#", "rcpclient/connect?key=");
            }
            else
            {
                host = host.replace("client/index.html#", "public/rcpclient/connect?key=");
            }
        }

        this.props.connectCb(host, port);
    }

    render() {
        return (
            <div>

                <div className='section-title'>
                    <label className='grouplabel'>Available Clients</label>
                </div>

                <div style={{ marginTop: "3em" }} className='connection-panel'>
                    {
                        this.state.projects !== undefined ?
                            <div>
                                <div className='flex-h'>
                                    <label className='sm-margin-auto' style={{ color: "#8D8D8D" }}>
                                        Click on a name to connect to SpaceMusic
                                    </label>
                                </div>

                                <div style={{ marginTop: "3em" }}>
                                    {this.renderProjects()}
                                </div>
                            </div>

                            :

                            this.state.apikey !== undefined ?
                                <div className='flex-h'>
                                    <label className='sm-margin-auto' style={{ color: "#8D8D8D" }}>
                                        No clients are available. Please refresh or connect manually.
                                    </label>
                                </div>
                                :

                                <div className='flex-h'>
                                    <label className='sm-margin-auto' style={{ color: "#8D8D8D" }}>
                                        No Api-Key provided.
                                    </label>
                                </div>
                    }

                    <div className='refresh-button'
                        style={{
                            marginTop: "1em",
                            display: this.state.apikey ? "" : "none"
                        }}
                    >
                        <a className='sm-margin-auto'
                            onClick={() => this.getProjects(this.state.apikey)}
                        >
                            <img
                                className='sm-row-maxheight'
                                src="refresh.png"
                            />
                        </a>
                    </div>
                </div>



                <div className='section-title' style={{ marginTop: "4em" }}>
                    <label className='grouplabel'>Connect Manually</label>
                </div>

                <div className='connection-panel'>
                    <TextInput style={{ marginTop: "2em" }}
                        placeholder='Enter IP Adress or Tunnel URL'
                        id={'connectioninput'}
                        labelText={''}
                        value={this.state.host}
                        onChange={this.setHost}
                    >
                    </TextInput>

                    <Button
                        style={{ marginTop: "1em" }}
                        kind="ghost"
                        onClick={this.doManualConnect}
                    >
                        Connect
                    </Button>
                </div>


            </div>
        );

    }
};
