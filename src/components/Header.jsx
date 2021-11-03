import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import * as routes from '../routes';
import Divider from '@material-ui/core/Divider';

const Header = ({history}) => {
  const onSignUpClicked = () => {
    history.push(routes.SIGN_UP);
  };
  const onLoginClicked = () => {
    history.push(routes.LOG_IN);
  };
  const onMethodClicked = () => {
    history.push(routes.METHOD);
  };
  const homeClicked = () => {
    history.push(routes.HOME);
  };
  return (
    <div className="header">
      <Navbar expand="lg">
        <Navbar.Brand onClick={homeClicked}>
          {' '}
          <div>
            CrossTalk (Alpha){/*CompanyName*/}
            {/*<img
              width={35}
              alt="Company logo"
              src={`${process.env.REACT_APP_REACT_URL}/checklist.png`}
              style={{ paddingLeft: 5, paddingBottom: 5 }}
            />*/}
          </div>
          {' '}

        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Link onClick={onMethodClicked}> How to use </Nav.Link>
          </Nav>
          {
            /*
            <Nav.Link onClick={onSignUpClicked}> Sign up </Nav.Link>
            <Nav.Link onClick={onLoginClicked}> Login </Nav.Link>
          </Nav>
             */
          }

        </Navbar.Collapse>
      </Navbar>
      <Divider />
  </div>
  ) 
};

export default withRouter(Header);