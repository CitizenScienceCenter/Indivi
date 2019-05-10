import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Navigation from './Navigation/Navigation';
import IntroPage from './IntroPage/IntroPage';
import FeedbackInformation from './FeedbackInformation/FeedbackInformation';
import Preview from './Preview/Preview';
import ExportPDF from './Export/PDFExport';
import ExportBooklet from './Export/BookletExport';
import ExportHTML from './Export/HTMLExport';
import TopicEdit from './TopicEdit/TopicEdit';
import Settings from './Settings/Settings';
import ErrorBoundary from './ErrorBoundary';


import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    
    this.state = {}
      
    this.DATA = {};
  }

  handlerDataUpload = (newColnames, newData) => {
    this.DATA = newData;
    this.setState({colnames: newColnames, data: newData});
    sessionStorage.setItem('colnames', JSON.stringify(newColnames));
    sessionStorage.setItem('data', JSON.stringify(newData));
  }

  handlerTopicsConfig = (newTopicsConfig) => {
    this.setState({topicsConfig: newTopicsConfig});
    sessionStorage.setItem('topicsConfig', JSON.stringify(newTopicsConfig));
  }

  handlerFeedbackInformation = (newFeedbackInformation) => {
    this.setState({feedbackInformation: newFeedbackInformation});
    sessionStorage.setItem('feedbackInformation', JSON.stringify(newFeedbackInformation));
  }

  handlerTopicsEdited = (newTopicsEdited) => {
    this.setState({topicsEdited: newTopicsEdited});
    sessionStorage.setItem('topicsEdited', JSON.stringify(newTopicsEdited));
  }

  handlerSettingsUpload = (newSettings) => {
    sessionStorage.setItem('colnames', newSettings.colnames);
    sessionStorage.setItem('data', newSettings.data);
    sessionStorage.setItem('feedbackInformation', newSettings.feedbackInformation);
    sessionStorage.setItem('topicsConfig', newSettings.topicsConfig);
    sessionStorage.setItem('topicsEdited', newSettings.topicsEdited);
    const colnames = JSON.parse(newSettings.colnames);
    const data = JSON.parse(newSettings.data);
    const feedbackInformation = JSON.parse(newSettings.feedbackInformation);
    const topicsConfig = JSON.parse(newSettings.topicsConfig);
    const topicsEdited = JSON.parse(newSettings.topicsEdited);
    this.setState({colnames: colnames, data: data, feedbackInformation: feedbackInformation,
      topicsConfig: topicsConfig, topicsEdited: topicsEdited});
    this.DATA = data;
  }

  componentWillMount() {
    let colnames;
    let data;
    let feedbackInformation;
    let topicsConfig;
    let topicsEdited;
    if (sessionStorage.getItem('colnames')) {  
      colnames = JSON.parse(sessionStorage.getItem('colnames'))
    } else { colnames = ['No data added!']}
    if (sessionStorage.getItem('data')) {
      data = JSON.parse(sessionStorage.getItem('data'))
    } else { data = [[], [], [], [], [], []]}
    if (sessionStorage.getItem('feedbackInformation')) {
      feedbackInformation = JSON.parse(sessionStorage.getItem('feedbackInformation'))
    } else { feedbackInformation = { 
      logo: '',
      title: 'Titel...',
      introduction: 'Diese Studie ... ',
      conclusion: 'Zusammenfassend, ...',
      signature: 'Ihr Name'
    }}
    if (sessionStorage.getItem('topicsConfig')) {
      topicsConfig = JSON.parse(sessionStorage.getItem('topicsConfig'))
    } else { topicsConfig = [{
      topicName: '',
      id: '',
      variable: '',
      time: '',
      timeName: '',
      group: '',
      variable2: '',
      variable3: ''}]}
    if (sessionStorage.getItem('topicsEdited')) {
      topicsEdited = JSON.parse(sessionStorage.getItem('topicsEdited'))
    } else { topicsEdited = [{
      textOptions: {
        graphText:'',
        topicText: '',
        textLow: '',
        textMiddle: '',
        textHigh: ''
        },
      graphOptions: {
        dyad: false,
        groupComp: true}
    }]}
    this.setState({colnames: colnames, data: data, feedbackInformation: feedbackInformation,
      topicsConfig: topicsConfig, topicsEdited: topicsEdited});
    this.DATA = data;
    sessionStorage.setItem('colnames', JSON.stringify(colnames));
    sessionStorage.setItem('data', JSON.stringify(data));
    sessionStorage.setItem('feedbackInformation', JSON.stringify(feedbackInformation));
    sessionStorage.setItem('topicsConfig', JSON.stringify(topicsConfig));
    sessionStorage.setItem('topicsEdited', JSON.stringify(topicsEdited));
  }

  render() {      
    return (
      <BrowserRouter>
      <div style={{paddingTop: 50, paddingBottom: 50}}>
        <Navigation />

        <Route path='/' exact render={() => 
          <IntroPage 
            colnames={this.state.colnames}
            data={this.state.data}
            topicsConfig={this.state.topicsConfig}
            topicsEdited={this.state.topicsEdited}
            feedbackInformation={this.state.feedbackInformation}
            onUplodadData={this.handlerDataUpload}
            onTopicsConfig={this.handlerTopicsConfig}
            onTopicsEdited={this.handlerTopicsEdited}/>}/>

        <Route path='/topic-edit' render={(props) => 
          <ErrorBoundary>
          <TopicEdit 
            data={this.DATA}
            topicsConfig={this.state.topicsConfig}
            topicsEdited={this.state.topicsEdited}
            onTopicsEdited={this.handlerTopicsEdited}
            {...props}/></ErrorBoundary>
           }/>

        <Route path='/feedback-info' render={() => 
          <FeedbackInformation
            feedbackInformation={this.state.feedbackInformation}
            onFeedbackInformation={this.handlerFeedbackInformation}/>}/>
        
        <Route path='/preview' render={(props) => 
          <ErrorBoundary>
          <Preview
            feedbackInformation={this.state.feedbackInformation}
            data={this.DATA}
            topicsConfig={this.state.topicsConfig}
            topicsEdited={this.state.topicsEdited}
            onTopicsEdited={this.handlerTopicsEdited}
            {...props}/></ErrorBoundary>
            }/>

        <Route path='/export-pdf' render={(props) => 
          <ErrorBoundary>
          <ExportPDF
          data={this.DATA}
          id_var={this.state.topicsConfig[0].id} 
          colnames={this.state.colnames}
          feedbackInformation={this.state.feedbackInformation}
          topicsEdited={this.state.topicsEdited}
          topicsConfig={this.state.topicsConfig}
          {...props}/></ErrorBoundary>
          }/>

        <Route path='/export-booklet' render={(props) => 
          <ErrorBoundary>
          <ExportBooklet 
          data={this.DATA}
          id_var={this.state.topicsConfig[0].id} 
          colnames={this.state.colnames}
          feedbackInformation={this.state.feedbackInformation}
          topicsEdited={this.state.topicsEdited}
          topicsConfig={this.state.topicsConfig}
          {...props}/></ErrorBoundary>
          }/>

        <Route path='/export-html' render={(props) => 
          <ErrorBoundary>
          <ExportHTML 
          data={this.DATA}
          id_var={this.state.topicsConfig[0].id} 
          colnames={this.state.colnames}
          feedbackInformation={this.state.feedbackInformation}
          topicsEdited={this.state.topicsEdited}
          topicsConfig={this.state.topicsConfig}
          {...props}/></ErrorBoundary>
          }/>

        <Route path='/settings' render={() => 
          <Settings
            onSettingsUpload={this.handlerSettingsUpload}/>}/>
      </div>
      </BrowserRouter>
    );
  }
}

export default App;
