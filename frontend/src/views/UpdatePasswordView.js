import React from 'react';
import UpdatePasswordForm from 'views/UpdatePasswordForm';
import { BaseComponent } from '../components/BaseComponent';
import queryString from 'query-string';
import { UserService } from '../services/UserService';

import {
    Card,
    Col,
    Row,
  } from 'reactstrap';


class UpdatePasswordView extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = { ...this.state, messages: [], updatePasswordCodeVerifyFailed: true
    };
  }

  componentDidMount() {
    const codeInfo = queryString.parse(this.props.location.search);
    // console.log("codeInfo: ", codeInfo);
    // console.log("codeInfo.user_name: ", codeInfo.user_name);
    // console.log("codeInfo.code: ", codeInfo.code);

    UserService.updatePasswordCodeVerify({user_name: codeInfo.user_name, code: codeInfo.code}).subscribe(resp => {
      if(resp.status === true) {
        this.setState({...this.state, updatePasswordCodeVerifyFailed: false});
      } else {
        this.setState({...this.state, updatePasswordCodeVerifyFailed: true});
      }
    });
  }


    
  
  render() {
    return (
        <Row 
        style={{
          height: '100vh',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Col md={8} lg={6}>
          <Card body>
            {
                (this.state.updatePasswordCodeVerifyFailed == false) ?
                <UpdatePasswordForm/> : ''
            }
            {
                (this.state.updatePasswordCodeVerifyFailed == true) ?
                <h3>Invalid Password Update Code.  Please Submit A New Password Update Request</h3> : ''
            }
          </Card>
        </Col>
      </Row>
    );
  }
}

export default UpdatePasswordView;
