import React from "react";
import classnames from "classnames";
import { useLocation } from "react-router-dom";
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Form,
  NavbarBrand,
  Navbar,
  Nav,
  Container,
} from "reactstrap";
import routes from "routes";

function AdminNavbar(props) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [color, setColor] = React.useState("#52CBCE");
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get('mode');
  const id = query.get('id');

  const currentRoute = routes.find((route) => location.pathname.includes(route.pathName));

  const { name, icon } = currentRoute || {};
  
  React.useEffect(() => {
    window.addEventListener("resize", updateColor);
  });

  React.useEffect(() => {
    if (
      window.outerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
    }
  }, [location]);

  const updateColor = () => {
    if (window.innerWidth < 993 && collapseOpen) {
      setColor("bg-primary");
    } else {
      setColor("bg-primary");
    }
  };

  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    if (!collapseOpen) {
      setColor("bg-white");
    } else {
      setColor("bg-primary");
    }
    setCollapseOpen(!collapseOpen);
  };

  const renderTitle = () => {
    if (mode === 'view') {
      return `Inventory | View Item `;
    } else if (mode === 'edit') {
      return `Inventory | Edit Item `;
    } else {
      return name;
    }
  };

  return (
    <>
      <Navbar
        className={classnames("navbar-absolute fixed-top", '#52CBCE')}
        expand="lg"
        style={{backgroundColor:"#52CBCE"}}
      >
        <Container fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize">
              <Button
                className="btn-icon btn-round"
                color="primary"
                id="minimizeSidebar"
                onClick={props.handleMiniClick}
                style={{ backgroundColor: 'grey'}}
              >
                <i className="nc-icon nc-minimal-right text-center visible-on-sidebar-mini" />
                <i className="nc-icon nc-minimal-left text-center visible-on-sidebar-regular" style={{ color: 'white'}} />
              </Button>
            </div>
            <div
              className={classnames("navbar-toggle", {
                toggled: sidebarOpen,
              })}
            >
              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleSidebar}
              >
                <span className="navbar-toggler-bar bar1" />
                <span className="navbar-toggler-bar bar2" />
                <span className="navbar-toggler-bar bar3" />
              </button>
            </div>
            <NavbarBrand href="#pablo" onClick={(e) => e.preventDefault()}>
              <span className="d-none d-md-block" style={{ color: 'white' }}>
                {icon && <i className={icon}></i>}
                <span style={{ color: 'white', fontWeight: 'bold' }}>{renderTitle()}</span>
              </span>
              <span className="d-block d-md-none">
                {icon && <i className={icon}></i>}
                <span style={{ color: 'white', fontWeight: 'bold' }}>{renderTitle()}</span>
              </span>
            </NavbarBrand>
          </div>
          <button
            aria-controls="navigation-index"
            aria-expanded={collapseOpen}
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
          <Collapse
            className="justify-content-end"
            navbar
            isOpen={collapseOpen}
          >
            <Form>
            </Form>
            <Nav navbar>
              <UncontrolledDropdown className="btn-rotate" nav>
                <DropdownToggle
                  aria-haspopup={true}
                  caret
                  color="grey"
                  data-toggle="dropdown"
                  id="navbarDropdownMenuLink"
                  nav
                >
                  <i className="nc-icon nc-bell-55" />
                  <p>
                    <span className="d-lg-none d-md-block">Logout</span>
                  </p>
                </DropdownToggle>
                <DropdownMenu
                  persist
                  aria-labelledby="navbarDropdownMenuLink"
                  right
                >
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => e.preventDefault()}
                  >
                    Another action
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
