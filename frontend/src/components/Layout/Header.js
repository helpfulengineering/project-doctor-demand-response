import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog, faSignOutAlt, faUser, faQuestionCircle, faEnvelopeSquare, faComments } from '@fortawesome/free-solid-svg-icons';
import { UserCard } from 'components/Card';
import React from 'react';
import { AuthenticationService } from '../../services/AuthenticationService';
import { withRouter } from "react-router-dom";

import {
  ListGroup,
  ListGroupItem,
  Nav,
  Navbar,
  NavItem,
  NavLink,
  Popover,
  PopoverBody,
  Modal,
  ModalBody,
  ModalHeader,
} from 'reactstrap';
import bn from 'utils/bemnames';

const bem = bn.create('header');

class Header extends React.Component {
  state = {
    isOpenUserCardPopover: false,
    isOpenHelpModal: false,
    isOpenMessagesModal: false,
    isOpenProfileModal: false
  };

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  toggleUserCardPopover = () => {
    this.setState({
      isOpenUserCardPopover: !this.state.isOpenUserCardPopover,
    });
  };

  toggleOpenHelpModal = () => {
    this.setState({
      isOpenHelpModal: !this.state.isOpenHelpModal,
    });
  };

  toggleOpenMessagesModal = () => {
    this.setState({
      isOpenMessagesModal: !this.state.isOpenMessagesModal,
    });
  };

  toggleOpenProfileModal = () => {
    this.setState({
      isOpenProfileModal: !this.state.isOpenProfileModal,
    });
  };

  handleSidebarControlButton = event => {
    event.preventDefault();
    event.stopPropagation();

    document.querySelector('.cr-sidebar').classList.toggle('cr-sidebar--open');
  };

  logout() {
    AuthenticationService.logout();
    this.props.history.push("/login");
  }

  render() {
    
    return (
      <Navbar light expand className={bem.b('bg-secondary')}>
        <Nav navbar className={bem.e('nav-right')}>
          
          <NavItem>
            <NavLink id="Popover2">
            <FontAwesomeIcon icon={faUserCog} className="text-light" size="lg" onClick={this.toggleUserCardPopover}/>
            </NavLink>
            <Popover
              placement="bottom-end"
              isOpen={this.state.isOpenUserCardPopover}
              toggle={this.toggleUserCardPopover}
              target="Popover2"
              className="p-0 border-0"
              style={{ minWidth: 250 }}
            >
              <PopoverBody className="p-0 border-light">
                  <ListGroup flush>
                    <ListGroupItem tag="button" action className="border-light" onClick={this.toggleOpenProfileModal}>
                      <FontAwesomeIcon icon={faUser}/> &nbsp;Profile
                    </ListGroupItem>
                    <ListGroupItem tag="button" action className="border-light" onClick={this.toggleOpenMessagesModal}>
                      <FontAwesomeIcon icon={faComments}/> &nbsp;Messages
                    </ListGroupItem>
                    <ListGroupItem tag="button" action className="border-light" onClick={this.toggleOpenHelpModal}>
                      <FontAwesomeIcon icon={faQuestionCircle}/> &nbsp;Help
                    </ListGroupItem>
                    <ListGroupItem tag="button" action className="border-light" onClick={this.logout}>
                      <FontAwesomeIcon icon={faSignOutAlt}/> &nbsp;Sign out
                    </ListGroupItem>
                  </ListGroup>
              </PopoverBody>
            </Popover>
          </NavItem>
        </Nav>


        <Modal
          isOpen={this.state.isOpenHelpModal}
          toggle={this.toggleOpenHelpModal}>
          <ModalHeader toggle={this.toggleOpenHelpModal}>
          <FontAwesomeIcon size='md' icon={faQuestionCircle}/> &nbsp;Help
          </ModalHeader>
          <ModalBody>
              <p>MHM is an application developed to enable our Healthcare Providers / medical professionals 
              to add their demands and volunteers to add their inventory. The system also allows users to message and 
              collaborate with others. This application is developed as a joint effort by a small group of engineers and volunteers 
              to support our medical professionals in difficult times.
              </p>

              <p>
                For questions, please email us at makershelpingmedics@gmail.com.
              </p>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.isOpenMessagesModal}
          toggle={this.toggleOpenMessagesModal}>
          <ModalHeader toggle={this.toggleOpenMessagesModal}>
          <FontAwesomeIcon size='md' icon={faComments}/> &nbsp;Messages
          </ModalHeader>
          <ModalBody>
              <p>Coming soon!
              </p>
          </ModalBody>
        </Modal>

        <Modal
          isOpen={this.state.isOpenProfileModal}
          toggle={this.toggleOpenProfileModal}>
          <ModalHeader toggle={this.toggleOpenProfileModal}>
          <FontAwesomeIcon size='md' icon={faUser}/> &nbsp;Profile
          </ModalHeader>
          <ModalBody>
              <p>Coming soon!
              </p>
          </ModalBody>
        </Modal>
      </Navbar>
    );
  }
}

export default withRouter(Header);
