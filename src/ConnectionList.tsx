import * as React from 'react';
import { Button, Link, Modal, TextInput } from 'carbon-components-react';
import ConnectionListEntry from './ConnectionListEntry';
import validate from 'uuid-validate';
import { Buffer } from 'buffer';
import { Cookie } from './Cookie';
import { DEFAULT_RCP_PORT, SSL_PORT } from './Globals';
import { isReturnStatement } from 'typescript';


// @ts-ignore
window.Buffer = Buffer;

interface Props {
    connectCb: (host: string, port: number) => void;
    failed: boolean;
};

type State = {
    host: string;
    port: number;
    tunnels?: Array<RemoteTunnel>;
    apikey?: string;
    cookieAlertOpen: boolean;
    currentTunnel?: RemoteTunnel;
    autoconnect: boolean;
};

export class RemoteTunnel {

    public name: string;
    public remoteAddress: string;
    public localAddress: string;
    public active: boolean;

    constructor(name: string, remote: string, local: string, active: boolean)
    {
        this.name = name;
        this.remoteAddress = remote;
        this.localAddress = local;
        this.active = active;
    }
}


export default class ConnectionList extends React.Component<Props, State> {

    static readonly API_KEY = "apikey";
    static readonly COOKIE_OK_KEY = "storecookieok";
    static readonly AUTOCONNECT_KEY = "autoconnect";
    // static readonly TUNNEL_KEY = "tunnel";    

    private failedOnce = false;

    constructor(props: Props) {
        super(props);
    
        this.state = {
            host: "",
            port: DEFAULT_RCP_PORT,
            cookieAlertOpen: false,
            autoconnect: false
        };
    }
    
    componentDidMount(): void
    {
        if (window.location.search !== "")
        {
            const params = new URLSearchParams(window.location.search);

            // apikey
            if (params.has(ConnectionList.AUTOCONNECT_KEY))
            {
                const auto = params.get(ConnectionList.AUTOCONNECT_KEY) || undefined;
                if (auto === "1")
                {
                    this.setState({ autoconnect: true });
                }
            }

            // NOTE: disabled until needed
            // if necessary provide a url-encoded rabbithole-client-url as hash-parameter
            // use encodeURIComponent() or similar

            // if (params.has(ConnectionList.TUNNEL_KEY))
            // {
            //     const tunnel = params.get(ConnectionList.TUNNEL_KEY) || undefined;
            //     this.setState({ autoTunnel: tunnel });
            // }
        }


        // get stored apikey    
        const apikey = Cookie.getCookie(ConnectionList.API_KEY);        
        if (apikey)
        {
            this.setState({ apikey: apikey });
            this.getTunnels(apikey);
        }        
    }

    getTunnels = (apikey?: string) =>
    {       
        if (apikey === undefined || apikey === "") return;

        const resultCb = this.parseTunnels;
        const self = this;

        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://rabbithole.rabbitcontrol.cc/api/v1/projects');
        xhr.setRequestHeader('rcp-key', apikey);
        xhr.responseType = 'text';
        xhr.onload = function () {
            if (xhr.status === 200) {
                if (resultCb) resultCb(xhr.response);
            } else {
                console.error("error code: " + xhr.status);
                self.setState({
                    apikey: undefined,
                    tunnels: undefined
                })
            }
        };

        try {
            xhr.send();
        } catch (e){
            console.error(e);
        }
    }


    parseTunnels = (content: string) =>
    {        
        const obj = JSON.parse(content);
        const rip = obj.requestip;
        const arr = new Array<RemoteTunnel>();

        if (obj.projects)
        {
            obj.projects.forEach((tunnel: any) =>
            {
                // add as remote tunnel
                let localAddress: string = "";
                if (rip !== undefined &&
                    rip === tunnel.remoteip &&
                    tunnel.metadata &&
                    tunnel.metadata.local_ip)
                {
                    localAddress = tunnel.metadata.local_ip;
                }

                const rp = new RemoteTunnel(
                    tunnel.name,
                    `wss://rabbithole.rabbitcontrol.cc/rcpclient/connect?key=${tunnel.key}`,
                    localAddress,
                    tunnel.active === true
                );
                
                arr.push(rp);
            });
        }

        this.failedOnce = false;

        this.setState({ currentTunnel: undefined});

        if (this.state.autoconnect)
        {
            // if (this.state.autoTunnel !== undefined &&
            //     this.state.autoTunnel !== "")
            // {
            //     // search for tunnel with name
            //     const auto_tunnel = arr.find(tunnel => tunnel.name === this.state.autoTunnel)
            //     if (auto_tunnel !== undefined &&
            //         auto_tunnel.active === true)
            //     {
            //         this.tunnelConnectCb(auto_tunnel);
            //         return;
            //     }
            //     else if (auto_tunnel)
            //     {
            //         console.log("tunnel is offline:" + auto_tunnel.name);                    
            //     }
            //     else
            //     {
            //         console.log("tunnel not found: " + this.state.autoTunnel);                    
            //     }
            // }

            if (arr.length === 1 &&
                arr[0].active === true)
            {                
                this.tunnelConnectCb(arr[0]);
                return;
            }
        }
        
        this.setState({ tunnels: arr.length > 0 ? arr : undefined });
    }

