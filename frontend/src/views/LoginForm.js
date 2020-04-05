import React from 'react';
import { Button, Form, FormGroup, Input, Label, Row, Col, Alert, Card, CardBody, CardImg } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { BaseComponent } from '../components/BaseComponent';
import { AuthenticationService } from '../services/AuthenticationService';
import logoImage from '../assets/img/logo/Original.png';
import queryString from 'query-string';
import FormUtil from '../utils/form-util';

class LoginForm extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = { ...this.state, newActivation: false, messages: [], loginInfo: {
            user_name: '',
            password: ''
        }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLoginInfoChange = this.handleLoginInfoChange.bind(this);
    this.login = this.login.bind(this);
    this.validate = this.validate.bind(this);
    this.redirectToSignup = this.redirectToSignup.bind(this);
    this.redirectToUpdatePasswordRequest = this.redirectToUpdatePasswordRequest.bind(this);

  }

  componentDidMount() {
    super.componentDidMount();
    const params = queryString.parse(this.props.location.search);
    this.setState({...this.state, newActivation: params.newActivation});
  }

  handleLoginInfoChange(event) {
    let loginInfo = this.state.loginInfo;
    loginInfo[event.target.name] = event.target.value;
    this.setState({...this.state, loginInfo: loginInfo});
  }

  redirectToSignup(event) {
    event.preventDefault();
    this.props.history.push("/signup");
  }
  
  redirectToUpdatePasswordRequest(event) {
    event.preventDefault();
    this.props.history.push("/updatePasswordRequest");
  }

  handleChange(event) {
    let state = this.state[event.target.name] = event.target.value;
    this.setState({...state});
  }

  login = event => {
    event.preventDefault();

    let loginInfo = this.state.loginInfo;
    FormUtil.trimFields(loginInfo);

    AuthenticationService.login(this.state.loginInfo).subscribe(resp => {
      if(resp && resp.status === true) {
        this.props.history.push("/");
      } else {
        this.setState({...this.state, 
          userNotActivated: resp.data.userNotActivated, 
          loginFailed: resp.data.loginFailed, 
          userSuspended: resp.data.userSuspended,
          existingUser: resp.data.existingUser
        });
      }
    });

    let messages = this.validate(loginInfo);
    this.setState({...this.state, messages: messages});
    return;
    
  }

  validate(lf) {
    let messages = [];

    if(FormUtil.isEmpty(lf.user_name)) {
      messages.push('Your Email is required');
    }
    if(FormUtil.isEmpty(lf.password)) {
      messages.push('Your Password is required');
    } 
    return messages;
  }


  render() {
   
    return (
      <Row className="border-0">
        <Col md={3} sm={3} xs={3} className="border-0 d-flex mb-3 align-items-center">
          <CardImg
              className="card-img-left"
              src={logoImage}
            />
        </Col>
        <Col md={9} sm={9} xs={9} className="mb-3 border-0">
          <Card className="flex-row border-0">
            <CardBody>
                
                <Form name='lf' onSubmit={this.login}>
                {
                  this.state.messages.length > 0 ? 
                  <Alert color='danger'> <ul>
                    {
                      this.state.messages.map(message => {
                      return <li>{message}</li>
                      })
                    }
                  </ul></Alert> : ''
                }
                  {
                    (
                      this.state.newActivation === 'true' 
                    ) ? 
                    <Alert color="success">
                      Your account is activated! Please login.
                    </Alert> : '' 
                  }
                  {
                    (
                      this.state.existingUser === false
                    ) ? 
                    <Alert color="danger">
                      User does not exist.  Click 'Signup' to Create a New Account.
                    </Alert> : '' 
                  }
                  {
                    (
                      this.state.existingUser === true 
                      && this.state.userNotActivated === false 
                      && this.state.userSuspended === false 
                      && this.state.loginFailed === true
                    ) ? 
                    <Alert color="danger">
                      Login failed due to invalid credentials.  Click 'Forgot Password' to Reset Your Password
                    </Alert> : '' 
                  }
                  {
                    (
                      this.state.existingUser === true 
                      && this.state.userNotActivated === true  
                    ) ?
                    <Alert color="warning">
                      Your account is not activated yet! An activation email has been previously sent out to your email.
                    </Alert> : '' 
                  }
                  {
                    (
                      this.state.existingUser === true 
                      && this.state.userSuspended === true 
                    ) ? 
                    <Alert color="danger">
                      Your account is suspended.  Please Click Forgot Password To Request a Password Reset.
                    </Alert> : '' 
                  }
                  <FormGroup>
                    <Label>User Name</Label>
                    <Input type="text" name="user_name" value={this.state.loginInfo.user_name} onChange={this.handleLoginInfoChange}/>
                  </FormGroup>
                  <FormGroup>
                    <Label>Password</Label>
                    <Input type="password" name="password" value={this.state.loginInfo.password} onChange={this.handleLoginInfoChange} />
                  </FormGroup>
                
                  <hr />
                  <Row className='p-0'>
                    <Col xl={3} lg={3} md={3}>
                      <Button
                        size="md"
                        block color="primary"
                        className="border-0"
                        onClick={this.login}>
                        Login
                      </Button>
                    </Col>
                    <Col xl={6} lg={6} md={6} className="p-0">
                      <Button
                        name="btnSignup"
                        color="secondary"                        
                        onClick={this.redirectToSignup}>
                          Signup
                      </Button>
                    </Col>
                    <Col xl={3} lg={3} md={3} className="d-flex justify-content-center p-0">
                      <Button
                        name="btnUpdatePassword" 
                        outline color="link" 
                        size="sm" 
                        className="text-primary"
                        onClick={this.redirectToUpdatePasswordRequest}>
                          Forgot Password?
                      </Button>
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
    );
  }
}

export default withRouter(LoginForm);
