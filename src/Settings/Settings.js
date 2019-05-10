import React, { Component } from 'react';
import { Grid, Row, Jumbotron } from 'react-bootstrap';
import DownloadLink from "react-download-link";
import ReactFileReader from 'react-file-reader';
 
class Settings extends Component {
    constructor (props) {
        super(props);

        this.state = {
            settings: '',
            loading: true
        }
    }

    fileReader = (files) => {
        let file = files[0];
        const self = this;
        const reader = new FileReader();
        reader.onload = function (reader) {
            const newSettings = JSON.parse(reader.target.result);
            self.setState({settings: newSettings, loading: false},
                () => self.props.onSettingsUpload(self.state.settings))
            };
        reader.readAsText(file);
    }
    
    
    render() {
        let success;
        if (!this.state.loading){
            success = <p>File uploaded successfully</p>
        }
        return (
        <div>
        <Grid>
            <Row>
            <Jumbotron>
                <h2>Settings </h2>
                <p>
                    Here you can download or upload the settings (incl. the data) you have entered so far.
                    Once you have created the feedback, you can download the settings to keep a trace of what you have chosen.
                    If you want to recreate the feedback or make some changes later, you can upload the same file and your session will be restored as you left it.
                    After uploading, you will be able to work on your feedback normally. 
                </p>
                <hr></hr>
                <p>Download settings (incl. data)</p>
                <DownloadLink filename='feedbackSettings.json' exportFile={() => {
                    const colnames = sessionStorage.getItem('colnames');
                    const data = sessionStorage.getItem('data');
                    const feedbackInformation = sessionStorage.getItem('feedbackInformation');
                    const topicsConfig = sessionStorage.getItem('topicsConfig');
                    const topicsEdited = sessionStorage.getItem('topicsEdited'); 
                    const settings = {'colnames': colnames, 'data': data, 
                        'feedbackInformation': feedbackInformation, 'topicsConfig': topicsConfig, 
                        'topicsEdited': topicsEdited}
                    return JSON.stringify(settings);
                }}>Save to disk</DownloadLink>
                <hr></hr>
                <p>Upload the settings file</p>
                <ReactFileReader handleFiles={this.fileReader} fileTypes={'.json'}>
                    <button className='btn'>Upload your settings</button>
                </ReactFileReader>
                {success}
            </Jumbotron>
            </Row>
        </Grid>
        </div>
    );}
}

export default Settings;