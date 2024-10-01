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



function Login() {
  const { username, setUsername } = useContext(GlobalContext);
  const usernames = [];
  const [password, setPassword] = useState("");
  const [error, setErrorMessage] = useState("");
  // const [alert, setAlert] = useState("");
  const navigate = useNavigate();
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();  // Prevent the form submission
      // Handle Enter key press event here
      handleLogin();
    }
  };
  const handleLogin = () => {
    if (password === "admin") {
      navigate("/admin/inventory");
    } else {
      showAlert({
        title: <h6 className="success-sweet-title">"Unable to grant access."</h6> ,
        content: "Invalid Username or Password. Please try again",
        type: "error",
        confirmText: 'ok',
        showCancelButton: false,
        onConfirm: hideAlert,
      });
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
      <AuthNavbar></AuthNavbar>
      <Container>
        {alert}
        <Row>
          <Col className="ml-auto mr-auto width-login" lg="4" md="4">
            <p
              style={{
                textAlign: "right",
                color: "#52CBCE",
                marginBottom: -10,
              }}
            >
             Supporting Reusability
            </p>
            <p
              style={{
                textAlign: "left",
                fontSize: "29px",
                color: "white",
                marginTop: 0,
              }}
            >
              <span style={{ color: "#52CBCE", fontWeight: "bold" }}>HS2 </span>
              <span style={{ color: "white", fontWeight: "bold" }}>
                Exchange Platform
              </span>
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
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroupText>
                      <CiLock size="1.2em" />
                    </InputGroupText>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress} // Add this line
                    />
                  </InputGroup>
                  {error && (
                    <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
                  )}
                  <br />
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
                  <Button block className="btn-round mb-3" color="primary">
                    Sign in with O365
                  </Button>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
      <Footer></Footer>
      <div
        className="full-page-background"
     
      />
    </div>
  );
}

export default Login;
