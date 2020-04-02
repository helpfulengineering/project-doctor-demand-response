import React from 'react';
import UpdatePasswordForm from 'views/UpdatePasswordForm';
import { BaseComponent } from '../components/BaseComponent';
import {
    Card,
    Col,
    Row,
  } from 'reactstrap';


class UpdatePasswordView extends BaseComponent {
  
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
            <UpdatePasswordForm/>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default UpdatePasswordView;
