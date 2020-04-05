import React from 'react';
import { Button, Form, FormGroup, Input, Label, Row, Col, Alert, Card, CardBody, CardImg } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { BaseComponent } from '../components/BaseComponent';
import { UserService } from '../services/UserService';
import logoImage from '../assets/img/logo/Original.png';
import queryString from 'query-string';
import FormUtil from '../utils/form-util';

class UpdatePasswordForm extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = { ...this.state, messages: [], userInfo: {
      user_name: '',
      password: '',
      retypedPassword: ''}
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUserInfoChange = this.handleUserInfoChange.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.validate = this.validate.bind(this);
    this.redirectToSignup = this.redirectToSignup.bind(this);
    this.redirectToLogin = this.redirectToLogin.bind(this);
  }

  componentDidMount() {
    super.componentDidMount();
    const params = queryString.parse(this.props.location.search);
    this.setState({...this.state});
  }

  handleUserInfoChange(event) {
    let userInfo = this.state.userInfo;
    userInfo[event.target.name] = event.target.value;
    this.setState({...this.state, userInfo: userInfo});
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

    let userInfo = this.state.userInfo;
    FormUtil.trimFields(userInfo);

    if(userInfo.password === userInfo.retypedPassword
       && userInfo.password !=='')
       {
          UserService.updatePassword(this.state.userInfo).subscribe(resp => {
            if(resp && resp.status === true) {
              this.props.history.push("/login");
            } else {
                this.setState({...this.state,
                userNotActivated: resp.data.userNotActivated, 
                existingUser: resp.data.existingUser
                });
              }
          });
        }
  

    let messages = this.validate(userInfo);
    //if(messages.length !== 0) {
      this.setState({...this.state, messages: messages});
      return;
   // }
    
  }

  validate(rf) {
    let messages = [];

    if(FormUtil.isEmpty(rf.user_name)) {
      messages.push('Your Email is required');
    }
    if(FormUtil.isEmpty(rf.password)) {
      messages.push('Your Password is required');
    } 
    if(FormUtil.isEmpty(rf.retypedPassword)) {
      messages.push('You Must Retype Your Password');
    }
    if(rf.password !== rf.retypedPassword) {
      messages.push('Password and Retyped Password Do Not Match');
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
                
                <Form name='rf' onSubmit={this.updatePassword}>
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
                    <Input type="text" name="user_name" value={this.state.userInfo.user_name} onChange={this.handleUserInfoChange}/>
                  </FormGroup>
                  <FormGroup>
                    <Label>Enter New Password</Label>
                    <Input type="password" name="password" value={this.state.userInfo.password} onChange={this.handleUserInfoChange}/>
                  </FormGroup>
                  <FormGroup>
                    <Label>Retype New Password</Label>
                    <Input type="password" name="retypedPassword" value={this.state.userInfo.retypedPassword} onChange={this.handleUserInfoChange}/>
                  </FormGroup>

                  <hr />

                  <Row className='p-0'>
                    <Col xl={6} lg={6} md={6}>
                      <Button
                        size="md"
                        width = ""
                        block
                        color="primary"
                        className="border-0"
                        onClick={this.updatePassword}>
                        Reset Password
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
