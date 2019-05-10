import React, { Component } from 'react';
import { Image, Text } from '@react-pdf/renderer';
import Plotly from 'plotly.js-basic-dist';

import styles from '../Layout/StylesPDF';
import prepareLinePlotData from '../TopicEdit/LinePlot/PrepLinePlotData';
//import prepareBoxPlotData from '';

class GetPlotUrl extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: 'initial',
            url: ''
        }
    }

    componentDidMount() {
        this.setState({ loading: true });
        const topicsConfig = this.props.topicsConfig;
        topicsConfig.map((topicConfig, index) => {
            const data_noH = this.props.data_noH;
            const headers = this.props.headers;
            const partId = this.props.partId;
            const topicEdited = this.props.topicsEdited[index];
            const dyad = topicEdited.graphOptions.dyad;
            const groupComp = topicEdited.graphOptions.groupComp;

            // call the plot
            let prepData = prepData = prepareLinePlotData(data_noH, headers, partId, 
                    topicConfig, dyad, groupComp);
            // if (topicConfig.time === '') {prepData = prepareBoxPlotData(data_noH, headers, partId, 
            //     topicConfig, dyad, groupComp);}
            // else {prepData = prepareLinePlotData(data_noH, headers, partId, 
            //     topicConfig, dyad, groupComp);} 
            Promise.resolve(Plotly.react('plotly_div', prepData[0], prepData[1], prepData[2]))
                .then(graphDiv => {
                    Promise.resolve(Plotly.toImage(graphDiv, {height: 600, width: 1000}))
                        .then(url => {
                            this.setState({url: url, loading: false});
                    })
                }
            )
        })
    }

// generate PDF for 1 participant
    render() {
        if (this.state.loading === 'initial') {
            return(<Text style={styles.title}>Initializing</Text>)
          }
        if (this.state.loading === true){
            return(<Text style={styles.title}>Loading</Text>)
        }
        if (this.state.loading === false){
        const url = URL;
        return (
        <Image src={url} style={styles.image}/>)
        }
    }
}

export default GetPlotUrl;