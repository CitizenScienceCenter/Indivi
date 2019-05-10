import React, { Component } from 'react';
import Plot from 'react-plotly.js';

import PrepBoxPlotData from './PrepBoxPlotData';


class BoxPlot extends Component {
    
// must receive as props: data (without the headers), headers, partId, topicConfig (for the particular topic)

    constructor(props){
        super(props);

        this.state = { 
            bp_data: [],
            layout: {},
            config: {},
            frames: []
            };

    }  

    componentDidMount() {
        const props = this.props;
        const prepData = PrepBoxPlotData(props.data_noH, props.headers, props.partId, 
            props.topicConfig, props.dyad, props.groupComp);    
        this.setState({bp_data: prepData[0], layout: prepData[1], config: prepData[2]})
    }

    componentWillReceiveProps(nextProps) {
        const props = nextProps;
        const prepData = PrepBoxPlotData(props.data_noH, props.headers, props.partId, 
            props.topicConfig, props.dyad, props.groupComp);
        this.setState({bp_data: prepData[0], layout: prepData[1], config: prepData[2]})
    }

    render() {
        return (
        <div>
            <Plot
                data={this.state.bp_data}
                layout={this.state.layout}
                frames={this.state.frames}
                config={this.state.config}
                onInitialized={(figure) => {
                    this.setState({figure: figure});}}
            />
        </div>
        );
    }
}
export default BoxPlot;