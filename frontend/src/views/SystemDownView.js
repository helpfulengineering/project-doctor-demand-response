import React from 'react';
import { BaseComponent } from '../components/BaseComponent';
import { Form, FormGroup, Row, Col, Card, CardBody, CardImg, Alert } from 'reactstrap';
import logoImage from '../assets/img/logo/Original.png';

class SystemDownView extends BaseComponent {
  
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
                <Form name='sd' onSubmit={this.login}>
                  <FormGroup>
                    <Alert color="danger">
                        <h2>System Down For Maintenance</h2>
                        <h6>Please Check Back At A Later Time</h6>
                    </Alert>
                  </FormGroup>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
          </Card>
        </Col>
      </Row>
    );
  }
}

export default SystemDownView;
