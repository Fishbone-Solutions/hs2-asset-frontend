import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  Form,
  InputGroup,
  InputGroupText,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import login_lock_icon from "../../assets/img/login_lock_icon.png";
import Footer from "components/Footer/Footer";
import AuthNavbar from "components/Navbars/AuthNavbar";
import { useState } from "react";


function Register() {

const handleLogin = () => {

}

const handleChange = (event) => {
  const { name, value } = event.target;
  // Only allow changes if not in add mode for id field
  if (name === "id" && isAddMode) {
    return; // Prevent changes to id if in add mode
  }

  setFormData((prevState) => ({
    ...prevState,
    [name]: value,
  }));
};
const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  email: "",
  categorycode2: "",
  asset_name: "",
  description: "",
  asset_condition: "",
  quantity: "",
  asset_location: "",
  value: "",
  additional_info: "",
  available_from: "",
  seller_title: "",
  seller_contactno: "",
  email: "",
  seller_location: "",
  statuscode: "",
});
const [registerEmailState, setRegisterEmailState] = useState("");

const verifyEmail = (value) => {
  var emailRex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return emailRex.test(value);
};


  React.useEffect(() => {
    document.body.classList.toggle("register-page");
    return function cleanup() {
      document.body.classList.toggle("register-page");
    };
  });
  return (
    <div className="login-page">
    <AuthNavbar></AuthNavbar>
    <Container>
      {alert}
      <Row>
        <Col className="ml-auto mr-auto" lg="4" md="6">
          <p
            style={{
              textAlign: "right",
              color: "#52CBCE",
              marginBottom: -10,
            }}
          >
            Connecting Buyers & Sellers
          </p>
          <p
            style={{
              textAlign: "left",
              fontSize: "28.3px",
              color: "white",
              marginTop: 0,
            }}
          >
            <span style={{ color: "#52CBCE", fontWeight: "bold" }}>HS2 </span>
            <span style={{ color: "white", fontWeight: "bold" }}>
              Exchange Platform
            </span>
          </p>
          <Form action="" className="form" method="">
            <Card className="card-login">
              <CardHeader>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                  }}
                >
                  <p style={{fontWeight: "bold", fontSize:"20px"}}>                  Create Account                  </p>
                </div>
              </CardHeader>
              <CardBody>
              <CardBody>
                  <Row>
                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>First Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required

                        />
                      </FormGroup>
                    </Col>

                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>Last Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required

                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>
                        Email Address *
                      </Label>
                      <FormGroup
                        className={`has-label ${formData.email}`}
                      >
                        <Input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!verifyEmail(value)) {
                              setRegisterEmailState("has-danger");
                            } else {
                              setRegisterEmailState("has-success");
                            }
                            setFormData((prevState) => ({
                              ...prevState,
                              email: value,
                            }));
                          }}
                          required

                        />
                        {registerEmailState === "has-danger" ? (
                          <label className="error">
                            Please enter a valid email address.
                          </label>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>Preferred User ID</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="preferred_user_id"
                          value={formData.preferred_user_id}
                          onChange={handleChange}
                          required

                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>Password</Label>
                      <FormGroup>
                        <Input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required

                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>Retype Password</Label>
                      <FormGroup>
                        <Input
                          type="password"
                          name="re_password"
                          onChange={handleChange}
                          required

                        />
                      </FormGroup>
                    </Col>

                  </Row>
              
                </CardBody>
              </CardBody>
              <CardFooter>
                <Button
                  block
                  className="btn-round mb-3"
                  color="primary"
                  type="submit"
                  onClick={handleLogin}
                  style={{ backgroundColor: "rgb(82,203,206)" }}
                >
                 Sign Up
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

export default Register;
