import React, { Component } from 'react';
import Plot from 'react-plotly.js';

import PrepLinePlotData from './PrepLinePlotData';

// must receive as props: data (without the headers), headers, partId, topicConfig (for the particular topic)

class LinePlot extends Component {
    constructor(props){
        super(props);

        this.state = { 
            lp_data: [], // array of objects (one for each line) with x (array), y (array) and type: scatter
            layout: {}, 
            config: {},
            figure: ''
        };
    }

    componentDidMount() {
        const props = this.props;
        const prepData = PrepLinePlotData(props.data_noH, props.headers, props.partId, 
            props.topicConfig, props.dyad, props.groupComp);
        this.setState({lp_data: prepData[0], layout: prepData[1], config: prepData[2]})
    }

    componentWillReceiveProps(nextProps) {
        const props = nextProps;
        const prepData = PrepLinePlotData(props.data_noH, props.headers, props.partId, 
            props.topicConfig, props.dyad, props.groupComp);
        this.setState({lp_data: prepData[0], layout: prepData[1], config: prepData[2]})
    }
    
    render() {
        return (
            <div>
                <Plot
                    data={this.state.lp_data}
                    layout={this.state.layout}
                    config={this.state.config}
                    onInitialized={(figure) => {
                        this.setState({figure: figure});}}
                />
            </div>
        )
    }
}

export default LinePlot;