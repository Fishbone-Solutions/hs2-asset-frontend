import React from "react";
import classnames from "classnames";
import { NavLink } from "react-router-dom";
import { PiBookBookmarkFill } from "react-icons/pi";
import { PiHandTapFill } from "react-icons/pi";



// reactstrap components
import {
  Collapse,
  NavbarBrand,
  Navbar,
  NavItem,
  Nav,
  Container,
} from "reactstrap";

function AuthNavbar(props) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [color, setColor] = React.useState("navbar-transparent");
  // this function opens and closes the collapse on small devices
  // it also adds navbar-transparent class to the navbar when closed
  // ad bg-white when opened
  const toggleCollapse = () => {
    if (!collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("navbar-transparent");
    }
    setCollapseOpen(!collapseOpen);
  };
  return (
    <Navbar
      className={classnames("navbar-absolute fixed-top", color)}
      expand="lg"
    >
      <Container>
        <div className="navbar-wrapper">
          <NavbarBrand
            href="#pablo"
            onClick={(e) => e.preventDefault()}
          ></NavbarBrand>
        </div>
        <button
          aria-controls="navigation-index"
          aria-expanded={false}
          aria-label="Toggle navigation"
          className="navbar-toggler"
          data-toggle="collapse"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
          <span className="navbar-toggler-bar navbar-kebab" />
        </button>
        <Collapse isOpen={collapseOpen} className="justify-content-end" navbar>
          <Nav navbar>
            <NavItem>
              <NavLink to="/" className="nav-link">
                <PiBookBookmarkFill size="2em" />
                Register
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/" className="nav-link">
                <PiHandTapFill size="2em" />
                Login
              </NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Container>
    </Navbar>
  );
}

export default AuthNavbar;
