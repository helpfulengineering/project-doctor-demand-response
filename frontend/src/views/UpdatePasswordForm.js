import React from 'react';
import { Button, Form, FormGroup, Input, Label, Row, Col, Alert, Card, CardBody, CardImg } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { BaseComponent } from '../components/BaseComponent';
import { AuthenticationService } from '../services/AuthenticationService';
import logoImage from '../assets/img/logo/Original.png';
import queryString from 'query-string';
import FormUtil from '../utils/form-util';

class UpdatePasswordForm extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = { ...this.state, newActivation: false, retypedPassword: '', messages: [], loginInfo: {
            user_name: '',
            password: ''
        }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLoginInfoChange = this.handleLoginInfoChange.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.validate = this.validate.bind(this);
    this.redirectToSignup = this.redirectToSignup.bind(this);
    this.redirectToLogin = this.redirectToLogin.bind(this);
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

  redirectToLogin(event) {
    event.preventDefault();
    this.props.history.push("/login");
  }

  handleChange(event) {
    let state = this.state[event.target.name] = event.target.value;
    this.setState({...state});
  }

  updatePassword = event => {
    event.preventDefault();

    let loginInfo = this.state.loginInfo;
    FormUtil.trimFields(loginInfo);

    AuthenticationService.updatePassword(this.state.loginInfo).subscribe(resp => {
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
    if(messages.length !== 0) {
      this.setState({...this.state, messages: messages});
      return;
    }
    
  }

  validate(rf) {
    let messages = [];

    if(FormUtil.isEmpty(rf.user_name)) {
      messages.push('Your Email is required');
    }
    if(FormUtil.isEmpty(rf.password)) {
      messages.push('Your Password is required');
    } 
    if(FormUtil.isEmpty(rf.resetPassword)) {
        messages.push('You Must Retype Your Password');
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
                <Form name='rf' onSubmit={this.resetPassword}>
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
                      && this.state.userNotActivated === true  
                    ) ?
                    <Alert color="warning">
                      Your account is not activated yet! Please enter your username and password and retype your password.
                    </Alert> : '' 
                  }

                  <FormGroup>
                    <Label>Enter User Name</Label>
                    <Input type="text" name="user_name" value={this.state.loginInfo.user_name} onChange={this.handleLoginInfoChange}/>
                  </FormGroup>
                  <FormGroup>
                    <Label>Enter New Password</Label>
                    <Input type="password" name="newpassword" value={this.state.loginInfo.password} onChange={this.handleLoginInfoChange} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Retype New Password</Label>
                    <Input type="password" name="retypePassword" value={this.state.retypedPassword} onChange={this.handleLoginInfoChange} />
                  </FormGroup>

                  <hr />

                  <Row className='p-0'>
                    <Col xl={3} lg={3} md={3}>
                      <Button
                        size="md"
                        block
                        color="primary"
                        className="border-0"
                        onClick={this.updatePassword}>
                        Login
                      </Button>
                    </Col>
                    <Col xl={6} lg={6} md={6} className="p-0">
                      <Button
                        color="secondary"
                        onClick={this.redirectToSignup}
                        >
                        Signup
                      </Button>
                    </Col>
                    <Col xl={3} lg={3} md={3} className="d-flex justify-content-center p-0">
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

export default withRouter(UpdatePasswordForm);
