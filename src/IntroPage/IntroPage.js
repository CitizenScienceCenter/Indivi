import React, { Component } from 'react';
import CSVReader from 'react-csv-reader';
import { Grid, Row, Col, Image,
  Button, Collapse,
  Panel, Jumbotron } from 'react-bootstrap';

import { Document, Page } from 'react-pdf/dist/entry.webpack';

import Table from './Table/Table';
import Topic from './Topic/Topic';

import dataExample from '../data/dataExample.png'
import pdfEx from '../data/FeedbackExample.pdf'
import thesisPDF from '../data/Masterarbeit_final.pdf'


class IntroPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colnames: [],
      data: [],
      feedbackInformation: {},
      topicsConfig:[],
      topicsEdited: [],
    };
  }

  displayColNameHandler = (matrix) => {
    let i = 0;  
    matrix.forEach((line) => {
        if (line.length !== matrix[0].length){
          matrix.splice(i, 1)
        }
        i = i+1;
      })
      const newColNames = matrix[0];
      const newData = matrix;
      this.setState({colnames: newColNames, data: newData});
      this.props.onUplodadData(newColNames, newData);
    }

  updateStateHandler = (topicState, topicId) => {
    const newTopics = [...this.state.topicsConfig];
    newTopics[topicId-1] = topicState;
    //this.setState({topicsConfig : newTopics});
    this.props.onTopicsConfig(newTopics);
  }


  addTopicHandler = () => {    
    const newTopicConfig = {
      topicName: '',
      id: '',
      variable: '',
      time: '',
      timeName: '',
      group: '',
      variable2: '',
      variable3: ''
    }
    const updatedTopicsConfig = [...this.state.topicsConfig];
    updatedTopicsConfig.push(newTopicConfig);
    this.setState({topicsConfig: updatedTopicsConfig});
    this.props.onTopicsConfig(updatedTopicsConfig);

    
    const newTopicEdited = {
      textOptions: {
        topicText: '',
        textSingle: '',
        textLow: '',
        textMiddle: '',
        textHigh: ''
      },
      graphOptions: {
        dyad: false,
        groupComp: true, 
        url: ''
      }
    }
    const updatedTopicsEdited = [...this.state.topicsEdited];
    updatedTopicsEdited.push(newTopicEdited);
    this.setState({topicsEdited: updatedTopicsEdited});
    this.props.onTopicsEdited(updatedTopicsEdited);
  }

  removeTopicHandler = (topicID) => {
    // if id = topicID then get the index and splice
    const updatedTopicsConfig = [...this.state.topicsConfig];
    const updatedTopicsEdited = [...this.state.topicsEdited];

    updatedTopicsConfig.map((_, index) => {
        if (index+1 === topicID) {
            updatedTopicsConfig.splice(index, 1);
            updatedTopicsEdited.splice(index, 1);
            this.setState({topicsConfig: updatedTopicsConfig});
            this.setState({topicsEdited: updatedTopicsEdited});
            this.props.onTopicsEdited(updatedTopicsEdited);
            this.props.onTopicsConfig(updatedTopicsConfig);
        }
        return updatedTopicsConfig
    });
    // alert('Topic removed!');
  }

  componentWillMount() {
    this.setState({
      colnames: this.props.colnames,
      data: this.props.data,
      feedbackInformation: this.props.feedbackInformation,
      topicsConfig:this.props.topicsConfig,
      topicsEdited: this.props.topicsEdited,
    })
  }

  componentDidUpdate() {
  }

  render() {
    const topics = this.state.topicsConfig.map((top, i) => 
       <Topic 
            key={top.topicName+i}
            topicId={i+1}
            colnames={this.state.colnames} // equivalent to the heather of the data
            updateState={this.updateStateHandler}
            topicConfig={top}
            deleteTopic={this.removeTopicHandler}
            />        
    )
    let data_available = '';
    let expand = true;
    if (this.state.data[0][0] !== undefined) {
      data_available = <p>Your data has been stored from your previous upload.</p>
      expand = false;}
    
    return (
      <div>
        <Grid>
          <Row >
            <Col md={12}>
              <h1>Welcome to the Indivi platform!</h1>
            </Col>
          </Row>

          <Row >
            <Panel bsStyle="info" defaultExpanded={expand}>
              <Panel.Heading>
                <Panel.Title componentClass="h3" toggle>Instructions: how to create a personalized feedback (click to open)</Panel.Title>
              </Panel.Heading>
              <Panel.Collapse>
              <Panel.Body>
                <Col md={6}> 
                <p><font size="4">This platform helps researchers provide <strong>individualised 
                  feedback</strong> to the participants of their studies. Here, you can build the 
                  feedback for one study. An example of the PDF output is provided here:</font></p>
                  <a href={pdfEx}>Click to download the example PDF</a>
                <Document file={pdfEx}><Page pageNumber={1} /></Document>
                </Col>
                <Col md={6}>
                  <Panel> <Panel.Body>
                  <p><font size="4">Your feedback is composed of:</font></p>
                    <ol><font size="4">
                      <li>A title</li>
                      <li>The purpose of the study</li>
                      <li>Feedback on some of the research questions (typically 3 to 6)</li>
                      <li>A conclusion</li>
                      <li>A signature (your name)</li>
                      </font></ol>
                    <p><font size="4">First, <strong>for each research question (point 3)</strong>, you will provide a <strong>name and the relevant data</strong> 
                      </font></p>
                    <p><font size="4">Each research question (point 3) can be set-up and edited individually and consists 
                    of a graph displaying the individual value of the participant and of 
                    a text (written by you) explaining the graph.</font></p>
                    <p><font size="4">Then, you will provide the <strong>title of the feedback (point 1), the purpose of the study (point 2), the conclusion (point 4) and a signature (point 5)</strong>.</font></p>
                  </Panel.Body></Panel>
                  <Panel> <Panel.Body>
                    <p><font size="4">This tool is the result of a Master's thesis at the University of Zurich by Florian Fischer, supervised by Prof. Dr. 
                    Chat Wacharamanotham and Dr. Andrea B. Horn, Dipl.Psych.</font></p>
                    <a href={thesisPDF}>The PDF of this thesis can be downloaded under this link</a>
                    <p><font size="4">By questions, remarks or problems, you can contact Andrea Horn: a.horn@psychologie.uzh.ch</font></p>
                  </Panel.Body></Panel>
                </Col>
                  </Panel.Body>
                  </Panel.Collapse>
                </Panel>                
          </Row>

          <Row >
            <Panel bsStyle="warning" defaultExpanded={expand}>
              <Panel.Heading>
                <Panel.Title componentClass="h3" toggle>Instructions on the data (click to open)</Panel.Title>
              </Panel.Heading>
                  <Panel.Collapse>
                  <Panel.Body>
                      <p>Your data need to include a unique identifier (called ID) and at least one 
                        variable of interest. It may contain as many variables as you want. On top of variables,
                        your data can include information about time and about groups.</p>
                      <p>Your data need to be in .csv format.</p>
                      <p>Here is an example of how your data could look like</p>
                      <Image  src={dataExample} responsive/>
                  </Panel.Body>
                  </Panel.Collapse>
              </Panel>                
          </Row>

          <Row>
            <h2>Data upload</h2>
          </Row>

          <Row>
            <Col md={6}>
                <CSVReader 
                    cssClass="csv-input"
                    label="Please upload the data set you prepared for your feedback:  "
                    onFileLoaded={this.displayColNameHandler}
                    inputId="TestData"/>
            </Col>
            {/* <Col md={6}>
                <p>Here is the list of the columns you uploaded:  </p>
                <ButtonGroup >
                  {this.state.colnames.map(colname => (<Button key={colname} disabled>{colname}</Button>))}
                </ButtonGroup>
            </Col> */}
          </Row>
          <Row>
            {data_available}
          </Row>

          <Collapse in={this.state.data.length > 6}><Row>
            <h3>Here are the first 5 lines of your data:</h3>
            <Table 
              colnames={this.state.colnames}
              data={this.state.data}/>
          </Row></Collapse>

          { this.state.data[0][0] !== undefined 
            ? ( <div>
          <Row>
            <h2>Feedback on research questions</h2>
          </Row>

          <Row >
          <Panel bsStyle="info" defaultExpanded={false}>
            <Panel.Heading>
              <Panel.Title componentClass="h3" toggle>Instructions: choose the variables for the topic (click to open)</Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
            <Panel.Body>
              <p><font size="4">Each research question can receive the following information:</font></p>
              <ul><font size="4">
                <li><u>ID</u> (<strong>mandatory</strong>): a unique value to identify each single person or element. </li>
                <li><u>Variable</u> (<strong>mandatory</strong>): a value measured for each participant (dependent or independent variable).</li>
                <li><u>Time</u> (optional): an element for which the variable varies within each ID. It must be a number ordering the time points.</li>
                <li><u>Time Name</u> (optional): if you have a time variable, you can choose a column from your dataset giving a name to each time point.</li>
                <li><u>Group or Dyad</u> (optional): an information relative to each participant ID or dyad ID.
                If only comparison to the entire sample are expected, leave 
                  blank.</li>
                <li><u>Variable 2</u> (optional): a second variable to compare to the main variable.</li>
                <li><u>Variable 3</u> (optional): a third variable to compare to the main variable.</li>
                </font></ul>
            </Panel.Body>
            </Panel.Collapse>
          </Panel>
          </Row>
          <Row >
          <Panel bsStyle="info" defaultExpanded={false}>
            <Panel.Heading>
              <Panel.Title componentClass="h3" toggle>For Dyads: instructions (click to open)</Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
            <Panel.Body>
              <p><font size="4">For dyads, <strong>ID</strong> must be the ID of the dyad and 
              <strong> group</strong> must be the distinguishable feature of the dyad (e.g. husband/wife).</font></p>
            </Panel.Body>
            </Panel.Collapse>
          </Panel>
          </Row>
          <Jumbotron>
            {topics}
          </Jumbotron>
          <Row>
              <Button style={{zIndex:1}}
              bsStyle="primary" bsSize="large" block
              onClick={this.addTopicHandler}>
              Add new research question
              </Button>
          </Row>
          </div>
          ) : null }
        </Grid>
      </div>
    );
  }
}

export default IntroPage;
