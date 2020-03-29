import React from 'react';
import { Button, Form, FormGroup, Input, Label, Alert } from 'reactstrap';
import { BaseComponent } from '../components/BaseComponent';
import { SupplyRequestService } from '../services/SupplyRequestService';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import FormUtil from '../utils/form-util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Modal,
  ModalBody,
  Row,
  Col
} from 'reactstrap';

class SupplyRequestForm extends BaseComponent {

  constructor(props) {
    super(props);
    let supplyRequest = {
      'user_id': '',
      'supply_type': '',
      'supply_type_selection': 'Masks',
      'quantity': 10,
      'request_date': '',
      'fulfillment_date': null,
      'urgency': 'high',
      'needed_by': '',
      'status': 'open'
    };
    if(props.supplyRequest && props.supplyRequest.user_id) {
      supplyRequest = props.supplyRequest;
    }

    this.state = { ...this.state, saveSuccess: null, isNew: props.isNew, supplyRequest: supplyRequest, messages: [] };

    this.handleChange = this.handleChange.bind(this);
    this.handlesupplyRequestChange = this.handlesupplyRequestChange.bind(this);
    this.saveSupplyRequest = this.saveSupplyRequest.bind(this);
    this.toggleMessageModal = this.toggleMessageModal.bind(this);
  }

  toggleMessageModal = modalType => () => {
    if (!modalType) {
      return this.setState({
        ...this.state,
        saveModal: !this.state.saveModal,
      });
    }
  }
  handlesupplyRequestChange(event) {
    let supplyRequest = this.state.supplyRequest;
    supplyRequest[event.target.name] = event.target.value;
    this.setState({...this.state, supplyRequest: supplyRequest});
  }

  handleChange(event) {
    let state = this.state[event.target.name] = event.target.value;
    this.setState({...state});
  }

  saveSupplyRequest = event => {
    event.preventDefault();
    let supplyRequest = this.state.supplyRequest;
    FormUtil.trimFields(supplyRequest);
    supplyRequest.user_name = SupplyRequestService.getUserContext().user_name;
    this.setState({...this.state, supplyRequest: supplyRequest});
    
    if(this.state.supplyRequest.supply_type_selection !== 'Other') {
      
      supplyRequest.supply_type = this.state.supplyRequest.supply_type_selection;
      supplyRequest.supply_type_selection = undefined;
      this.setState({...this.state, supplyRequest: supplyRequest});
    }
    
    let messages = this.validate(this.state.supplyRequest);

    if(messages.length !== 0) {
      this.setState({...this.state, messages: messages});
      return;
    }

    if(this.state.isNew) {
      SupplyRequestService.createSupplyRequest(this.state.supplyRequest).subscribe(resp => {
        if(resp.status === true) {
          this.setState({...this.state, saveSuccess: true});
        } else {
          this.setState({...this.state, saveSuccess: false});
        }
      });
    } else {
      SupplyRequestService.updateSupplyRequest(this.state.supplyRequest).subscribe(resp => {
        if(resp.status === true) {
          this.setState({...this.state, saveSuccess: true});
        } else {
          this.setState({...this.state, saveSuccess: false});
        }
      });
    }
    
  }

  validate(sr) {
    let messages = [];
    if(FormUtil.isEmpty(sr.supply_type)) {
      messages.push('Supply type is required');
    }
    if(FormUtil.isEmpty(sr.quantity) || sr.quantity <= 0) {
      messages.push('Quantity is required and must be > 0');
    }
    return messages;
  }
  render() {
    
    return (
      <div>
        <Modal
          isOpen={this.state.saveModal}
          toggle={this.toggleMessageModal()}
          >
          <ModalBody>
            <Alert color={this.state.saveSuccess === true ? 'success' : 'danger'}>
              {this.state.saveSuccess === true ? 'Supply Request saved successfully' : 'Unable to save Supply Request.'}
            </Alert>
          </ModalBody>
        </Modal>

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
        <Form onSubmit={this.createSupplyRequest}>          
          <Row>
            <Col xl={6} lg={6} md={6}>
              <FormGroup>
                <Label>Supply Type</Label>
                <Input type="select" name="supply_type_selection" value={this.state.supplyRequest.supply_type_selection}  onChange={this.handlesupplyRequestChange}>
                  <option>Masks</option>
                  <option>Gloves</option>
                  <option>Face Shields</option>
                  <option>Gowns</option>
                  <option>Other</option>
                </Input>
              </FormGroup>
            </Col>
            <Col xl={6} lg={6} md={6}>
              { this.state.supplyRequest.supply_type_selection === 'Other' ? 
                <FormGroup>
                  <Label>Custom Supply Type</Label> 
                  <Input type="text" name="supply_type" value={this.state.supplyRequest.supply_type} onChange={this.handlesupplyRequestChange}/>
                  </FormGroup>
                   : '' }
            </Col>
          </Row>

          <Row>
            <Col xl={6} lg={6} md={6}>
              <FormGroup>
                <Label>Quantity</Label>
                <Input type="number" name="quantity" value={this.state.supplyRequest.quantity} onChange={this.handlesupplyRequestChange}/>
              </FormGroup>
            </Col>
            <Col xl={6} lg={6} md={6}>
              <Label>Needed By</Label>
              <Input type="date" name="needed_by" value={this.state.supplyRequest.needed_by} onChange={this.handlesupplyRequestChange}/>
            </Col>
          </Row>
          
          <FormGroup>
            <Label>Urgency</Label>
            <Input type="select" name="urgency" value={this.state.supplyRequest.urgency}  onChange={this.handlesupplyRequestChange}>
              <option>Normal</option>
              <option>High</option>
              <option>Critical</option>
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>Comments</Label>
            <Input type="textarea" name="comments" value={this.state.supplyRequest.comments} onChange={this.handlesupplyRequestChange}/>
          </FormGroup>
        </Form>
        <hr/>
          <div className="d-flex justify-content-end">
            <Button className="text-uppercase border-0" outline onClick={this.saveSupplyRequest}>
              <FontAwesomeIcon size='md' icon={faSave} className='text-bold'/>&nbsp;&nbsp;{this.state.isNew ? 'Create' : 'Save'}
            </Button>
          </div>
      </div>
      
    );
  }
}

export default SupplyRequestForm;
