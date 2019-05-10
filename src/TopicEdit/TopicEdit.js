import React, { Component } from 'react';
import { Grid, Row, Col, Well, Panel,
    Button, ButtonToolbar,
    Pager, FormControl, FormGroup, ControlLabel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import * as math from 'mathjs';


import findPartCategory from '../findPartCategory'; // input: data_withH, topicConfig, partId
import BoxPlot from './BoxPlot/BoxPlot';
import CatText from './CatText/CatText';
import LinePlot from './LinePlot/LinePlot';

// the data format is an array of arrays. Each array is a line. So, the length of the data = number of lines.
// for each sub-array, there is a value for each column. 


class TopicEdit extends Component {
    constructor (props) {
        super(props);

        this.state = {
            topicsEdited: this.props.topicsEdited, // an array of objects (for each topic)
            dyad: this.props.topicsEdited[(this.props.location.pathname.split('/')[2])-1].graphOptions.dyad,
            groupComp: this.props.topicsEdited[(this.props.location.pathname.split('/')[2])-1].graphOptions.groupComp,
            graphText: this.props.topicsEdited[(this.props.location.pathname.split('/')[2])-1].textOptions.graphText,
        };

    }

    componentDidMount() {
        window.scrollTo(0, 0)
    }

    componentWillMount() {
        // define the graphText (text that describes the graph)
        let graphText;
        const topicConfig = this.props.topicsConfig[(this.props.location.pathname.split('/')[2])-1];
        if (topicConfig.time !== '') { // case for a line plot
            graphText = 'Diese Graphik ist ein Liniendiagramm. Es zeigt die Verteilung der Werte über die Zeit. Die Werte aller Teilnehmer sind der Druchschnitt aller Werte an einem Zeitpunkt.'
        } 
        else { // case for a box plot
            if (topicConfig.variable2 === '' && topicConfig.variable3 === '') { // case with 1 variable -> no Z transformation
                graphText = 'Diese Graphik ist ein Boxplot. Es zeigt die Verteilung der Werte aller Teilnehmer. 50% der Teilnehmer hatten einen Wert innerhalb der Box. 25% der Teilnehmer waren oberhalb und 25% waren unterhalb der Box. Die Linie innerhalb der Box zeigt den Median. Eine Hälfte der Teilnehmer war oberhalb und die andere Hälfte unterhalb. Die Linie oberhalb und unterhalb der Box (Whiskers) zeigen das Minimum und das Maximum.'}
            else { // case with Z transformation (multiple variables)
                graphText = 'Diese Graphik ist ein Boxplot. Es zeigt die Verteilung der Werte aller Teilnehmer. 50% der Teilnehmer hatten einen Wert innerhalb der Box. 25% der Teilnehmer waren oberhalb und 25% waren unterhalb der Box. Die Linie innerhalb der Box zeigt den Median. Eine Hälfte der Teilnehmer war oberhalb und die andere Hälfte unterhalb. Die Linie oberhalb und unterhalb der Box (Whiskers) zeigen das Minimum und das Maximum. Da die Variablen auf verschiedenen Skalen gemessen wurden, wurden sie transformiert um vergleichbar zu sein (sogennante Z-Transformation).'}

        } 
        const newTopicsEdited = [...this.state.topicsEdited]
        newTopicsEdited[(this.props.location.pathname.split('/')[2])-1].textOptions.graphText = graphText
        this.setState({graphText: graphText});
        this.setState({topicsEdited: newTopicsEdited});
    }


    handleTextClick = (text) => {
        if (text === 'topicText') {window.scrollTo(0, 250);}
        if (text === 'catText') {window.scrollTo(0, 1200);}
    }
    
    updateTextHandler = (newVal, text, topicId, allowedCompVals, compVals) => {
        let newValue = newVal;
        if (typeof(newValue) !== 'string') {
            newValue = newVal.target.value;
        }
        const re_patt = RegExp('#\\w*','gi');
        let res;
        const all_matches = [];
        while ((res = re_patt.exec(newValue)) !== null){
            const match = res[0] // the compVals inputed by the user
            all_matches.push(match); 
        }

        all_matches.map(match => {
            allowedCompVals.map((allowedCompVal, index) => {
                if (match === allowedCompVal) {
                    const replac = compVals[index];
                    newValue = newValue.replace(match, replac)
                }
                return newValue
            })
            return newValue
        })        
    
        const newtopicsEdited = this.state.topicsEdited;
        const newTopicEdited = {...newtopicsEdited[topicId-1]};
        const newTextOptions = newTopicEdited.textOptions;
        newTextOptions[[text]] = newValue;
        newTopicEdited.textOptions = newTextOptions;
        newtopicsEdited[topicId-1] = newTopicEdited;
        this.setState( {topicsEdited: newtopicsEdited});
        this.props.onTopicsEdited(newtopicsEdited);
    }

    updateGraphQuestions = (dyad, groupComp, topicId) => {
        this.setState({
            dyad: dyad,groupComp: groupComp})

        const newtopicsEdited = [...this.state.topicsEdited];
        const newTopicEdited = newtopicsEdited[topicId-1];
        const newGraphOptions = newTopicEdited.graphOptions;
        newGraphOptions.dyad = dyad;
        newGraphOptions.groupComp = groupComp;
        newTopicEdited.graphOptions = newGraphOptions;
        newtopicsEdited[topicId-1] = newTopicEdited;
        this.props.onTopicsEdited(newtopicsEdited);
    }

    updateURL = (graphDiv) => {
        const newtopicsEdited = this.state.topicsEdited;
        const newTopicEdited = {...newtopicsEdited[(this.props.location.pathname.split('/')[2])-1]};
        const newGraphOptions = newTopicEdited.graphOptions;
        newGraphOptions.graphDiv = graphDiv;
        newTopicEdited.graphOptions = newGraphOptions;
        newtopicsEdited[(this.props.location.pathname.split('/')[2])-1] = newTopicEdited;
        this.props.onTopicsEdited(newtopicsEdited);
    }

    render() {
        const topicId = this.props.location.pathname.split('/')[2];
        
        //CAVE does not work if values are undefinded (direct access)

        const topicConfig = this.props.topicsConfig[topicId-1];
        const topicEdited = this.props.topicsEdited[topicId-1];

        const topicsVariables = {...topicConfig};
        const topicName = topicsVariables.topicName;
        delete topicsVariables.topicName;
        Object.keys(topicsVariables).forEach((key) => 
            (topicsVariables[key] === "") && delete topicsVariables[key]);
        const variableArray = [];
        const categoriesArray = [];
        Object.values(topicsVariables).map((item, i) => {
            if (typeof(item) === "string") {
                variableArray.push(item);
                categoriesArray.push(Object.keys(topicsVariables)[i]);}
            return variableArray;
        })
        
        const data_withH = [...this.props.data];
        // create a list of all partIds, remove deplicates and choose a random partId to be displayed
        const data_noH = [...data_withH]
        const partIds = [];
        const headers = data_withH[0];
        data_noH.shift();
        const partIdIndex = headers.indexOf(topicConfig.id);// find the index of the partId
        data_noH.map(line => {
            partIds.push(line[partIdIndex]);
            return partIds;
        });
        const uniquePartIds = [...new Set(partIds)] // eliminate duplicates (have each partId only once)
        const partId = uniquePartIds[Math.floor(0.5*uniquePartIds.length)];
        //

        // Define the computed values
        const pureVars = []; // get only the variables (without ID, time, group)
        pureVars.push(topicConfig.variable);
        if (topicConfig.variable2 !== '') {pureVars.push(topicConfig.variable2);}
        if (topicConfig.variable3 !== '') {pureVars.push(topicConfig.variable3);}
        const allowedCompVals = []; // the allowed compVals according to the varialbes chosen for the topic
        const compVals = []; // the actual, computed values
        pureVars.map(variable => {
            if (this.state.dyad) { // for dyads, the computed values of interest are Partner 1 and Partner 2
                const partner1 = "#partner1_mean_" + variable
                const partner2 = "#partner2_mean_" + variable
                allowedCompVals.push(partner1, partner2)
            }
            else {
            const group = "#sample_mean_" + variable
            const person = "#person_mean_" + variable
            allowedCompVals.push(group, person)}

            const all_var = [] // temporary array
            const pers_var = []
            const varIndex = headers.indexOf(variable); // find the index of the variable
            const idIndex = headers.indexOf(topicConfig.id);
            data_noH.map(line => {
                all_var.push(line[varIndex])
                if(line[idIndex] === partId){
                    pers_var.push(line[varIndex])}
                return all_var})
            const group_mean = math.mean(all_var).toFixed(2);
            const pers_mean = math.mean(pers_var).toFixed(2);
            compVals.push(group_mean, pers_mean)
            return compVals
        })
        //

        // defining the personalized text to be displayed
        const textOptions = topicEdited.textOptions;
        const partCategory = findPartCategory(data_noH, headers, topicConfig, partId);
        let personalizedText;
        if (typeof(textOptions) !== 'object') {
            personalizedText = 'No text entered yet';
        } else if(textOptions[partCategory] === '') {
            if (partCategory === 'textHigh') {
                textOptions[partCategory] = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich der anderen Studienteilnehmer liegt. Ihr Wert befindet sich im oberen Viertel der gesammelten Antworten. Das bedeutet... '; 
            }
            else if (partCategory === 'textMiddle') {
                textOptions[partCategory] = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich der anderen Studienteilnehmer liegt. Ihr Wert befindet sich in der mittleren Hälfte der gesammelten Antworten. Das bedeutet... ';
            } else {
                textOptions[partCategory] = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich der anderen Studienteilnehmer liegt. Ihr Wert befindet sich im unteren Viertel der gesammelten Antworten. Das bedeutet... ';
            }
            personalizedText = textOptions[[partCategory]];
        } else {
            personalizedText = textOptions[[partCategory]];}
        
        let topicText = topicEdited.textOptions.topicText;
        if (topicText === '') {
            topicText = 'Während der Studie haben wir Werte zum Thema '+topicName+' gesammelt. Wir möchten diese hiermit in Form eines personalisierten Feedbacks zurückgeben.';}

        let graphText = topicEdited.textOptions.graphText;

        // further questions
        let graphQuestions;
        const dyad = this.state.dyad;
        let styleDyadYes = "primary";
        let styleDyadNo = "default";
        if (!dyad) {styleDyadYes = "default"; styleDyadNo = "primary"}
        const groupComp=this.state.groupComp;
        let styleGCYes = "primary";
        let styleGCNo = "default";
        if (!groupComp) {styleGCYes = "default"; styleGCNo = "primary";}
        let graph;
        // Type 8 Time + group/dyad + multiple variables
        if (categoriesArray.includes('id') &&
            categoriesArray.includes('variable') &&
            categoriesArray.includes('time') &&
            categoriesArray.includes('group') &&
            (categoriesArray.includes('variable2') ||
            categoriesArray.includes('variable3'))) 
            {   graphQuestions = <Well><h3>Is the group a dyad?</h3>
                <ButtonToolbar><Button bsStyle={styleDyadYes} onClick={() => 
                    this.updateGraphQuestions(partId, groupComp, topicId)}>Yes</Button>
                                <Button bsStyle={styleDyadNo} onClick={() => 
                    this.updateGraphQuestions(false, groupComp, topicId)}>No</Button></ButtonToolbar></Well>
                
                graph = <LinePlot data_noH={data_noH} headers={headers} 
                    topicConfig={topicConfig} partId={partId} dyad={dyad}
                    urlUpdate={this.updateURL}/>;
                }
        
        // Type 7 Time + multiple variables
        else if(
            categoriesArray.includes('id') &&
            categoriesArray.includes('variable') &&
            categoriesArray.includes('time') &&
            !categoriesArray.includes('group') &&
            (categoriesArray.includes('variable2') ||
            categoriesArray.includes('variable3')))
            { graph = <LinePlot data_noH={data_noH} headers={headers} 
            topicConfig={topicConfig} partId={partId}
            urlUpdate={this.updateURL}/>; }
        
        // Type 6 Time + Group/Dyad
        else if(
            categoriesArray.includes('id') &&
            categoriesArray.includes('variable') &&
            categoriesArray.includes('time') &&
            categoriesArray.includes('group') &&
            !categoriesArray.includes('variable2') &&
            !categoriesArray.includes('variable3'))
            {   graphQuestions = <Well><h3>Is the group a dyad?</h3>
                <ButtonToolbar><Button bsStyle={styleDyadYes} onClick={() => 
                    this.updateGraphQuestions(partId, groupComp, topicId)}>Yes</Button>
                                <Button bsStyle={styleDyadNo} onClick={() => 
                    this.updateGraphQuestions(false, groupComp, topicId)}>No</Button></ButtonToolbar></Well>

                graph = <LinePlot data_noH={data_noH} headers={headers} 
                    topicConfig={topicConfig} partId={partId} dyad={dyad}
                    urlUpdate={this.updateURL}/>;
                
            }

        // Type 5 Only Time
        else if(
            categoriesArray.includes('id') &&
            categoriesArray.includes('variable') &&
            categoriesArray.includes('time') &&
            !categoriesArray.includes('group') &&
            !categoriesArray.includes('variable2') &&
            !categoriesArray.includes('variable3'))
            {   graphQuestions = <Well><Row><h3>Which kind of comparison would you like to show?</h3>
                <ButtonToolbar><Button bsStyle={styleGCYes} onClick={() => 
                    this.updateGraphQuestions(dyad, true, topicId)}>To all participants (between person)</Button>
                                <Button bsStyle={styleGCNo} onClick={() => 
                    this.updateGraphQuestions(dyad, false, topicId)}>To one-self (within-person)</Button></ButtonToolbar></Row></Well>
                
                graph = <LinePlot data_noH={data_noH} headers={headers} 
                    topicConfig={topicConfig} partId={partId} groupComp={groupComp}
                    urlUpdate={this.updateURL}/>;
            }

        // Type 4 Multiple variables + Dyad / Group
        else if(
            categoriesArray.includes('id') &&
            categoriesArray.includes('variable') &&
            !categoriesArray.includes('time') &&
            categoriesArray.includes('group') &&
            (categoriesArray.includes('variable2') ||
            categoriesArray.includes('variable3')))
            {   graphQuestions = <Well><h3>Is the group a dyad?</h3>
                <ButtonToolbar><Button bsStyle={styleDyadYes} onClick={() => 
                    this.updateGraphQuestions(partId, groupComp, topicId)}>Yes</Button>
                                <Button bsStyle={styleDyadNo} onClick={() => 
                    this.updateGraphQuestions(false, groupComp, topicId)}>No</Button></ButtonToolbar></Well>
                
                graph = <BoxPlot data_noH={data_noH} headers={headers} 
                    topicConfig={topicConfig} partId={partId} dyad={dyad}
                    urlUpdate={this.updateURL}/>;
        }
        // Type 3 - Multiple variables
        else if(
            categoriesArray.includes('id') &&
            categoriesArray.includes('variable') &&
            !categoriesArray.includes('time') &&
            !categoriesArray.includes('group') &&
            (categoriesArray.includes('variable2') ||
            categoriesArray.includes('variable3')))
            { graph = <BoxPlot data_noH={data_noH} headers={headers} 
                topicConfig={topicConfig} partId={partId}
                urlUpdate={this.updateURL}/>;}

        // Type 2 - Dyad / Group
        else if(
            categoriesArray.includes('id') &&
            categoriesArray.includes('variable') &&
            !categoriesArray.includes('time') &&
            categoriesArray.includes('group') &&
            !categoriesArray.includes('variable2') &&
            !categoriesArray.includes('variable3'))
            {   const dyadQuestion = <div><h3>Is the group a dyad?</h3>
                <ButtonToolbar><Button bsStyle={styleDyadYes} onClick={() => 
                    this.updateGraphQuestions(partId, groupComp, topicId)}>Yes</Button>
                                <Button bsStyle={styleDyadNo} onClick={() => 
                    this.updateGraphQuestions(false, groupComp, topicId)}>No</Button></ButtonToolbar></div>
                let groupQuestion;
                if (dyad === false) {groupQuestion = <div><h3>Show the comparison to all groups?</h3>
                <ButtonToolbar><Button bsStyle={styleGCYes} onClick={() => 
                    this.updateGraphQuestions(dyad, true, topicId)}>Yes</Button>
                                <Button bsStyle={styleGCNo} onClick={() => 
                    this.updateGraphQuestions(dyad, false, topicId)}>No</Button></ButtonToolbar></div>}
                graphQuestions = <Well><Row><Col md={6}>{dyadQuestion}</Col>
                                <Col md={6}>{groupQuestion}</Col></Row></Well>

                graph = <BoxPlot data_noH={data_noH} headers={headers} 
                    topicConfig={topicConfig} partId={partId} dyad={dyad} groupComp={groupComp}
                    urlUpdate={this.updateURL}/>
            }

        // Type 1 - only variable        
        else if (
            categoriesArray.includes('id') &&
            categoriesArray.includes('variable') &&
            !categoriesArray.includes('time') &&
            !categoriesArray.includes('group') &&
            !categoriesArray.includes('variable2') &&
            !categoriesArray.includes('variable3'))
            { graph = <BoxPlot data_noH={data_noH} headers={headers} 
                    topicConfig={topicConfig} partId={partId}
                    urlUpdate={this.updateURL}/>}
        //// End of topics

        ///// Pagination
        let previousButton;
        let nextButton;
        if (topicId > 1) {
            const prevConfig = this.props.topicsConfig[topicId-2];
            previousButton = <LinkContainer to={'/topic-edit/'+ String(Number(topicId)-1)}><Pager.Item>
                            &larr; Configure previous research question: {prevConfig.topicName}
                        </Pager.Item></LinkContainer>};
        
        if (topicId < this.props.topicsConfig.length) {
            const nextConfig = this.props.topicsConfig[topicId];
            nextButton = <LinkContainer to={'/topic-edit/'+ String(Number(topicId)+1)}><Pager.Item>
                            Configure next research question: {nextConfig.topicName} &rarr;
                        </Pager.Item></LinkContainer>};
        if (topicId >= this.props.topicsConfig.length) {
            nextButton = <LinkContainer to={'/'}><Pager.Item>
                            Add new research question &rarr;
                        </Pager.Item></LinkContainer>};
        /////// End of pagination

        return (
            <div>
            <Grid>
                <Row>
                    <h2>You are editing research question {topicId}: {topicName}</h2>
                </Row>
                <Row>
                    <Col md={6}><Well>
                        <p><font size="4">You can set up the research question here. For each topic, the
                        participants will see a graph (displaying their individual values)
                        and a text (written by you) explaining the graph.</font></p>
                    </Well></Col>
                    <Col md={6}>
                        <p>Here is the list of the columns you have chosen in the previous page:  </p>
                        <ul>
                            {variableArray.map(variable => (<li key={variable}>{variable}</li>))}
                        </ul>
                    </Col>
                </Row>

                {/* Topic text */}
                <Row >
                    <Panel bsStyle="warning" defaultExpanded={true}>
                    <Panel.Heading>
                        <Panel.Title componentClass="h3" toggle>Description of the research question (click to close)</Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse>
                    <Panel.Body>
                        <p>You can add values refering to your data in this text. To do so, please write the 
                            name of the computed value after a # (e.g. #sample_mean_Affect). This will automatically replace the tag by the correct value.</p>
                        <p>The following computed values are available:</p>
                        <ul>
                            {allowedCompVals.map(variable => (<li key={variable}>{variable}</li>))}
                        </ul>
                        <FormGroup controlId="topicText">
                            <FormControl
                            type="text"
                            componentClass="textarea"
                            style={{ height: 200 }}
                            value={topicText}
                            placeholder="Enter your text"
                            onChange={(event) => (this.updateTextHandler(event, 'topicText', topicId, allowedCompVals, compVals))}/>
                        </FormGroup>
                    </Panel.Body>
                    </Panel.Collapse>
                    </Panel>
                </Row>

                {/* Graph questions */}
                <Row>
                    {graphQuestions}
                </Row>     
                
                {/* Preview */}
                <Row>
                <Panel defaultExpanded>
                    <Panel.Heading>
                        <Panel.Title toggle>This is what a random participant would see (click to close)</Panel.Title>
                    </Panel.Heading>
                    <Panel.Collapse><Panel.Body>
                        <ControlLabel>This is your general text on the topic</ControlLabel>
                        <p onClick={() => this.handleTextClick('topicText')}>{topicText}</p>
                        <Col md={6}>
                        {graph}
                        <form><FormGroup controlId="formControlsTextarea">
                            <ControlLabel>Here you can update the graph explanation</ControlLabel>
                            <FormControl componentClass="textarea" value={graphText} 
                                style={{ height: 150 }}
                                onChange={(event) => (this.updateTextHandler(event, 'graphText', topicId, allowedCompVals, compVals))}/>
                        </FormGroup></form>
                        </Col>
                        <Col md={6}>
                            <ControlLabel>This is your personalized text:</ControlLabel>
                            <p onClick={() => this.handleTextClick('catText')}>{personalizedText}</p>
                        </Col>
                    </Panel.Body></Panel.Collapse>
                </Panel></Row>

                {/* Personalized text (yes/no) */}
                <Row>
                    <CatText textOptions={topicEdited.textOptions} allowedCompVals={allowedCompVals}
                        updateCatText={(newValue, text) => (this.updateTextHandler(newValue, text, topicId, allowedCompVals, compVals))}/>
                </Row>

                {/* Pager */}
                <Row>
                    <Pager>
                        {previousButton}
                        {nextButton}
                    </Pager>
                    <Pager>
                        <LinkContainer to='/'><Pager.Item >
                            &larr; Overview of the research questions
                        </Pager.Item></LinkContainer>
                        <LinkContainer to='/feedback-info'><Pager.Item>
                            Go to study information &rarr;
                        </Pager.Item></LinkContainer>
                    </Pager>
                </Row>
            </Grid>
            </div>
        );
    }
}

export default TopicEdit;