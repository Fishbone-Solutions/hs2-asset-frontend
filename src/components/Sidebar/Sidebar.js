import React from "react";
import { Link } from "react-router-dom";
import { Nav, Collapse } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";
import avatar from "assets/img/faces/ayo-ogunseinde-2.jpg";
import logo from "assets/img/faces/ex_logo.jpg";

var ps;

const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    mode: params.get('mode'),
  };
};

function Sidebar(props) {
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const [collapseStates, setCollapseStates] = React.useState({});
  const sidebar = React.useRef();

  // Initialize collapse states based on routes
  const getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: getCollapseInitialState(prop.views),
          ...getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };

  // Check if any collapses should be default opened
  const getCollapseInitialState = (routes) => {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (window.location.pathname.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  };

  // Create sidebar links
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.hidden) {
        return null; // Skip hidden routes
      }
      if (prop.redirect) {
        return null;
      }
      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !collapseStates[prop.state];
        return (
          <li
            className={getCollapseInitialState(prop.views) ? "active" : ""}
            key={key}
          >
            <a
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={collapseStates[prop.state]}
              onClick={(e) => {
                e.preventDefault();
                setCollapseStates(st);
              }}
            >
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <p>
                    {prop.name}
                    <b className="caret" />
                  </p>
                </>
              ) : (
                <>
                  <span className="sidebar-mini-icon">{prop.mini}</span>
                  <span className="sidebar-normal">
                    {prop.name}
                    <b className="caret" />
                  </span>
                </>
              )}
            </a>
            <Collapse isOpen={collapseStates[prop.state]}>
              <ul className="nav">{createLinks(prop.views)}</ul>
            </Collapse>
          </li>
        );
      }
      return (
        <li className={activeRoute(prop.layout + prop.path)} key={key}>
          <Link to={prop.layout + prop.path}>
            {prop.icon !== undefined ? (
              <>
                <i className={prop.icon} />
                <p>{prop.name}</p>
              </>
            ) : (
              <>
                <span className="sidebar-mini-icon">{prop.mini}</span>
                <span className="sidebar-normal">{prop.name}</span>
              </>
            )}
          </Link>
        </li>
      );
    });
  };

  // Check if the route is active
  const activeRoute = (routeName) => {
    return window.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };

  React.useEffect(() => {
    // Add perfect scrollbar if using Windows
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(sidebar.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
    }
    return function cleanup() {
      // Destroy the scrollbar when component is unmounted
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
    };
  });

  React.useEffect(() => {
    setCollapseStates(getCollapseStates(props.routes));
  }, [props.routes]);

  const { mode } = getQueryParams();

  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <div className="photo" style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={logo}
            alt="react-logo"
            width={35}
            height={35}
            style={{ transform: 'translate(10px, 0px)', backgroundColor:"white" }}
          />
          <a className="simple-text logo-normal" style={{ fontSize: '1.2em', fontWeight:"bold", textDecoration: 'none', color: 'white', transform: 'translate(20px, 0px)' }}>
            HS2 EXCHANGE
          </a>
        </div>
      </div>

      <div className="sidebar-wrapper" ref={sidebar}>
        <div className="user">
          <div className="photo">
            <img src={avatar} alt="Avatar" />
          </div>
          <div className="info">
            <a
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={openAvatar}
              onClick={() => setOpenAvatar(!openAvatar)}
            >
              <span>
                admin
                <b className="caret" />
              </span>
            </a>
            <Collapse isOpen={openAvatar}>
              <ul className="nav">
                <li>
                  <Link to="/admin/user-profile">
                    <span className="sidebar-mini-icon">MP</span>
                    <span className="sidebar-normal">My Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/user-profile">
                    <span className="sidebar-mini-icon">EP</span>
                    <span className="sidebar-normal">Edit Profile</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin/user-profile">
                    <span className="sidebar-mini-icon">S</span>
                    <span className="sidebar-normal">Settings</span>
                  </Link>
                </li>
              </ul>
            </Collapse>
          </div>
        </div>
        <Nav>{createLinks(props.routes)}</Nav>
        {mode === 'add' && <div>Add New Asset</div>}
        {mode === 'view' && <div>View Asset</div>}
        {mode === 'edit' && <div>Edit Asset</div>}
      </div>
    </div>
  );
}

export default Sidebar;
