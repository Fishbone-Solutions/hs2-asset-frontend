import React, { useState, useContext, useEffect } from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  FormGroup,
  Form,
  Input,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row,
} from "reactstrap";
import { useNavigate, NavLink } from "react-router-dom";
import login_lock_icon from "assets/img/login_lock_icon.png";
import Footer from "components/Footer/Footer";
import AuthNavbar from "components/Navbars/AuthNavbar";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { GlobalContext } from "@/GlobalState";
import { IoPersonOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { useAlert } from "components/Common/NotificationAlert";
import { EndPointService } from "@/services/methods";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { handleInput } from "variables/common";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Loader } from "components/Common/ComponentLoader";

function Sso() {
  const { username, setUsername } = useContext(GlobalContext);
  const [loader, setLoader] = useState(false);
  const usernames = [];
  const [password, setPassword] = useState("");
  const [error, setErrorMessage] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [passwordEyeBool, setPasswordEyeBool] = useState(false);
  const queryParams = new URLSearchParams(location.search);
  // const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here

  const handleSSOLogin = async () => {
    try {
      const params = { code: queryParams.get('code') };
      console.log(params, queryParams);
      const response =
        await EndPointService.generatedSsoSessionOnBehaveCode(params);
      console.log(response);

      if (response.appRespData.token !== '' && response.appRespData.token != null) {
        sessionStorage.setItem('user', JSON.stringify(response.appRespData.user));
        sessionStorage.setItem('username', response.appRespData.username);
        sessionStorage.setItem('token', response.appRespData.token);
        navigate('/admin/inventory');
      } else {
        showAlert({
          title: 'Unable to grant access',
          content: (
            <div className="alert-content">Invalid Username or Password</div>
          ),
          type: 'error',
          confirmText: 'OK',
          onConfirm: hideAlert,
        });
      }
      if (response?.data?.redirectUrl) {
        window.location.href = response.data.redirectUrl; // Redirect the user
      } else {
        console.error('Redirect URL not found in response');
      }
    } catch (error) {
        showAlert({
            title: 'Unable to grant access',
            content: (
              <div className="alert-content">{error.error_description}</div>
            ),
            type: 'error',
            confirmText: 'OK',
            onConfirm: navigate('/auth/login'),
          });
      console.error('SSO Login failed:', error);
    }
  };
  // const hideAlert = () => {
  //   setAlert(null);
  // };

  useEffect(() => {
    handleSSOLogin();
  }, []);

//   React.useEffect(() => {
//     document.body.classList.toggle("login-page");
//     return function cleanup() {
//       document.body.classList.toggle("login-page");
//     };
//   }, []);

  return (
    <div className="login-page">
      {alert}
      {loader ? <FullPageLoader /> : ""}
      <AuthNavbar></AuthNavbar>
      <Container>
        <Row>
          <Col className="ml-auto mr-auto width-login" lg="4" md="6" sm="12">
            <p className="supporting-text">Supporting Reusability</p>
            <p className="platform-title">
              <span>HS2 </span>
              <span>Exchange Platform</span>
              <span className="version">BETA Version</span>
            </p>
            <Form onSubmit={(e) => e.preventDefault()}>
              <Card className="card-login">
                <CardHeader>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      width={90}
                      height={90}
                      src={login_lock_icon}
                      alt="Login Icon"
                    />
                  </div>
                </CardHeader>
                <CardBody>
                <h5 className="mt-3 text-white text-center" data-testid="cypress-title">
                  Welcome SSO Authentication for Session Generation
                </h5>
                <h4 className="text-bold text-black">
                  {' '}
                  <Loader />{' '}
                </h4>
                </CardBody>
                {/* <CardFooter>
                  <Button
                    block
                    className="btn-round mb-3"
                    color="primary"
                    type="button"
                    onClick={handleLogin}
                    style={{ backgroundColor: "rgb(82,203,206)" }}
                  >
                    Login
                  </Button>
                  <Button
                    block
                    onClick={handleRegister}
                    className="btn-round mb-3"
                    color="primary"
                  >
                    Sign in with O365
                  </Button>
                </CardFooter> */}
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
      <div className="full-page-background" />
    </div>
  );
}

export default Sso;
