import React from "react";
import classnames from "classnames";
import { useLocation, useParams } from "react-router-dom";
import {
  Button,
  Collapse,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Form,
  Navbar,
  Nav,
  Container,
} from "reactstrap";
import routes from "../../routes.jsx";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const extractParams = (route, pathname) => {
  const pathPattern = route.pathName.replace(/:\w+/g, "([^/]+)");
  const regex = new RegExp(`^${pathPattern}$`);
  const match = pathname.match(regex);

  if (match) {
    const keys = (route.pathName.match(/:\w+/g) || []).map((key) =>
      key.substring(1)
    );
    return keys.reduce((params, key, index) => {
      params[key] = match[index + 1];
      return params;
    }, {});
  }

  return {};
};

function AdminNavbar(props) {
  const [collapseOpen, setCollapseOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const matchPathWithParams = (route, pathname) => {
    const routeRegex = new RegExp(
      "^" + route.pathName.replace(/:\w+/g, "[^/]+") + "$"
    );
    return routeRegex.test(pathname);
  };

  const logout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("username");
    navigate("/auth/login");
  };

  const currentRoute = routes.find((route) =>
    matchPathWithParams(route, location.pathname)
  );

  const dynamicParams = currentRoute
    ? extractParams(currentRoute, location.pathname)
    : {};

  const breadcrumbIcon = currentRoute?.breadcrumbIcon;
  const breadcrumbComponent =
    typeof currentRoute?.breadcrumbComponent === "function"
      ? currentRoute.breadcrumbComponent({ match: { dynamicParams } })
      : currentRoute?.breadcrumbComponent;

  const toggleSidebar = () => {
    document.documentElement.classList.toggle("nav-open");
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCollapse = () => {
    setCollapseOpen(!collapseOpen);
  };

  return (
    <>
      <Navbar
        className={classnames("navbar-absolute fixed-top", "bg-primary")}
        expand="lg"
      >
        <Container fluid>
          <div className="navbar-wrapper d-flex align-items-center">
            {breadcrumbIcon && (
              <span className="breadcrumb-icon mr-2">{breadcrumbIcon}</span>
            )}
            <span
              className="breadcrumb-text"
              style={{ fontWeight: "bold", color: "white" }}
            >
              {breadcrumbComponent}
            </span>
            <div
              className={classnames("navbar-toggle ml-auto", {
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
                  <IoLogOutOutline color="white" size="2em" />
                  <p>
                    <span className="d-lg-none d-md-block">Logout</span>
                  </p>
                </DropdownToggle>
                <DropdownMenu
                  persist
                  aria-labelledby="navbarDropdownMenuLink"
                  right
                >
                  <DropdownItem href="#" onClick={(e) => logout()}>
                    Logout
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
