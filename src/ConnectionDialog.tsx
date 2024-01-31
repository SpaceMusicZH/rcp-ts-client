import * as React from 'react';
import ParameterWidget from './ParameterWidget'
import { Parameter, Client, WebSocketClientTransporter, GroupParameter, TabsWidget, StringParameter } from 'rabbitcontrol';
import { DEFAULT_RCP_PORT, HTTP_PORT, SSL_INFO_TEXT, SSL_INFO_TEXT_FIREFOX, SSL_PORT } from './Globals';
import App from './App';
import SMHeader from './SMHeader';
import { WIDGET_3D_VIEW, WIDGET_SCENE_NAME_STRING, WIDGET_SETTINGS_STRING } from './WidgetConfig';
import ConnectionList from './ConnectionList';


type Props = {
};

type State = {
    isConnected: boolean;
    error?: string;
    client?: Client;
    parameters: Parameter[];
    serverVersion: string;
    serverApplicationId: string;
    rootWithTabs: boolean;
    settingsParameter?: GroupParameter;
    threeDViewParameter?: GroupParameter;
    sceneNameParameter?: StringParameter;
    autoConnect: boolean;
};

export default class ConnectionDialog extends React.Component<Props, State> {
    
    private addTimer?: number;
    private removeTimer?: number;

    constructor(props: Props) {
        super(props);

        this.state = {
            isConnected: false,
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
            rootWithTabs: true,
            autoConnect: false
        };
    }

    

    componentDidMount = () => {
        
        // paarse parameters
        if (window.location.search !== "") {
            const params = new URLSearchParams(window.location.search);

            // t: tabs in roots
            if (params.has("t")) {
                this.setState({rootWithTabs: (parseInt(params.get("t") || "0") || 0) > 0});
            }

            // d: debug
            if (params.has("d")) {
                Client.VERBOSE = (parseInt(params.get("d") || "0") || 0) > 0 || false;
                App.VERBOSE_LOG = Client.VERBOSE;
            }

            // ds: debug send
            if (params.has("ds")) {
                Client.VERBOSE_SEND = (parseInt(params.get("ds") || "0") || 0) > 0 || false;
            }

            // dr: debug receive
            if (params.has("dr")) {
                Client.VERBOSE_RECV = (parseInt(params.get("dr") || "0") || 0) > 0 || false;
            }
        }

        // autoconnect
        if (window.location.hash !== '')
        {
            const [host, port] = window.location.hash.replace('#', '').split(':');

            const portAsInt = parseInt(port, 10) || DEFAULT_RCP_PORT;

            if (Client.VERBOSE) console.log("autoconnect: " + host + ":" + portAsInt);

            this.setState({ autoConnect: true });

            this.doConnect(decodeURIComponent(host), portAsInt);
        }
    }

    updateClient = () => {
        if (this.state.client) {
            this.state.client.update();
        }
    }

    createParameterWidget(parameter: Parameter)
    {        
        return <ParameterWidget
            className={parameter.userid ? parameter.userid : ""}
            key={parameter.id}
            parameter={parameter}
            onSubmitCb={this.updateClient} />;
    }

    createWidgets(parameter: Parameter[])
    {
        return parameter
        .filter(param => this.state.rootWithTabs === false || !(param instanceof GroupParameter))
        .sort((a: Parameter, b: Parameter): number => 
        {
            return ((a.order || 0) - (b.order || 0));
        })
        .map((param) => 
        { 
            return this.createParameterWidget(param); 
        });
    }

    render() 
    {
        return (
            <section>

                <SMHeader
                    settingsParameter={this.state.settingsParameter}
                    threeDViewParameter={this.state.threeDViewParameter}
                    sceneNameParameter={this.state.sceneNameParameter}
                    value={false}
                    onSubmitCb={this.updateClient}
                />

                {
                    this.state.isConnected === false

                        ?

                        // not connected

                        this.state.autoConnect

                            ?
                            
                            // autoconnect

                            ""

                            :

                            // no autoconnect

                            <ConnectionList
                                    connectCb={this.doConnect}
                                    failed={this.state.error !== undefined}
                                />

                        :

                        // connected - check client

                        this.state.client
                            
                            ?

                            // connected - has client

                            this.state.rootWithTabs === true
                                
                                ?

                                // root with tabs

                                <ParameterWidget
                                    key={0}
                                    parameter={this.state.client.getRootGroup()}
                                    onSubmitCb={this.updateClient}
                                />

                                :

                                // no root with tabs

                                this.createWidgets(this.state.parameters)

                            :

                            // connected - but no client

                            ""
                }
        
            </section>
        );
    }

    private returnSSLInfo() {
        const isSSL = window.location ? window.location.toString().startsWith("https") : false;
        const isFirefox = navigator.userAgent.indexOf("Firefox") !== -1;

        if (isSSL && isFirefox) {
            return (
                <div>
                    <br/>
                    {SSL_INFO_TEXT}
                    <br/><br/>
                    {SSL_INFO_TEXT_FIREFOX}
                </div>
            );
        } else if (isSSL) {
            return (
                <div>
                    <br/>
                    {SSL_INFO_TEXT}
                </div>
            );
        }
    }

    private resetUI()
    {
        if (Client.VERBOSE) console.log("reset UI");

        this.stopTimers();

        this.setState({
            isConnected: false, 
            client: undefined, 
            parameters: [],
            serverVersion: "",
            serverApplicationId: "",
            settingsParameter: undefined,
            threeDViewParameter: undefined,
            sceneNameParameter: undefined
        });
    }

