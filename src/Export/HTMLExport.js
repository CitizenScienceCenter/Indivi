import React, { Component } from 'react';
import download_all from 'downloadjs';
import { Grid, Row,
    Button, Panel, Jumbotron } from 'react-bootstrap';

import HTMLGeneration from './HTMLGeneration';

// create a website for each participant

class HTMLExport extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id_var: this.props.id_var,
            MyDocs: [],
            fileNames: []
        }
    }

    MyDocsHandler = (MyDocs) => {
        this.setState({MyDocs: MyDocs});
    }

    // handleChange(e) {
    //     let newValue;
    //     if (typeof(e) !== 'string') {newValue = e.target.value}
    //     else if (e === 'select') {newValue = '';}
    //     else {newValue = e}
    //     this.setState({ id_var: newValue });
    //   }

    download = (MyDocs, fileNames) => {
        MyDocs.map((MyDoc, i) => {
            if (MyDoc !== null) {
                download_all(MyDoc, fileNames[i], "text/html")}
            return MyDocs;
        })
    }

    componentDidMount() {
        const data_withH = [...this.props.data];
        const data_noH = [...data_withH]
        data_noH.shift();
        const headers = data_withH[0];
        const feedbackInformation = this.props.feedbackInformation;
        const topicsConfig = this.props.topicsConfig;
        const topicsEdited = this.props.topicsEdited;
        const partIds = [];
        const partIdIndex = headers.indexOf(this.props.topicsConfig[0].id);// find the index of the partId
        data_noH.map(line => {
            partIds.push(line[partIdIndex]);
            return partIds;
        });
        const uniquePartIds = [...new Set(partIds)] // eliminate duplicates (have each partId only once)
        
        const fileNames = [];
        uniquePartIds.map(partId => {
            return fileNames.push("participant"+partId+".html");
        })

        const downloads = <HTMLGeneration data_noH={data_noH} headers={headers} 
            uniquePartIds={uniquePartIds} feedbackInformation={feedbackInformation} 
            topicsConfig={topicsConfig} topicsEdited={topicsEdited} MyDocsHandler={this.MyDocsHandler}/>
        this.setState({fileNames: fileNames, downloads: downloads})
    }

    render() {
        return (
            // <h1>This will export your feedback as an individual PDF for each participant.</h1>
            <div>
            <Grid>
                <Row>
                <Jumbotron>
                    <h2>Export individualized websites in HTML</h2>
                    <p>
                        Here you can download the HTML files with the individualized feedback of each 
                        participant according to its participant id.
                    </p>
                    {/* <label>Please choose the column to be used as ID: </label>{'   '}
                    <DropdownButton title={this.state.id_var} id={`dropdown-basic-Default`} 
                              style={{zIndex:10}} onSelect={(e) => this.handleChange(e)}>
                          {this.props.colnames.map((colname, index) => (
                            <MenuItem key={index} eventKey={colname}>
                              {colname}
                            </MenuItem>), this)}
                        </DropdownButton> */}
                    <p>Dowload all the HTML files at once:</p>
                    <p> <Button
                        bsStyle="primary" 
                        onClick={() => (this.download(this.state.MyDocs, this.state.fileNames))}>
                        Download all participant feedbacks
                    </Button></p>
                    <p> </p>
                    <hr></hr>
                    <p>If you whish to save your work and continue later, go to "settings" on the 
                    top-right corner.</p>
                </Jumbotron>
                </Row>
                <Row>
                    <Panel>
                        <Panel.Heading>Alternatively, you can download each HTML file separately.</Panel.Heading>
                        <Panel.Body>
                            {this.state.downloads}
                        </Panel.Body>
                    </Panel>
                </Row>
            </Grid>
            </div>
        );

    }
}

export default HTMLExport;