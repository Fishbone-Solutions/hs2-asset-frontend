import React, { useState } from "react";

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
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Container,
  Col,
  Row,
} from "reactstrap";
import { useNavigate, NavLink } from "react-router-dom";
import login_lock_icon from "../../assets/img/login_lock_icon.png"
import Footer from "components/Footer/Footer";
import AuthNavbar from "components/Navbars/AuthNavbar";
import ReactBSAlert from "react-bootstrap-sweetalert";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setErrorMessage] = useState('');
  const [alert,setAlert] =useState("");
  const navigate = useNavigate();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Handle Enter key press event here
      handleLogin();
    }
  }
  const handleLogin = () => {
    if (username === 'fish.admin' && password === 'admin') {
      navigate('/admin/inventory');

    } else {
      setAlert(
        <ReactBSAlert
         danger
          style={{ display: "block", marginTop: "-100px" }}
          title="Wrong Username or Password"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        />)
    }
  }
  const hideAlert = () => {
    setAlert(null);
  };

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

          <Col className="ml-auto mr-auto" lg="4" md="6">
            <p style={{ textAlign: 'right', color: '#52CBCE', marginBottom: -10 }}>Connecting Buyers & Sellers</p>
            <p style={{ textAlign: 'left', fontSize: '28.3px', color: 'white', marginTop: 0 }}>
              <span style={{ color: '#52CBCE', fontWeight: 'bold' }}>HS2 </span> 
              <span style={{ color: 'white', fontWeight: 'bold' }}>Exchange Platform</span>
            </p>
            <Form action="" className="form" method="">
              <Card className="card-login">
                <CardHeader>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <img width={90} height={90} src={login_lock_icon} alt="Login Icon"/>
                  </div>
                </CardHeader>
                <CardBody>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input 
                      placeholder="Username" 
                      type="text" 
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </InputGroup>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-key-25" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      placeholder="Password"
                      type="password"
                      autoComplete="off"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </InputGroup>
                  {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
                  <br />
                  <FormGroup>
                    {/* ... (form group content) */}
                  </FormGroup>
                </CardBody>
                <CardFooter>
                  <Button
                    block
                    className="btn-round mb-3"
                    color="primary"
                    onClick={handleLogin}
                    style={{backgroundColor:"rgb(82,203,206)"}}
                  >
                    Login
                  </Button>
                  <Button
                    block
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
      <div
        className="full-page-background"
        style={{
          backgroundImage: `url(${require("assets/img/bg/bg.png")})`,
        }}
      />
    </div>
  );
}

export default Login;
