import React, { Component } from 'react';
import { PDFDownloadLink, Image,
    Page, Text, View, Document } from '@react-pdf/renderer';
import findPartCategory from '../findPartCategory'; // input: data_withH, topicConfig, partId    
import Plotly from 'plotly.js-cartesian-dist';

import styles from '../Layout/StylesPDF';
import prepLinePlotData from '../TopicEdit/LinePlot/PrepLinePlotData';
import prepBoxPlotData from '../TopicEdit/BoxPlot/PrepBoxPlotData';
import ErrorBoundary from '../ErrorBoundary';

//import EventEmitter from 'event-emitter';


class PDFGeneration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            myDoc: '',
            blob: '',
            loading: 'initial',
            allDone: false
        }
    }

    async plotURL(data_noH, headers, partId, topicsConfig, topicsEdited, last_part) {
        for (let index = 0; index < topicsConfig.length;) {
            const topicConfig = topicsConfig[index];
            const topicEdited = topicsEdited[index];
            const dyad = topicEdited.graphOptions.dyad;
            const groupComp = topicEdited.graphOptions.groupComp;

            // call the plot
            let prepData ;
            if (topicConfig.time === '') {prepData = prepBoxPlotData(data_noH, headers, partId, 
                topicConfig, dyad, groupComp);}
            else {prepData = prepLinePlotData(data_noH, headers, partId, 
                topicConfig, dyad, groupComp);} 
            
            const newLayout = prepData[1];
            const plotData = prepData[0].map(trace => {
                trace.y = trace.y.map(Number)
                return trace
                })
            newLayout.font = {size: 24} 
            
            const promise1 = await Promise.resolve(Plotly.newPlot('plotly_div', plotData, newLayout, prepData[2]))
            const promise2 = await Promise.resolve(Plotly.toImage(promise1, {height: 400, width: 700}))
            const update = (url) => {
                            const plotName = partId.toString() + '-' +index.toString();
                            if (index === topicsConfig.length-1 && last_part) {
                                this.setState({allDone: true, [plotName]: url});
                            } else {
                            this.setState({[plotName]: url});}
                    }
            await update(promise2);  
            index += 1
        }
    }

    async allParticipants(data_noH, headers, uniquePartIds, topicsConfig, topicsEdited, feedbackInformation) {
        //EventEmitter.setMaxListeners(20)
        for (let index = 0; index < uniquePartIds.length;) {
            const partId = uniquePartIds[index];
            let last_part = false
            if (index === uniquePartIds.length-1){last_part = true}
            await this.plotURL(data_noH, headers, partId, topicsConfig, topicsEdited, last_part)
            index += 1;
        }

        // receive, transform and display the logo (imported image)
        let display_logo;
        if (feedbackInformation.logo !== ''){
            const logo = feedbackInformation.logo[0]; // File() object with the picture
            const logo_url = URL.createObjectURL(logo);
            display_logo = <Image src={logo_url} style={styles.image}/>
        }

        const downloadsJSX = [];
        if (this.state.allDone) {

            // generate PDF 
            uniquePartIds.map(partId => {
                const fileName = "participant"+partId+".pdf"

                const topics = topicsConfig.map((topicConfig, index) => {
                    const topicEdited = topicsEdited[index];
                    const partCategory = findPartCategory(data_noH, headers, topicConfig, partId);
                    let personalizedText = '';
                    if (partCategory === 'textHigh') {personalizedText = topicEdited.textOptions.textHigh;}
                    else if (partCategory === 'textMiddle') {personalizedText = topicEdited.textOptions.textMiddle;}
                    else {personalizedText = topicEdited.textOptions.textLow;}

                    // prevent crash if no text was given
                    if (personalizedText === '') {personalizedText = "Personalized text: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."}
                    if (topicConfig.topicName === '') {topicConfig.topicName = 'Research question'}
                    if (topicEdited.textOptions.topicText === '') {topicEdited.textOptions.topicText = "Explanation of the research question: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."}
                    if (topicEdited.textOptions.graphText === '') {topicEdited.textOptions.graphText = "Explanation of the graph: Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim."}

                    const plotName = partId.toString() + '-' +index.toString()
                    const url = this.state[[plotName]];

                    return (
                        <View key={index} wrap={false}>
                        <Text style={styles.subtitle}>{topicConfig.topicName}</Text>
                        <Text style={styles.text}>{topicEdited.textOptions.topicText}</Text>
                        <Image src={url} style={styles.image}/>
                        <Text style={styles.text}>{topicEdited.textOptions.graphText}</Text>
                        <Text style={styles.text}>{personalizedText}</Text>
                        </View>
                    )
                })

                const MyDoc = (
                    <Document>
                    <Page style={styles.body} wrap>
                    {display_logo}
                    <Text style={styles.title}>{feedbackInformation.title}</Text>
                    <Text style={styles.text}>{feedbackInformation.introduction}</Text>
                    {topics}
                    <Text style={styles.text}>{feedbackInformation.conclusion}</Text>
                    <Text style={styles.subtitle}>{feedbackInformation.signature}</Text>
                    </Page>
                    </Document>
                )
                const downloadJSX = <div key={partId}>
                        <label>Link for participant {partId}:</label > {'  '}
                        <PDFDownloadLink document={MyDoc} fileName={fileName}>
                            {({ blob, url, loading, error }) => {
                                this.blobHander(blob);
                                return (
                                    loading ? 'Generating document...' : 'Download '
                                )}}
                        </PDFDownloadLink>
                        </div>
                
                return downloadsJSX.push(downloadJSX);
            })
            this.setState({loading: false, downloadsJSX: downloadsJSX})
        }
    }

    blobHander = (blob) => {
        if (blob !== null){
            this.props.blobHander(blob);}
    }

    componentDidMount() {
        this.setState({ loading: true });
        const data_noH = this.props.data_noH;
        const headers = this.props.headers;
        const topicsConfig = this.props.topicsConfig;
        const topicsEdited = this.props.topicsEdited;
        const feedbackInformation = this.props.feedbackInformation;
        const uniquePartIds = this.props.uniquePartIds;
        if (uniquePartIds[0] === undefined){
            const errBound = <ErrorBoundary catchedError={true}/>
            this.setState({errBound: errBound})
        } else {
            this.allParticipants(data_noH, headers, uniquePartIds, topicsConfig, topicsEdited, feedbackInformation)
            
        }
    }

    render() {
    if (this.state.errBound){
        return this.state.errBound
    }
    if (this.state.loading === 'initial') {
        return(<p>Initializing...</p>)
        }
    if (this.state.loading === true){
        return(<p>Loading...</p>)
    }
    if (this.state.loading === false){        
        return (<div>{this.state.downloadsJSX}</div>)    
        }
    }
}

export default PDFGeneration;