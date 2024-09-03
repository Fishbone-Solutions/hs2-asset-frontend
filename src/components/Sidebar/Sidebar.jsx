import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { Nav, Collapse, Button } from "reactstrap";
import PerfectScrollbar from "perfect-scrollbar";
import avatar from "assets/img/faces/ayo-ogunseinde-2.jpg";
import logo from "assets/img/faces/ex_logo.jpg";
import { GlobalContext } from "../../GlobalState";
import BACKEND_ADDRESS from "../../views/components/serverAddress.js";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { EndPointService } from "@/services/methods";

var ps;

const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    mode: params.get("mode"),
  };
};

function Sidebar(props) {
  const [openAvatar, setOpenAvatar] = React.useState(false);
  const [collapseStates, setCollapseStates] = React.useState({});
  const { username } = useContext(GlobalContext);
  const [dataState, setDataState] = React.useState({});
  const sidebar = React.useRef();
  const headers = { user_id: localStorage.getItem("username") };
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
                  {prop.icon}
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
                {prop.icon} <p className="ml-5 menu-name">{prop.name}</p>
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
    fetchData();
  }, [props.routes]);

  const fetchData = async () => {
    try {
      const res = await EndPointService.getUserInformation(
        headers,
        !!username ? username : localStorage.getItem("username")
      );

      localStorage.setItem("user", JSON.stringify(res.appRespData[0]));
      localStorage.setItem(
        "username",
        !!username ? username : localStorage.getItem("username")
      );
      setDataState(res.appRespData[0]);
      console.log("companyName", dataState, res.appRespData);
    } catch (error) {
      console.error(error);
    }
  };

  const { mode } = getQueryParams();

  return (
    <div
      className="sidebar"
      data-color={props.bgColor}
      data-active-color={props.activeColor}
    >
      <div className="logo">
        <div
          className="photo"
          style={{ display: "flex", alignItems: "center" }}
        >
          <img
            src={logo}
            alt="react-logo"
            width={35}
            height={35}
            style={{
              transform: "translate(10px, 0px)",
              backgroundColor: "white",
            }}
          />
          <a
            className="simple-text logo-normal"
            style={{
              fontSize: "1.2em",
              fontWeight: "bold",
              textDecoration: "none",
              color: "white",
              transform: "translate(20px, 0px)",
            }}
          >
            HS2 EXCHANGE
          </a>
        </div>
        <Button
          className="btn-icon btn-round mr-2"
          color="primary"
          id="minimizeSidebar"
          onClick={props.handleMiniClick}
          style={{ backgroundColor: "grey" }}
        >
          <IoIosArrowForward
            className="visible-on-sidebar-mini"
            color="grey"
            size="1.3em"
          />
          <IoIosArrowBack
            className="visible-on-sidebar-regular"
            color="grey"
            size="1.3em"
          />
        </Button>
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
              <span className="profile-view">
                <span className="user-name">{dataState?.firstname}</span>
                <br />
                {dataState && dataState.organization_title && (
                  <span className="company-name">
                    {dataState.organization_title.split(" ")[0]}
                  </span>
                )}
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
              </ul>
            </Collapse>
          </div>
        </div>
        <Nav>{createLinks(props.routes)}</Nav>
        {mode === "add" && <div>Add New Asset</div>}
        {mode === "view" && <div>View Asset</div>}
        {mode === "edit" && <div>Edit Asset</div>}
      </div>
    </div>
  );
}

export default Sidebar;
