import React from 'react';
import { Button } from 'reactstrap';
import { BaseComponent } from '../components/BaseComponent';
import { InventoryService } from '../services/InventoryService';
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

class InventoryDetailsModal extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = { ...this.state, saveSuccess: null, 
      inventory: {...this.props.inventory, user: {} },
      openModal: this.props.openModal  
    };

    this.deleteInventory = this.deleteInventory.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.openModalEvent.subscribe( (inv) => {
      this.setState({
        ...this.state,
        openModal: true,
        inventory: inv
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

  deleteInventory = event => {
    event.preventDefault();

    InventoryService.deleteInventory({"_id": this.state.inventory._id}).subscribe(resp => {
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
          <FontAwesomeIcon size='md' icon={faStethoscope}/>
          <span className="pl-2">{
            this.state.inventory.user.org_name ? 
            this.state.inventory.user.org_name : 
            this.state.inventory.user.first_name + ' ' + this.state.inventory.user.last_name}</span>
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col xl={6} lg={6} md={6}>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Supply Type</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.inventory.supply_type}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Quantity</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.inventory.quantity}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Status</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.inventory.status}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>City</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.inventory.user.city}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>State</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.inventory.user.state}</Col>
              </Row>
              <Row className="pb-4">
                <Col xl={6} lg={6} md={6}><strong>Zip Code</strong></Col>
                <Col xl={6} lg={6} md={6}>{this.state.inventory.user.zipcode}</Col>
              </Row>
            </Col>

            <Col xl={6} lg={6} md={6} className="bg-light p-2">
              {this.state.inventory.comments}
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter className="d-flex justify-content-between">
          <Button color="danger" onClick={this.deleteInventory}>
            <FontAwesomeIcon size="md" icon={faTrashAlt}/><span className="pl-2">Delete</span>
          </Button>
          <span>
            <Button color="primary" onClick={this.deleteInventory} className="mr-2">
              <FontAwesomeIcon size="md" icon={faPenAlt}/><span className="pl-2">Edit</span>
            </Button>
            <Button color="light" onClick={this.toggle()}>
              <FontAwesomeIcon size="md" icon={faTimes} /><span className="pl-2">Cancel</span>
            </Button>
          </span>
        </ModalFooter>
      </Modal>
    );
  }
}

export default InventoryDetailsModal;
