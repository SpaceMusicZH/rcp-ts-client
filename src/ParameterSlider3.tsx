import * as React from 'react';
import { parameterWrapped, InjectedProps } from './ElementWrapper';
import { Slider, ISliderProps } from '@blueprintjs/core';
import { RcpTypes, Vector3, Vector3F32Definition } from 'rabbitcontrol';
import Measure from 'react-measure';

interface Props extends ISliderProps {
    continuous?: boolean;
};

interface State {
    dimensions: {
        width: -1,
        height: -1
    }; 
};

export class ParameterSlider3C extends React.Component<Props & InjectedProps, State> {

    constructor(props: Props & InjectedProps) {
        super(props);
    
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },
        };
    }    

    handleChangeX = (value: number) => {

        const vec3 = (this.props.value as Vector3).clone();
        vec3.x = value;

        if (this.props.handleValue) {
            this.props.handleValue(vec3);
        }

        if (this.props.continuous) {
            this.handleRelease(0);
        }
    }
    handleChangeY = (value: number) => {

        const vec3 = (this.props.value as Vector3).clone();
        vec3.y = value;

        if (this.props.handleValue) {
            this.props.handleValue(vec3);
        }

        if (this.props.continuous) {
            this.handleRelease(0);
        }
    }
    handleChangeZ = (value: number) => {

        const vec3 = (this.props.value as Vector3).clone();
        vec3.z = value;

        if (this.props.handleValue) {
            this.props.handleValue(vec3);
        }

        if (this.props.continuous) {
            this.handleRelease(0);
        }
    }

    handleRelease = (value: number) => {
        if (this.props.onSubmitCb) {
            this.props.onSubmitCb();
        }
    }

    render() {
        const value = this.props.value as Vector3;
        let step = new Vector3(1, 1, 1);
        let isFloat:boolean = false;
        let min:Vector3|undefined = undefined;
        let max:Vector3|undefined = undefined;
        let readOnly:boolean = false;

        const param = this.props.parameter;
        if (param) {
            readOnly = param.readonly || false;
            const numdef = param.typeDefinition as Vector3F32Definition;
            if (numdef !== undefined && 
                numdef.minimum !== undefined && 
                numdef.maximum !== undefined)
            {
                min = numdef.minimum;
                max = numdef.maximum;

                const valueRange = numdef.maximum.clone().sub(numdef.minimum);
                    
                isFloat = param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR2F32 ||
                                param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR3F32 ||
                                param.typeDefinition.datatype === RcpTypes.Datatype.VECTOR4F32;

                if (numdef.multipleof) {
                    step = numdef.multipleof;
                } else if (isFloat) {
                    if (this.state !== undefined && this.state.dimensions !== undefined) {                        
                        step.x = valueRange.x > 0 && this.state.dimensions.width > 0 ? valueRange.x / this.state.dimensions.width : 1;
                        step.y = valueRange.y > 0 && this.state.dimensions.width > 0 ? valueRange.y / this.state.dimensions.width : 1;
                        step.z = valueRange.z > 0 && this.state.dimensions.width > 0 ? valueRange.z / this.state.dimensions.width : 1;
                    }
                }
            }
        }

        const { onSubmitCb, handleValue, ...filteredProps } = this.props;

        return (        
            <Measure
                onResize={(contentRect) => {
                    this.setState({ dimensions: contentRect.entry })
                }}
            >
            {({ measureRef }) =>
                <div ref={measureRef}>
                    <Slider
                        {...filteredProps}
                        value={value ? value.x : 0}
                        min={min ? min.x : undefined}
                        max={max ? max.x : undefined}
                        stepSize={step.x}
                        labelPrecision={isFloat ? 2 : 0}
                        labelStepSize={max ? max.x : 0}
                        onChange={this.handleChangeX}
                        onRelease={this.handleRelease}
                        labelRenderer={this.renderLabel}
                        disabled={readOnly === true}
                    />
                    <Slider
                        {...filteredProps}
                        value={value ? value.y : 0}
                        min={min ? min.y : undefined}
                        max={max ? max.y : undefined}
                        stepSize={step.y}
                        labelPrecision={isFloat ? 2 : 0}
                        labelStepSize={max ? max.y : 0}
                        onChange={this.handleChangeY}
                        onRelease={this.handleRelease}
                        labelRenderer={this.renderLabel}
                        disabled={readOnly === true}
                    />
                    <Slider
                        {...filteredProps}
                        value={value ? value.z : 0}
                        min={min ? min.z : undefined}
                        max={max ? max.z : undefined}
                        stepSize={step.z}
                        labelPrecision={isFloat ? 2 : 0}
                        labelStepSize={max ? max.z : 0}
                        onChange={this.handleChangeZ}
                        onRelease={this.handleRelease}
                        labelRenderer={this.renderLabel}
                        disabled={readOnly === true}
                    />      
                </div>
            }
            </Measure>      
        );
    }

    private renderLabel = (val: number) => {
        const param = this.props.parameter
        const value = val.toFixed(2); // fixme for small numbers!
        let unit;
        if (param) {
            unit = (param.typeDefinition as Vector3F32Definition).unit
        }
        
        return <div style={{whiteSpace: "nowrap"}}>{unit ? `${value} ${unit}`: value}</div>
    }
};

export const ParameterSlider3 = parameterWrapped()(ParameterSlider3C);