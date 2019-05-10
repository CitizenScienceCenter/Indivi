import React, { Component } from 'react';
import ReactDOMServer from 'react-dom/server';
import DownloadLink from "react-download-link";
import findPartCategory from '../findPartCategory'; // input: data_withH, topicConfig, partId    
import Plotly from 'plotly.js-cartesian-dist';

import prepLinePlotData from '../TopicEdit/LinePlot/PrepLinePlotData';
import prepBoxPlotData from '../TopicEdit/BoxPlot/PrepBoxPlotData';
import ErrorBoundary from '../ErrorBoundary';


class HTMLGeneration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            downloadsHTML: [],
            loading: 'initial',
            allDone: false
        }
    }

    async getBase64(file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const logo_url = reader.result;
            this.setState({logo_url: logo_url});
            return reader.result;
        };
        await reader.onload();}    

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
            newLayout.font = {size: 24} 
            
            const promise1 = await Promise.resolve(Plotly.newPlot('plotly_div', prepData[0], newLayout, prepData[2]))
            const promise2 = await Promise.resolve(Plotly.toImage(promise1, {height: 500, width: 800}))
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

    async allParticipants(data_noH, headers, uniquePartIds, topicsConfig, topicsEdited) {
        for (let index = 0; index < uniquePartIds.length;) {
            const partId = uniquePartIds[index];
            let last_part = false
            if (index === uniquePartIds.length-1){last_part = true}
            await this.plotURL(data_noH, headers, partId, topicsConfig, topicsEdited, last_part)
            index += 1;
        }
        if (this.state.allDone) {this.setState({loading: false})}
    }

    MyDocsHandler = (MyDoc) => {
        if (MyDoc !== null){
            this.props.MyDocsHandler(MyDoc);}
    }

    componentDidMount() {
        this.setState({ loading: true });
        const data_noH = this.props.data_noH;
        const headers = this.props.headers;
        const topicsConfig = this.props.topicsConfig;
        const topicsEdited = this.props.topicsEdited;
        const uniquePartIds = this.props.uniquePartIds;
        if (uniquePartIds[0] === undefined){
            const errBound = <ErrorBoundary catchedError={true}/>
            this.setState({errBound: errBound})
        }
        // logo 
        else {
            this.allParticipants(data_noH, headers, uniquePartIds, topicsConfig, topicsEdited)
            if (this.props.feedbackInformation.logo !== ''){
                const logo = this.props.feedbackInformation.logo[0]; // File() object with the picture
                this.getBase64(logo)}
        }
        
    }

    componentDidUpdate() {
        if (this.state.loading === false){
            // Create styles
            //const styles = 'html { height: 100%;} body { font: normal .80em trebuchet ms, sans-serif; background: #EEE; color: #5D5D5D;} p { padding: 0 0 20px 0; line-height: 1.7em;} img { border: 0;} h1, h2, h3, h4, h5, h6 { font: normal 165% "century gothic", arial, sans-serif; color: #2DB8CD; margin: 0 0 14px 0; padding: 10px 0 5px 0;} .left { float: left; width: auto; margin-right: 10px;} .right  { float: right; width: auto; margin-left:10px} .center { display: block; text-align: center; margin: 20px auto;} #main, #gen-text, #site_content { margin-left: auto; margin-right: auto;} #main { padding-bottom: 20px; padding-top: 20px;} #header { background: transparent; height: auto;} #logo  { width: 930px; margin: 0px auto 40px auto; height: auto;} #footer { background: transparent; height: auto; padding-top: 20px} #gen-text { width: 860px; position: relative; height: auto;} #gen-text h1{ padding: 24px 0 0 0; margin: 0;color: #A8AA94; font: normal 300% "century gothic", arial, sans-serif;} #gen-text h2{ font-size: 150%; padding: 4px 0 0 0; color: #A8AA94; font: normal "century gothic", arial, sans-serif;} #site_content { width: 858px; overflow: hidden; margin: 0 auto 0 auto; padding: 10px 20px 20px 20px; background: #F6F6F0 url(back.png) repeat-y; border: 15px solid #FFF;} #content { text-align: left; width: 858px; padding: 0;}'
            const styles = `html    { height: 100%;}
            body    { font: normal .80em trebuchet ms, sans-serif; 
                        background: #EEE; color: #5D5D5D;}
            p       { padding: 0 0 20px 0; line-height: 1.7em;}
            img     { border: 0;}
            h1, h2, h3, h4, h5, h6 
                    { font: normal 165% 'century gothic', arial, sans-serif;
                        color: #2DB8CD; margin: 0 0 14px 0; padding: 10px 0 5px 0;} 
            .left   { float: left; width: auto; margin-right: 10px;}
            .right  { float: right; width: auto; margin-left:10px}
            .center { display: block; text-align: center; margin: 20px auto;}
            #main, #gen-text, #site_content
                    { margin-left: auto; margin-right: auto;}
            #main   { padding-bottom: 20px; padding-top: 20px;}
            #header { background: transparent; height: auto;}
            #logo  { width: 930px; margin: 0px auto 40px auto; height: auto;}
            #footer { background: transparent; height: auto; padding-top: 20px}
            #gen-text   { width: 860px; position: relative; height: auto;}
            #gen-text h1{ padding: 24px 0 0 0; margin: 0;color: #A8AA94;
                        font: normal 300% "century gothic", arial, sans-serif;}
            #gen-text h2{ font-size: 150%; padding: 4px 0 0 0; color: #A8AA94;
                        font: normal "century gothic", arial, sans-serif;}
            #site_content  
                    { width: 858px; overflow: hidden; margin: 0 auto 0 auto; padding: 10px 20px 20px 20px; 
                        background: #F6F6F0 url(back.png) repeat-y; border: 15px solid #FFF;}
            #content { text-align: left; width: 858px; padding: 0;}`

            const data_noH = this.props.data_noH;
            const headers = this.props.headers;
            const feedbackInformation = this.props.feedbackInformation;
            const topicsConfig = this.props.topicsConfig;
            const topicsEdited = this.props.topicsEdited;

            // receive, transform and display the logo (imported image)
            let display_logo;
            if (feedbackInformation.logo !== ''){
                const logo_url = this.state.logo_url;
                display_logo = <div id="logo">
                <span className="right"><img src={logo_url} alt="logo" width="300px"/></span></div> 
            }
            const downloadsHTML = [];
            const MyDocs = [];
            // generate HTML for 1 participant
            this.props.uniquePartIds.map(partId => {
                const fileName = "participant"+partId+".html"

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
                        <div id="site_content" key={index}>
                        <div id="content">
                        <h1>{topicConfig.topicName}</h1>
                        <p>{topicEdited.textOptions.topicText}</p>
                        <span className="left"><img src={url} alt="plot" width="520px"/></span>
                        <p>{topicEdited.textOptions.graphText}</p>
                        <p>{personalizedText}</p>
                        </div>
                    </div>
                    )
                })

                const MyDoc = 
                    <html>
                    <head>
                    <title>{feedbackInformation.title}{partId}</title>
                    <style>{styles}</style>
                    </head>
                    <body>
                    <div id="main">
                        {display_logo}
                        <div id="header">
                            <div id="gen-text">
                            <h1>{feedbackInformation.title}</h1>
                            <p>{feedbackInformation.introduction}</p>
                            </div>
                        </div>
                        {topics}
                        <div id="footer">
                                <div id="gen-text">
                                <p>{feedbackInformation.conclusion}</p>
                                    <h2>{feedbackInformation.signature}</h2>
                                </div>
                            </div>
                    </div>
                    </body>
                    </html>

                const downloadHTML = <div key={partId}>
                        <label>Link for participant {partId}:</label > {'  '}
                        <DownloadLink filename={fileName} exportFile={() => {
                            return ReactDOMServer.renderToStaticMarkup(MyDoc);
                        }}>Save to disk</DownloadLink>
                        </div>

                MyDocs.push(ReactDOMServer.renderToStaticMarkup(MyDoc));
                return downloadsHTML.push(downloadHTML);
            })
            this.setState({loading: 'ready', downloadsHTML: downloadsHTML})
            this.MyDocsHandler(MyDocs)
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
            return(<p>Loading...</p>)}
        if (this.state.loading === 'ready'){
        return (<div>{this.state.downloadsHTML}</div>)    
        }
    }
}

export default HTMLGeneration;