import React from 'react';
import { Button, Form, FormGroup, Input, Label, Row, Col, Alert, Card, CardBody, CardImg } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { BaseComponent } from '../components/BaseComponent';
import { UserService } from '../services/UserService';
import logoImage from '../assets/img/logo/Original.png';
import queryString from 'query-string';
import FormUtil from '../utils/form-util';

class UpdatePasswordRequestForm extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = { ...this.state, userNotActivated: '', existingUser: '', successfulRequest: false, messages: [], userInfo: {
            user_name: '',
        }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleUserInfoChange = this.handleUserInfoChange.bind(this);
    this.updatePasswordRequest = this.updatePasswordRequest.bind(this);
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

  updatePasswordRequest = event => {
    event.preventDefault();

    let userInfo = this.state.userInfo;
    FormUtil.trimFields(userInfo);

    UserService.updatePasswordRequest(this.state.userInfo).subscribe(resp => {
        if(resp && resp.status === true) {
          this.setState({...this.state, 
            successfulRequest: true,
            userNotActivated: resp.data.userNotActivated, 
            existingUser: resp.data.existingUser
          });
        } else {
          this.setState({...this.state,
            successfulRequest: false, 
            userNotActivated: resp.data.userNotActivated, 
            existingUser: resp.data.existingUser
          });
        }
    });

    let messages = this.validate(userInfo);
    if(messages.length !== 0) {
      this.setState({...this.state, messages: messages});
      return;
    }
    
  }

  validate(pr) {
    let messages = [];

    if(FormUtil.isEmpty(pr.user_name)) {
      messages.push('Your Email is required');
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
                <Form name='pr' onSubmit={this.updatePasswordRequest}>
                {
                    (
                      this.state.successfulRequest === true
                    ) ? 
                    <Alert color="danger">
                      Your Password Request Was Successful!  Please Check Your Email For Your Password Reset Key.
                    </Alert> : '' 
                  }
                  {
                    (
                      this.state.existingUser === false
                    ) ? 
                    <Alert color="danger">
                      User Account Does Not Exist.  Click 'Signup' to Create a New Account.
                    </Alert> : '' 
                  }
                  {
                    (
                      this.state.existingUser === true 
                      && this.state.userNotActivated === true  
                    ) ?
                    <Alert color="warning">
                      Your account is not activated yet! Please check your email for activation instructions.
                    </Alert> : '' 
                  }
                  <FormGroup>
                    <Label>Enter User Name</Label>
                    <Input type="text" name="user_name" value={this.state.userInfo.user_name} onChange={this.handleUserInfoChange}/>
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
                        onClick={this.updatePasswordRequest}>
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

export default withRouter(UpdatePasswordRequestForm);
