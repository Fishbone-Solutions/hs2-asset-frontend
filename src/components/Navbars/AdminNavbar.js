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
  const mode = query.get("mode");
  const id = query.get("id");

  const currentRoute = routes.find((route) =>
    location.pathname.includes(route.pathName),
  );

  const { name, icon } = currentRoute || {};

  console.log("location", location.pathname);
  console.log("mode", mode);

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

  const pathKeyToTitleMap = [
    { pattern: /^\/admin\/inventory$/, title: "Inventory" },
    {
      pattern: /^\/admin\/assetregister\/\d+\?mode=view$/,
      title: "Inventory | View Item",
    },
    {
      pattern: /^\/admin\/assetregister\/\d+\?mode=edit$/,
      title: "Inventory | Edit Item",
    },
    {
      pattern: /^\/admin\/assetregister+\?mode=add$/,
      title: "Inventory | Add Item",
    },
    { pattern: /^\/admin\/eoi\/\d+$/, title: "Inventory | All EOI" },
    {
      pattern: /^\/admin\/eoi\/details\/\d+\?mode=view&eoino=\d+$/,
      title: "Inventory | All EOI | View",
    },
    {
      pattern: /^\/admin\/eoi\/details\/\d+\?mode=edit&eoino=\d+$/,
      title: "Inventory | All EOI | Edit",
    },
    { pattern: /^\/admin\/exchange\/register$/, title: "Exchange Register" },
    {
      pattern: /^\/admin\/assetregister\/105\?mode=exchange$/,
      title: "Exchange Register | View Item",
    },
    {
      pattern: /^\/admin\/exchange\/eoisubmission\/105\?mode=edit$/,
      title: "Exchange Register | Submit EOI",
    },
    {
      pattern: /^\/admin\/exchange\/requestequipment$/,
      title: "Exchange Register | Broadcast Item Request",
    },
  ];

  const renderTitle = () => {
    const pathKey = location.pathname + location.search;

    for (const entry of pathKeyToTitleMap) {
      if (entry.pattern.test(pathKey)) {
        return entry.title;
      }
    }

    return ""; // Provide a default title if no pattern matches
  };

  return (
    <>
      <Navbar
        className={classnames("navbar-absolute fixed-top", "#52CBCE")}
        expand="lg"
        style={{ backgroundColor: "#52CBCE" }}
      >
        <Container className="custom-fuild" fluid>
          <div className="navbar-wrapper">
            <div className="navbar-minimize">
              <Button
                className="btn-icon btn-round"
                color="primary"
                id="minimizeSidebar"
                onClick={props.handleMiniClick}
                style={{ backgroundColor: "grey" }}
              >
                <i
                  className="nc-icon nc-minimal-right text-center visible-on-sidebar-mini"
                  style={{ color: "#fff" }}
                />
                <i
                  className="nc-icon nc-minimal-left text-center visible-on-sidebar-regular"
                  style={{ color: "#fff" }}
                />
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
              <span className="d-none d-md-block" style={{ color: "white" }}>
                {icon && <i className={icon}></i>}
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: "8px",
                  }}
                >
                  {renderTitle()}
                </span>
              </span>
              <span className="d-block d-md-none">
                {icon && <i className={icon}></i>}
                <span
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    marginLeft: "8px",
                  }}
                >
                  {renderTitle()}
                </span>
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
            <Form></Form>
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
