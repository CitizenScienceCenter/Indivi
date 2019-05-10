import React, { Component } from 'react';
import { Button, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';


class ErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    componentDidCatch(error, info){
        this.setState({hasError: true})
        console.log(error, info)
    }

    handleDismiss() {
        this.setState({ hasError: false });
      }
  
    render() {
      if (this.state.hasError || this.props.catchedError) {
        return <Alert bsStyle="danger" onDismiss={this.handleDismiss}>
        <h4>Oh snap! You got an error!</h4>
        <p>
        Something went wrong with your choice of variables. Please try again and refer to the instructions if something is not clear.
        </p>
        <p>
        <LinkContainer to='/'>
        <Button onClick={this.handleDismiss}>Ok, I try</Button>
        </LinkContainer>
        </p>
    </Alert>;
      }
      return this.props.children;
    }
}

export default ErrorBoundary;
