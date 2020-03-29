import React from 'react';
import { faStethoscope, faChartPie, faIndustry, faUserShield, faExchangeAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logoHomeImage from '../../assets/img/logo/Original on Transparent.png';

import { NavLink } from 'react-router-dom';
import {
  Nav,
  NavItem,
  NavLink as BSNavLink,
  Card,
  CardBody,
  CardImg
} from 'reactstrap';
import bn from 'utils/bemnames';

const navItems = [
  { to: '/', name: 'dashboard', exact: true, Icon: faChartPie },
  { to: '/request-inventory', name: 'requests and inventory', exact: false, Icon: faExchangeAlt },
  { to: '/hcps', name: 'healthcare providers', exact: false, Icon: faStethoscope },
  { to: '/volunteers', name: 'volunteers', exact: false, Icon: faIndustry },
  { to: '/admin', name: 'admin', exact: false, Icon: faUserShield }
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
  };

  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    return (
      <aside className={bem.b()}>
        <div className={bem.e('content')}>
          <Card
              inverse
              className={`border-0 bg-primary text-light`}
            >
              <CardBody className="d-flex pt-2 flex-column justify-content-center align-items-center">
              <CardImg
                src={logoHomeImage}
              />
              </CardBody>
            </Card>
          <Nav vertical>
            {navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="active"
                  exact={exact}
                >
                  <FontAwesomeIcon icon={Icon} />
                  &nbsp;&nbsp; <span>{name}</span>
                </BSNavLink>
              </NavItem>
            ))}
          </Nav>
        </div>
      </aside>
    );
  }
}

export default Sidebar;
