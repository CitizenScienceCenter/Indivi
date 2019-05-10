import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel,
    Panel } from 'react-bootstrap';


class CatText extends Component {
    // receives as props: textOptions (from topicsEdited)
    // + a change handler
    
    constructor(props) {
        super(props);
        // this.handleChangeHigh = this.handleChangeHigh.bind(this);
        // this.handleChangeMiddle = this.handleChangeMiddle.bind(this);
        // this.handleChangeLow = this.handleChangeLow.bind(this);
        this.state = {
          textHigh: this.props.textOptions.textHigh,
          textMiddle: this.props.textOptions.textMiddle,
          textLow: this.props.textOptions.textLow
        };
    }

    componentWillMount() {
        if (this.props.textOptions.textHigh === '') {
            const newTextH = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich zu den anderen Studienteilnehmer liegt. Ihr Wert befindet sich im oberen Viertel der gesammelten Antworten. Das bedeutet... ';
            this.setState({textHigh: newTextH})
        }
        if (this.props.textOptions.textMiddle === '') {
            const newTextM = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich zu den anderen Studienteilnehmer liegt. Ihr Wert befindet sich in der mittleren Hälfte der gesammelten Antworten. Das bedeutet... ';
            this.setState({textMiddle: newTextM})
        }
        if (this.props.textOptions.textLow === '') {
            const newTextL = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich zu den anderen Studienteilnehmer liegt. Ihr Wert befindet sich im unteren Viertel der gesammelten Antworten. Das bedeutet... ';
            this.setState({textLow: newTextL})
        }
    }
    
    handleChangeHigh = (e) => {
    const newText = e.target.value;
    this.setState({textHigh: newText});
    this.props.updateCatText(newText, 'textHigh');
    }

    handleChangeMiddle = (e) => {
    const newText = e.target.value;
    this.setState({textMiddle: newText});
    this.props.updateCatText(newText, 'textMiddle');
    }

    handleChangeLow = (e) => {
    const newText = e.target.value;
    this.setState({textLow: newText});
    this.props.updateCatText(newText, 'textLow');
    }

    render () {
        // let textHigh = this.props.textOptions.textHigh;
        // if (textHigh === '') {
        //     textHigh = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich zu den anderen Studienteilnehmer liegt. Ihr Wert befindet sich im oberen Viertel der gesammelten Antworten. Das bedeutet... ';}
        
        // let textMiddle = this.props.textOptions.textMiddle;
        // if (textMiddle === '') {
        //     textMiddle = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich zu den anderen Studienteilnehmer liegt. Ihr Wert befindet sich in der mittleren Hälfte der gesammelten Antworten. Das bedeutet... ';}
            
        // let textLow = this.props.textOptions.textLow;
        // if (textLow === '') {
        //     textLow = 'In der Graphik sehen Sie, wo Ihr Wert im Vergleich zu den anderen Studienteilnehmer liegt. Ihr Wert befindet sich im unteren Viertel der gesammelten Antworten. Das bedeutet... ';}
    
        return (
        <Panel bsStyle="info" defaultExpanded={true}>
            <Panel.Heading>
            <Panel.Title componentClass="h3" toggle>Personalize text - if not needed, leave blank (click to close)</Panel.Title>
            </Panel.Heading>
            <Panel.Collapse>
            <Panel.Body>
                <p>Here, you can enter a text that explains the graph to the participants. You can adapt your text
                    in three categories which will be displayed to the participant according to their personal value.
                    If you write the same text in all categories, all participants will see the same text.</p>
                <p>Participants are placed in categories according to their own value. If there are more than one
                    value per participant, avergages are built. For fluctuating values within a person, the mean successive 
                    squared differences (MSSD) are computed. MSSD gives one value for each participant and this value represents
                    how much a participant fluctuates. This enables to make comparison on the fluctuations between participants.</p>
                <p>If you have used multiple variables, the classification is performed on the first (main) variable.</p>
                <p>You can add values referring to your data in this text. To do so, please write the 
                        name of the computed value after a # (e.g. #group_mean_Affect). The correct value will be shown in the text 
                        (see next to the graph) and not here.</p>
                    <p>The following computed values available are:</p>
                    <ul>
                        {this.props.allowedCompVals.map(variable => (<li key={variable}>{variable}</li>))}
                    </ul>
                <form>
                <FormGroup controlId="formHigh">
                    <ControlLabel>This text will be displayed to participants with a value <span style={{color:'red'}}> above 
                        the 75th percentile.</span></ControlLabel>
                    <FormControl
                    type="text"
                    componentClass="textarea"
                    style={{ height: 200 }}
                    value={this.state.textHigh}
                    placeholder="Enter your text"
                    onChange={this.handleChangeHigh}/>
                </FormGroup>
                <FormGroup controlId="formMiddle">
                    <ControlLabel>This text will be displayed to participants with a value 
                    <span style={{color:'red'}}> between the 25th and the 75th percentile.</span></ControlLabel>
                    <FormControl
                    type="text"
                    componentClass="textarea"
                    style={{ height: 200 }}
                    value={this.state.textMiddle}
                    placeholder="Enter your text"
                    onChange={this.handleChangeMiddle}/>
                </FormGroup>
                <FormGroup controlId="formLow">
                    <ControlLabel>This text will be displayed to participants with a value 
                        <span style={{color:'red'}}> below the 25th percentile.</span></ControlLabel>
                    <FormControl
                    type="text"
                    componentClass="textarea"
                    style={{ height: 200 }}
                    value={this.state.textLow}
                    placeholder="Enter your text"
                    onChange={this.handleChangeLow}/>
                </FormGroup>
                </form>
            </Panel.Body>
            </Panel.Collapse>
        </Panel>
        )
    }
    
}

export default CatText;