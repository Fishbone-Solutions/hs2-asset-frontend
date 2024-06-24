import React from "react";

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
import { NavLink } from "react-router-dom";

function Login() {
  React.useEffect(() => {
    document.body.classList.toggle("login-page");
    return function cleanup() {
      document.body.classList.toggle("login-page");
    };
  });
  return (
    <div className="login-page">
      <Container>
        <Row>
          <Col className="ml-auto mr-auto" lg="4" md="6">
            <Form action="" className="form" method="">
              <Card className="card-login">
                <CardHeader>
                  <CardHeader>
                    <h3 className="header text-center">Login</h3>
                  </CardHeader>
                </CardHeader>
                <CardBody>
                  <InputGroup>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="nc-icon nc-single-02" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input placeholder="Username" type="text" />
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
                    />
                  </InputGroup>
                  <br />
                  <FormGroup>
               
                  </FormGroup>
                </CardBody>
                <CardFooter>
                <NavLink to="/admin/react-tables" className="nav-link">

                  <Button
                    block
                    className="btn-round mb-3"
                    color="warning"
             
                  >
Login
                  </Button>
                  </NavLink>
                </CardFooter>
              </Card>
            </Form>
          </Col>
        </Row>
      </Container>
      <div
        className="full-page-background"
        style={{
          backgroundImage: `url(${require("assets/img/bg/fabio-mangione.jpg")})`,
        }}
      />
    </div>
  );
}

export default Login;
