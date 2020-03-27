import React from 'react';
import { BaseComponent } from '../components/BaseComponent';
import queryString from 'query-string';
import { UserService } from '../services/UserService';
import { withRouter } from "react-router-dom";
import logoImage from '../assets/img/logo/Original trimmed.png';

import {
    Card,
    Col,
    Row, Alert, CardImg, CardBody, CardText
  } from 'reactstrap';


class ActivationView extends BaseComponent {
  
  constructor(props) {
    super(props);
    this.state = { ...this.state, messages: [], activationFailed: false
    };
  }

  componentDidMount() {

    const userInfo = queryString.parse(this.props.location.search);
    UserService.activateUser({user_name: userInfo.user_name, code: userInfo.code}).subscribe(resp => {
      if(resp.status === true) {
        this.props.history.push("/login?newActivation=true");
      } else {
        this.setState({...this.state, messages: ['Failed'], activationFailed: true});
        if(resp.accountStatus === 'suspended') {
          this.setState({...this.state, accountSuspended: true});
        }
      }
    });
  }
  render() {
    return (
      <Row className="border-0" style={{
        height: '80vh',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        
        <Col md={6} sm={6} xs={6} lg={6} className="border-0">
          <Card className="border-0">
            <Row className="bg-light">
              <Col md={3} sm={3} xs={3} lg={3} >
              
              </Col>
              <Col md={6} sm={6} xs={6} lg={6} >
                <CardImg className="p-4"
                  top
                  src={logoImage}
                />
              </Col>
            </Row>
            
            <CardBody className="bg-light">
            {
              this.state.activationFailed === true ? 
              <Alert color="danger">
                Activation failed.
              </Alert> : '' 
            }
          </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default withRouter(ActivationView);
