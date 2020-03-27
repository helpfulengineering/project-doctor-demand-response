import React from 'react';
import { Button, Form, FormGroup, Input, Label, Row, Col, Alert, Card, CardBody, CardImg } from 'reactstrap';
import { withRouter } from "react-router-dom";
import { BaseComponent } from '../components/BaseComponent';
import { AuthenticationService } from '../services/AuthenticationService';
import logoImage from '../assets/img/logo/Original.png';
import queryString from 'query-string';

class LoginForm extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = { ...this.state, loginFailed: false, newActivation: false, loginInfo: {
            user_name: '',
            password: ''
        }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleLoginInfoChange = this.handleLoginInfoChange.bind(this);
    this.login = this.login.bind(this);
    this.redirectToSignup = this.redirectToSignup.bind(this);
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

  handleChange(event) {
    let state = this.state[event.target.name] = event.target.value;
    this.setState({...state});
  }

  login = event => {
    event.preventDefault();
    this.validate();
    
    AuthenticationService.login(this.state.loginInfo).subscribe(resp => {
      if(resp && resp.status === true) {
        this.props.history.push("/");
      } else {
        this.setState({...this.state, loginFailed: true});
      }
    });
  }

  validate() {

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
                <Form onSubmit={this.login}>
                  {
                    this.state.newActivation === 'true' ? 
                    <Alert color="success">
                      Your account is activated! Please login.
                    </Alert> : '' 
                  }
                  {
                    this.state.loginFailed === true ? 
                    <Alert color="danger">
                      Login failed due to invalid credentials.
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
                        block
                        color="primary"
                        className="border-0"
                        onClick={this.login}>
                        Login
                      </Button>
                    </Col>
                    <Col xl={6} lg={6} md={6} className="p-0">
                      Don't have account? &nbsp;&nbsp;
                      <Button
                        color="secondary"
                        onClick={this.redirectToSignup}
                        >
                        Signup
                      </Button>
                    </Col>
                    <Col xl={3} lg={3} md={3} className="d-flex justify-content-center p-0">
                      <Button outline color="link" size="sm" className="text-primary">Forgot Password?</Button>
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
