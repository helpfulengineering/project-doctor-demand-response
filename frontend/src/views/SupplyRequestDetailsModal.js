import React from 'react';
import { Button } from 'reactstrap';
import { BaseComponent } from '../components/BaseComponent';
import { SupplyRequestService } from '../services/SupplyRequestService';
import { faTrashAlt, faStethoscope, faTimes, faPenAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col
} from 'reactstrap';

class SupplyRequestDetailsModal extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = { ...this.state, saveSuccess: null, 
      supplyRequest: {...this.props.supplyRequest, user: {} },
      openModal: this.props.openModal  
    };

    this.deleteSupplyRequest = this.deleteSupplyRequest.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.openModalEvent.subscribe((sr) => {
      this.setState({
        ...this.state,
        openModal: true,
        supplyRequest: sr
      });
    });
  }

  toggle = modalType => () =>{
    if (!modalType) {
      return this.setState({
        ...this.state,
        openModal: !this.state.openModal,
      });
    }
  }

  deleteSupplyRequest = event => {
    event.preventDefault();

    SupplyRequestService.deleteSupplyRequest({"_id": this.state.supplyRequest._id}).subscribe(resp => {
      // emit event to reload table
      this.props.dataChanged.next();
      this.setState({
        ...this.state,
        openModal: false
      });
    });
  }

  render() {
    
    return (
      <Modal size="lg"
        isOpen={this.state.openModal}
        toggle={this.toggle()}
        className={this.props.className}>
        <ModalHeader toggle={this.toggle()}>
          <FontAwesomeIcon icon={faStethoscope}/>
          <span className="pl-2">{
            this.state.supplyRequest.user.org_name ? 
            this.state.supplyRequest.user.org_name : 
            this.state.supplyRequest.user.first_name + ' ' + this.state.supplyRequest.user.last_name}</span>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={6} lg={6} md={6}>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Supply Type</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.supplyRequest.supply_type}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Quantity</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.supplyRequest.quantity}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Urgency</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.supplyRequest.urgency}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Needed By</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.supplyRequest.needed_by}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>City</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.supplyRequest.user.city}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>State</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.supplyRequest.user.state}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Zip Code</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.supplyRequest.user.zipcode}</Col>
              </Row>
            </Col>

            <Col xl={6} lg={6} md={6} className="bg-light p-2">
              {this.state.supplyRequest.comments}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <Button color="danger" onClick={this.deleteSupplyRequest}>
            <FontAwesomeIcon icon={faTrashAlt}/><span className="pl-2">Delete</span>
          </Button>
          <span>
            <Button color="primary" onClick={this.deleteSupplyRequest} className="mr-2">
              <FontAwesomeIcon icon={faPenAlt}/><span className="pl-2">Edit</span>
            </Button>
            <Button color="light" onClick={this.toggle()}>
              <FontAwesomeIcon icon={faTimes} /><span className="pl-2">Cancel</span>
            </Button>
          </span>
        </ModalFooter>
      </Modal>
    );
  }
}

export default SupplyRequestDetailsModal;
