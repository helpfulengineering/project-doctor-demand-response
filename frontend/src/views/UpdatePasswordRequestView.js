import React from 'react';
import UpdatePasswordRequestForm from 'views/UpdatePasswordRequestForm';
import { BaseComponent } from '../components/BaseComponent';
import {
    Card,
    Col,
    Row,
  } from 'reactstrap';


class UpdatePasswordRequestView extends BaseComponent {
  
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
            <UpdatePasswordRequestForm/>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default UpdatePasswordRequestView;
