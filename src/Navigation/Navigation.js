import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router-dom';

class Navigation extends Component {
    constructor(props) {
      super(props);
  
      this.toggle = this.toggle.bind(this);
      this.state = {
        isOpen: false
      };
    }
  
    toggle() {
      this.setState({
        isOpen: !this.state.isOpen
      });
    }
  
    render() {
      return (
        <div>
          <Navbar fixedTop>
            <Navbar.Header>
              <Navbar.Brand>
                <Link to="/">1. Research questions</Link>
              </Navbar.Brand>
            </Navbar.Header>
            <Nav>
              <LinkContainer to='/feedback-info'>
              <NavItem eventKey={1}>
                2. General information
              </NavItem></LinkContainer>
              <LinkContainer to='/preview'>
              <NavItem eventKey={2}>
                3. Preview
              </NavItem></LinkContainer>
              <NavDropdown eventKey={3} title="4. Export" id="export">
                <LinkContainer to='/export-pdf'><MenuItem eventKey={2.1}>PDF</MenuItem></LinkContainer>
                <LinkContainer to='/export-booklet'><MenuItem eventKey={2.2}>Booklet</MenuItem></LinkContainer>
                <LinkContainer to='/export-html'><MenuItem eventKey={2.3}>HTML/Website</MenuItem></LinkContainer>
            </NavDropdown>
            </Nav>
            <Nav pullRight>
              <LinkContainer to='/settings'>
              <NavItem eventKey={1}>
                Settings
              </NavItem></LinkContainer>
            </Nav>
        </Navbar>
        </div>
      );
    }
  }
  
  export default Navigation;