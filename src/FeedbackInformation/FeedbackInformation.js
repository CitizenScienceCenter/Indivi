import React, { Component } from 'react';
import { FormControl, FormGroup, ControlLabel, 
  Grid, Row, Well,
  Button, ButtonGroup } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import ImageUploader from 'react-images-upload';



class FeedbackInformation extends Component {
  constructor(props) {
    super(props);

    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeIntroduction = this.handleChangeIntroduction.bind(this);
    this.handleChangeConclusion = this.handleChangeConclusion.bind(this);
    this.handleChangeSignature = this.handleChangeSignature.bind(this);


    this.state = {
      logo: '',
      title: '',
      introduction: '',
      conclusion: '',
      signature: ''
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0)
  }

  handleImageUpload(pic) {
    this.setState({ logo: pic }, () => this.props.onFeedbackInformation(this.state));
  }
  
  handleChangeTitle(e) {
    this.setState({ title: e.target.value }, () => this.props.onFeedbackInformation(this.state));
  }

  handleChangeIntroduction(e) {
    this.setState({ introduction: e.target.value }, () => this.props.onFeedbackInformation(this.state));
  }

  handleChangeConclusion(e) {
    this.setState({ conclusion: e.target.value }, () => this.props.onFeedbackInformation(this.state));
  }

  handleChangeSignature(e) {
    this.setState({ signature: e.target.value }, () => this.props.onFeedbackInformation(this.state));
  }

  componentWillMount() {
    this.setState({
      logo: this.props.feedbackInformation.logo,
      title: this.props.feedbackInformation.title,
      introduction: this.props.feedbackInformation.introduction,
      conclusion: this.props.feedbackInformation.conclusion,
      signature: this.props.feedbackInformation.signature
    })
  }


  render() {
    return (
      <Grid>
        <Row>
          <h2>Information on the study</h2>
          <font><p>The information you enter here will be the same for all participants. <br></br>
            Your feedback will start with a title and be followed by an introduction.<br></br>
            In the layout of your feedback, different topics will then be displayed following your configuration
            (below).The topics are individualized pieces of feedback so each participant will see a different one.<br></br>
            After the diffrent topics, your conclusion will be displayed, followed by your signature.
            </p></font>
        </Row>

        <Row><Well>
        <ImageUploader
                withIcon={false}
                withPreview={true}
                buttonText='Choose logo'
                onChange={(pic) => (this.handleImageUpload(pic))}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                singleImage={true}
            />
        <form>
        <FormGroup controlId="formTitle">
            <ControlLabel>Title</ControlLabel>
            <FormControl
            type="text"
            value={this.state.title}
            placeholder="Enter the title"
            onChange={this.handleChangeTitle}/>
        </FormGroup>
        <FormGroup controlId="formIntroduction">
            <ControlLabel>Purpose of the study</ControlLabel>
            <FormControl
            type="text"
            componentClass="textarea"
            style={{ height: 200 }}
            value={this.state.introduction}
            placeholder="Enter the introduction"
            onChange={this.handleChangeIntroduction}/>
        </FormGroup>
        <FormGroup controlId="formConclusion">
            <ControlLabel>Conclusion</ControlLabel>
            <FormControl
            type="text"
            componentClass="textarea"
            style={{ height: 200 }}
            value={this.state.conclusion}
            placeholder="Enter the conclusion"
            onChange={this.handleChangeConclusion}/>
        </FormGroup>
        <FormGroup controlId="formTitle">
            <ControlLabel>Signature (e.g. your name)</ControlLabel>
            <FormControl
            type="text"
            value={this.state.signature}
            placeholder="Enter the signature"
            onChange={this.handleChangeSignature}/>
        </FormGroup>
        </form>
        </Well></Row>

        <Row>
              <h2>Preview how an individualized feedback will look like</h2>
              <LinkContainer to={'/preview'}>
                  <Button bsStyle="info" bsSize="large">Preview of the feedback</Button>
              </LinkContainer>
        </Row>
        <Row>
            <h2>Export your feedback</h2>
            <ButtonGroup>
            <LinkContainer to={'/export-pdf'}>
                <Button bsStyle="success">As PDF</Button>
            </LinkContainer>
            <LinkContainer to={'/export-booklet'}>
                <Button bsStyle="success">As booklet</Button>
            </LinkContainer>
            <LinkContainer to={'/export-html'}>
                <Button bsStyle="success">As individual websites</Button>
            </LinkContainer>
            </ButtonGroup>
        </Row>
      </Grid>
    );
  }
}

export default FeedbackInformation;