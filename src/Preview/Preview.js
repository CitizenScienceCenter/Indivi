import React from 'react';
import { Grid, Row, Jumbotron } from 'react-bootstrap';
import PDFGeneration from '../Export/PDFGeneration';
import BookletGeneration from '../Export/BookletGeneration';
import HTMLGeneration from '../Export/HTMLGeneration';

const blobHandler = (blob) => {
    return;
}
const MyDocsHandler = (MyDoc) => {
    return;
}

const preview  = (props) => {
    
    const data_withH = [...props.data];
    const data_noH = [...data_withH]
    data_noH.shift();
    const headers = data_withH[0];
    const feedbackInformation = props.feedbackInformation;
    const topicsConfig = props.topicsConfig;
    const topicsEdited = props.topicsEdited;
    const partIds = [];
    const partIdIndex = headers.indexOf(props.topicsConfig[0].id);// find the index of the partId
    data_noH.map(line => {
        partIds.push(line[partIdIndex]);
        return partIds;
    });
    const uniquePartIds = [...new Set(partIds)] // eliminate duplicates (have each partId only once)
        
    const partId = []
    partId.push(uniquePartIds[Math.floor(0.5*uniquePartIds.length)]);

    const downloadPDF = <PDFGeneration data_noH={data_noH} headers={headers} 
            uniquePartIds={partId} feedbackInformation={feedbackInformation} topicsConfig={topicsConfig}
            topicsEdited={topicsEdited} blobHander={blobHandler}/>

    const downloadBooklet = <BookletGeneration data_noH={data_noH} headers={headers} 
            uniquePartIds={partId} feedbackInformation={feedbackInformation} topicsConfig={topicsConfig}
            topicsEdited={topicsEdited} blobHander={blobHandler}/>

    const downloadHTML = <HTMLGeneration data_noH={data_noH} headers={headers} 
            uniquePartIds={partId} feedbackInformation={feedbackInformation} topicsConfig={topicsConfig}
            topicsEdited={topicsEdited} MyDocsHandler={MyDocsHandler}/>

    return (
        <div>
        <Grid>
            <Row>
            <Jumbotron>
                <h2>Preview </h2>
                <hr></hr>
                <p>Feedback in PDF format</p>
                {downloadPDF}
                <hr></hr>
                <p>Feedback as Booklet</p>
                {downloadBooklet}
                <hr></hr>
                <p>Feedback as HTML website</p>
                {downloadHTML}
                <hr></hr>
                <p>If you whish to save your work and continue later, go to "settings" on the 
                    top-right corner.</p>
            </Jumbotron>
            </Row>
        </Grid>
        </div>
    );
}

export default preview;