    tunnelConnectCb = (tunnel: RemoteTunnel) =>
    {        
        this.setState({ currentTunnel: tunnel });
        
        if (!window.location.protocol.startsWith("https") &&
            !this.failedOnce &&
            tunnel.localAddress !== undefined &&
            tunnel.localAddress !== "")
        {
            let port = DEFAULT_RCP_PORT;
            let parts = tunnel.localAddress.split(":");

            if (parts[0] !== "")
            {
                if (parts.length > 0)
                {
                    port = parseInt(parts[1]);
                    if (port === 0 || isNaN(port)) port = DEFAULT_RCP_PORT;
                }
    
                this.props.connectCb(parts[0], port);
                return;
            }
            else
            {
                console.error("no address");                
            }
        }
        
        if (tunnel.remoteAddress !== undefined && tunnel.remoteAddress !== "")
        {           
            this.props.connectCb(tunnel.remoteAddress, SSL_PORT);
            return;
        }
        
        console.error("no valid address");            
    }

    renderRemoteTunnels()
    {
        if (this.state.tunnels)
        {
            return this.state.tunnels.map((tunnel, index) => {
                return <ConnectionListEntry
                    key={index}
                    tunnel={tunnel}
                    connectCb={this.tunnelConnectCb}
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
        this.props.connectCb(this.state.host, DEFAULT_RCP_PORT);
    }

    getHost = () => {
        var parts = window.location.hostname.split(".");
        while (parts.length > 2) {
            parts.shift();
        }
        return parts.join(".");
    }

    handleApikeyChange = (event: React.FormEvent<HTMLElement>) =>
    {
        const apikey = (event.target as HTMLInputElement).value;
        if (validate(apikey))
        {
            this.setState({ apikey: apikey });

            Cookie.setCookie(ConnectionList.API_KEY, apikey, undefined, this.getHost());
            this.getTunnels(apikey);
        }
        else
        {
            // TODO: check password
            console.log("password not implemented");
            
        }
    }


    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        
        if (prevProps.failed !== true && this.props.failed === true)
        {
            if (!this.failedOnce)
            {                
                this.failedOnce = true;

                if (this.state.currentTunnel)
                {                    
                    this.tunnelConnectCb(this.state.currentTunnel);
                }
            }
        }
    }

    render() {
        return (
            <div>

                <div className='section-title'>
                    <label className='grouplabel'>Available Clients</label>
                </div>

                <div style={{ marginTop: "3em" }} className='connection-panel'>
                    {
                        this.state.tunnels !== undefined ?
                            
                            // we got some tunnels
                            
                            <div>
                                <div className='flex-h'>
                                    <label className='sm-margin-auto' style={{ color: "#8D8D8D" }}>
                                        Click on a name to connect to SpaceMusic
                                    </label>
                                </div>

                                <div style={{ marginTop: "3em" }}>
                                    {this.renderRemoteTunnels()}
                                </div>
                            </div>

                            :

                            // no tunnels

                            this.state.apikey !== undefined ?
                                
                                // no tunnels but valid api-key
                                
                                <div className='flex-h'>
                                    <label className='sm-margin-auto' style={{ color: "#8D8D8D" }}>
                                        No clients are available. Please refresh.
                                    </label>
                                </div>

                                :

                                // no tunnels, no api-key

                                <div >
                                    <label className='sm-margin-auto' style={{ color: "#8D8D8D" }}>
                                        No Api-Key provided. Please enter a <Link href="https://rabbithole.rabbitcontrol.cc" target="#">Rabbithole</Link> Api-Key or password.
                                    </label>
                                    <br />
                                    <br/>

                                    <TextInput
                                        id={'apikeyinput'}
                                        labelText={'Api-Key'}
                                        onChange={this.handleApikeyChange}
                                    ></TextInput>
                                </div>
                    }

                    <div className='refresh-button'
                        style={{
                            marginTop: "1em",
                            display: this.state.apikey ? "" : "none"
                        }}
                    >
                        <a className='sm-margin-auto'
                            onClick={() => this.getTunnels(this.state.apikey)}
                        >
                            <img
                                className='sm-row-maxheight'
                                src="refresh.png"
                            />
                        </a>
                    </div>
                </div>


                {
                    window.location.protocol.startsWith("https")

                        ?

                        // https - no connection input
                        
                        ""

                        :

                        // no https - show manual connection field

                        <div className='manual-connection'>
                            <div className='section-title' style={{ marginTop: "4em" }}>
                                <label className='grouplabel'>Connect Manually</label>
                            </div>

                            <div className='connection-panel'>
                                <TextInput style={{ marginTop: "2em" }}
                                    placeholder='Enter IP Adress or Rabbithole Tunnel URL'
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
                }


                {/* <Modal
                    open={this.state.cookieAlertOpen}
                    modalHeading="Ok to store some cookies?"
                    modalLabel="Cookie Alarm"
                    primaryButtonText="Yes"
                    secondaryButtonText="No"
                    onRequestSubmit={this.handleCookiesYes}
                    onSecondarySubmit={this.handleCookiesNo}
                /> */}

            </div>
        );
    }

    setApiCookie = () =>
    {
        if (this.state.apikey)
        {
            Cookie.setCookie(ConnectionList.API_KEY, this.state.apikey, undefined, this.getHost());
        }
    }

    handleCookiesYes = () =>
    {
        this.setState({ cookieAlertOpen: false });

        Cookie.setCookie(ConnectionList.COOKIE_OK_KEY, "ok");
        this.setApiCookie();

        this.getTunnels(this.state.apikey);
    }

    handleCookiesNo = () =>
    {
        this.setState({ cookieAlertOpen: false });
        this.getTunnels(this.state.apikey);
    }
};
