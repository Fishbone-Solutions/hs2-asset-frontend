import React, { useState, useContext } from "react";

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

function Login() {
  const { username, setUsername } = useContext(GlobalContext);
  const [loader, setLoader] = useState(false);
  const usernames = [];
  const [password, setPassword] = useState("");
  const [error, setErrorMessage] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [passwordEyeBool, setPasswordEyeBool] = useState(false);
  // const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the form submission
      // Handle Enter key press event here
      handleLogin();
    }
  };
  const handleLogin = async () => {
    setLoader(true);
    try {
      const params = {
        username: username,
        password: password,
      };
      const res = await EndPointService.Login(params);
      if (res.appRespData.length > 0) {
        sessionStorage.setItem("user", JSON.stringify(res.appRespData[0]));
        sessionStorage.setItem(
          "username",
          !!username ? username : sessionStorage.getItem("username")
        );
        setLoader(false);
        navigate("/admin/inventory");
      } else {
        showAlert({
          title: (
            <div className="alert-content-padding">
              <h6 className="sweet-title-size bg-danger-content">
                Unable to grant access
              </h6>
            </div>
          ),
          content: (
            <div className="alert-content-padding">
              <h6 className="sweet-title-size font-weight-bold ">
                Invalid Username or Password
              </h6>
            </div>
          ),
          type: "error",
          confirmText: "ok",
          showCancelButton: false,
          onConfirm: hideAlert,
        });
        setLoader(false);
        // setAlert(
        //   <ReactBSAlert
        //     danger
        //     style={{ display: "block", marginTop: "-100px" }}
        //     title="Wrong Username or Password"
        //     onConfirm={() => hideAlert()}
        //     onCancel={() => hideAlert()}
        //     confirmBtnBsStyle="info"
        //     btnSize=""
        //   />,
        // );
      }
    } catch (e) {
      showAlert({
        title: <h6 className="sweet-title-size">Unable to grant access</h6>,
        content: "something went wrong",
        type: "error",
        confirmText: "ok",
        showCancelButton: false,
        onConfirm: hideAlert,
      });
      setLoader(false);
    }
  };

  const handlePasswordShow = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setPasswordEyeBool(true);
    } else {
      setPasswordType("password");
      setPasswordEyeBool(false);
    }
  };

  const handleRegister = () => {
    showAlert({
      title: (
        <div className="alert-content-padding">
          <h6 className="sweet-title-size sweet-title-padding text-start">
            This feature is not available in BETA Version
          </h6>
        </div>
      ),
      content: "",
      type: "warning",
      confirmText: "ok",
      showCancelButton: false,
      onConfirm: hideAlert,
    });
  };
  // const hideAlert = () => {
  //   setAlert(null);
  // };

  React.useEffect(() => {
    document.body.classList.toggle("login-page");
    return function cleanup() {
      document.body.classList.toggle("login-page");
    };
  }, []);

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
                  <InputGroup>
                    <InputGroupText>
                      <IoPersonOutline size="1.2em" />
                    </InputGroupText>
                    <Input
                      placeholder="Username"
                      type="text"
                      value={username}
                      onInput={handleInput("alphaNumericLogin")}
                      maxLength={20}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroupText>
                      <CiLock size="1.2em" />
                    </InputGroupText>
                    <Input
                      placeholder="Password"
                      type={passwordType}
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress} // Add this line
                    />
                  </InputGroup>
                  <div
                    className="position-absolute password-eye-icon"
                    onClick={handlePasswordShow}
                  >
                    {passwordEyeBool ? <FaEyeSlash /> : <FaEye />}
                  </div>
                  {error && (
                    <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                  )}

                  <FormGroup>{/* ... (form group content) */}</FormGroup>
                </CardBody>
                <CardFooter>
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
                </CardFooter>
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

export default Login;
