import React, { Component } from 'react';
import { Form, FormGroup, ControlLabel, FormControl, 
  Panel, Col, DropdownButton, MenuItem,
  Pager, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


const categories = ['id', 'variable', 'time', 'timeName', 'group', 'variable2', 'variable3'];

class Topic extends Component {
    constructor(props) {
      super(props);

      this.state = {
        topicName: this.props.topicConfig.topicName,
        id: this.props.topicConfig.id,
        variable: this.props.topicConfig.variable,
        time: this.props.topicConfig.time,
        timeName: this.props.topicConfig.timeName,
        group: this.props.topicConfig.group,
        variable2: this.props.topicConfig.variable2,
        variable3: this.props.topicConfig.variable3
      };

    }

    handleChange(e, key) {
      let newValue;
      if (typeof(e) !== 'string') {newValue = e.target.value}
      else if (e === 'select') {newValue = '';}
      else {newValue = e}
      this.setState({ [key]: newValue }, () => 
        this.props.updateState(this.state, this.props.topicId));
    }
  
    render() {
      const placeholder = [];
      categories.map((cat, i) => {
        let catValue;
        if (this.state[cat] === '') {
          catValue = 'select';
        } else {
          catValue = this.state[cat];
        }
        placeholder[i] = catValue;
        return placeholder
      })
      return (
        <div>
          <Panel id="collapsible-panel" defaultExpanded style={{zIndex:10}}>
            <Panel.Heading>
              <Form inline>
                <FormGroup controlId='topicName'>
                  <ControlLabel>Name of the research question</ControlLabel>{' '}
                  <FormControl
                    type="text"
                    value={this.state.topicName}
                    placeholder={'Research question ' + this.props.topicId}
                    onChange={(e) => this.handleChange(e, 'topicName')}/>
                </FormGroup>{' '}
                  {/* <FormControl.Feedback /> */}
                <Button className="pull-right" bsStyle="danger" bsSize="small" 
                    onClick={() => this.props.deleteTopic(this.props.topicId)}>
                  Delete research question</Button>
              </Form>
              {/* <Panel.Title toggle componentClass="h3">{this.state.topicName}</Panel.Title> */}
            </Panel.Heading>
            <Panel.Collapse><Panel.Body>
                <Form horizontal>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                      ID
                    </Col>
                    <Col sm={3}>
                      <DropdownButton title={placeholder[0]} id={`dropdown-basic-Default`} 
                              style={{zIndex:10}} onSelect={(e) => this.handleChange(e, 'id')}>
                          <MenuItem eventKey={'select'}>select</MenuItem>
                          {this.props.colnames.map((colname, index) => (
                            <MenuItem key={index} eventKey={colname}>
                              {colname}
                            </MenuItem>), this)}
                        </DropdownButton>
                    </Col>
                    <Col componentClass={ControlLabel} sm={3}>
                      Variable
                    </Col>
                    <Col sm={3}>
                      <DropdownButton title={placeholder[1]} id={`dropdown-basic-Default`} 
                              style={{zIndex:10}} onSelect={(e) => this.handleChange(e, 'variable')}>
                          <MenuItem eventKey={'select'}>select</MenuItem>
                          {this.props.colnames.map((colname, index) => (
                            <MenuItem key={index} eventKey={colname}>
                              {colname}
                            </MenuItem>), this)}
                        </DropdownButton>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                      Time
                    </Col>
                    <Col sm={3}>
                      <DropdownButton title={placeholder[2]} id={`dropdown-basic-Default`} 
                            style={{zIndex:10}} onSelect={(e) => this.handleChange(e, 'time')}>
                        <MenuItem eventKey={'select'}>select</MenuItem>
                        {this.props.colnames.map((colname, index) => (
                          <MenuItem key={index} eventKey={colname}>
                            {colname}
                          </MenuItem>), this)}
                      </DropdownButton>
                    </Col>
                    <Col componentClass={ControlLabel} sm={3}>
                      Variable 2
                    </Col>
                    <Col sm={3}>
                      <DropdownButton title={placeholder[5]} id={`dropdown-basic-Default`} 
                              style={{zIndex:10}} onSelect={(e) => this.handleChange(e, 'variable2')}>
                          <MenuItem eventKey={'select'}>select</MenuItem>
                          {this.props.colnames.map((colname, index) => (
                            <MenuItem key={index} eventKey={colname}>
                              {colname}
                            </MenuItem>), this)}
                        </DropdownButton>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                      Time Name
                    </Col>
                    <Col sm={3}>
                      <DropdownButton title={placeholder[3]} id={`dropdown-basic-Default`} 
                              style={{zIndex:10}} onSelect={(e) => this.handleChange(e, 'timeName')}>
                          <MenuItem eventKey={'select'}>select</MenuItem>
                          {this.props.colnames.map((colname, index) => (
                            <MenuItem key={index} eventKey={colname}>
                              {colname}
                            </MenuItem>), this)}
                        </DropdownButton>
                    </Col>
                    <Col componentClass={ControlLabel} sm={3}>
                      Variable 3
                    </Col>
                    <Col sm={3}>
                      <DropdownButton title={placeholder[6]} id={`dropdown-basic-Default`} 
                              style={{zIndex:10}} onSelect={(e) => this.handleChange(e, 'variable3')}>
                          <MenuItem eventKey={'select'}>select</MenuItem>
                          {this.props.colnames.map((colname, index) => (
                            <MenuItem key={index} eventKey={colname}>
                              {colname}
                            </MenuItem>), this)}
                        </DropdownButton>
                    </Col>
                  </FormGroup>
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                      Group/Dyad
                    </Col>
                    <Col sm={3}>
                      <DropdownButton title={placeholder[4]} id={`dropdown-basic-Default`} 
                              style={{zIndex:10}} onSelect={(e) => this.handleChange(e, 'group')}>
                          <MenuItem eventKey={'select'}>select</MenuItem>
                          {this.props.colnames.map((colname, index) => (
                            <MenuItem key={index} eventKey={colname}>
                              {colname}
                            </MenuItem>), this)}
                        </DropdownButton>
                    </Col>
                  </FormGroup>
                </Form>
                <Pager>
                <LinkContainer to={'/topic-edit/'+ String(Number(this.props.topicId))}><Pager.Item>
                  Configure chart and text
                </Pager.Item></LinkContainer>
              </Pager>

                {/* {categories.map((cat, i) => {
                  return (
                    <div key={i}>
                      <label >{cat}:     </label>
                      {'          '}
                      <DropdownButton bsSize="xsmall"
                        title={cat}
                        key={i}
                        id={`dropdown-basic-Default`}>
                          
                      </DropdownButton>
                    </div>
                  )}, this)} */}
            </Panel.Body></Panel.Collapse>
            {/* <Panel.Footer>
              
            </Panel.Footer> */}
          </Panel>
        </div>
        
      );
    }
  }
  
  export default Topic;