    private doDisconnect = () => {
        
        const client = this.state.client;

        if (client) {
            // clear callbacks
            // TODO: do this in client
            client.connected = undefined;
            client.disconnected = undefined;            
            client.onError = undefined;
            client.parameterAdded = undefined;
            client.parameterRemoved = undefined;

            // dispose client
            client.dispose();
        }

        this.resetUI();
    }

    private doConnect = (host: string, port: number) => {

        if (host !== undefined &&
            host !== "" &&
            !isNaN(port))
        {
            //------------------------------
            // transform rabbithole url
            
            if (host.startsWith("wss") ||
                host.startsWith("https"))
            {
                port = SSL_PORT;
            }
            else if (host.startsWith("ws") ||
                host.startsWith("http"))
            {
                port = HTTP_PORT;
            }

            // port = 8080;

            if (host.startsWith(`https://${ConnectionList.RABBITHOST}`) &&
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

            //------------------------------
            // try to connect

            console.log(`trying to connect: ${host}:${port}`);

            // disconnect first
            this.doDisconnect();

            // set info
            this.setState({
                error: undefined
            });
            
            const client = new Client(new WebSocketClientTransporter())

            // NOTE: needed??
            client.setRootWidget(new TabsWidget());
    
            const { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo } = this;
            Object.assign(client, { connected, disconnected, parameterAdded, parameterRemoved, onError, onServerInfo });
    
            try {
                client.connect(host, port);

                this.setState({
                    client: client
                });

            } catch (e) {
                console.log(e);
            }
        }
        else
        {
            console.error(`invalid host (${host}) or port (${port})`);            
        }
    }

    /**
     * client callbacks - socket
     */
    private connected = () => 
    {
        this.setState({
            isConnected: true,
        });

        if (Client.VERBOSE) console.log("ConnectionDialog connected!");
    }

    private disconnected = (event: CloseEvent) => 
    {
        if (Client.VERBOSE) console.log("ConnectionDialog disconneted: " + JSON.stringify(event));

        this.setState({
            error: `disconnected${event.reason ? ": " + JSON.stringify(event.reason) : ""}`
        });

        this.resetUI();
    }

    private onError = (error: any) => {

        if (error instanceof Error)
        {
            console.error(error.message);
            this.setState({
                error: error.message,
            });
        }
        else
        {
            this.setState({
                error: error.toString(),
            });
            // this.resetUI();
        }

    }

    /**
     * client callbacks info
     */
    private onServerInfo = (version: string, applicationId: string) => 
    {
        this.setState({
            serverVersion: version,
            serverApplicationId: applicationId
        });
    }

    private parameterChangeListener = (parameter: Parameter) => 
    {
        if (!parameter.onlyValueChanged())
        {
            if (parameter.parent !== undefined)
            {
                if (Client.VERBOSE) console.log("parameter changed: " + parameter.parent.label);
            }
            else if (parameter.parentChanged())
            {
                if (this.state.client)
                {
                    this.setState({
                        parameters: this.state.client.getRootGroup().children,
                    });
                }
            }
            else
            {
                if (Client.VERBOSE) console.log("parameter changed: no parent");                
            }
            
            //force redraw
            this.forceUpdate();
        }
    }

    /**
     * client callbacks parameter
     */
    private parameterAdded = (parameter: Parameter) => 
    {
        this.stopAddTimer();


        parameter.addChangeListener(this.parameterChangeListener);

        if (parameter.userid === WIDGET_SETTINGS_STRING &&
            parameter instanceof GroupParameter)
        {
            this.setState({
                settingsParameter: parameter as GroupParameter
            });
        }
        else if (parameter.userid === WIDGET_3D_VIEW &&
            parameter instanceof GroupParameter)
        {
            this.setState({
                threeDViewParameter: parameter as GroupParameter
            });
        }
        else if (parameter.userid === WIDGET_SCENE_NAME_STRING &&
            parameter instanceof StringParameter)
        {
            this.setState({
                sceneNameParameter: parameter as StringParameter
            })
        }

        // delay setting parameter
        // more paramater might arrive in quick succession
        this.addTimer = this.setParameterDelayed(100);
    }

    private parameterRemoved = (parameter: Parameter) =>
    {
        this.stopRemoveTimer();

        // this.rootParam.removeChild(parameter);
        parameter.removeFromParent();

        parameter.removeChangedListener(this.parameterChangeListener);        

        if (parameter.userid === WIDGET_SETTINGS_STRING &&
            parameter instanceof GroupParameter)
        {
            this.setState({
                settingsParameter: undefined
            });
        }
        else if (parameter.userid === WIDGET_3D_VIEW &&
            parameter instanceof GroupParameter)
        {
            this.setState({
                threeDViewParameter: undefined
            });
        }
        else if (parameter.userid === WIDGET_SCENE_NAME_STRING &&
            parameter instanceof StringParameter)
        {
            this.setState({
                sceneNameParameter: undefined
            })
        }

        // delay removing parameter
        // more paramater might arrive in quick succession
        this.removeTimer = this.setParameterDelayed(10);
    }

    /**
     * 
     */
    private setParameterDelayed(time: number) : number
    {
        return window.setTimeout(() => {
            if (this.state.client)
            {
                this.setState({
                    parameters: this.state.client.getRootGroup().children,
                });
            }
            else
            {
                this.setState({
                    parameters: []
                });
            }
        }, time);
    }

    private stopAddTimer()
    {
        if (this.addTimer !== undefined) {
            window.clearTimeout(this.addTimer);
            this.addTimer = undefined;
        }
    }

    private stopRemoveTimer()
    {
        if (this.removeTimer !== undefined) {
            window.clearTimeout(this.removeTimer);
            this.removeTimer = undefined;
        }
    }

    private stopTimers() {
        this.stopAddTimer();
        this.stopRemoveTimer();
    }

} 
