import React from "react";
import { useContext } from "react";
import { GlobalContext } from "GlobalState";
import BACKEND_ADDRESS from "../components/serverAddress";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
} from "reactstrap";

function UserProfile() {
  const [dataState, setDataState] = React.useState({});
  const {username } = useContext(GlobalContext)
  const [errorMessage, setErrorMessage] = React.useState("");
  const camelCaseWithSpaces = (text) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  React.useEffect(() => {
    const fetchData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("token", "x8F!@p01,*MH");
      myHeaders.append("user_id", username);  // Add user_id to headers



      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(`${BACKEND_ADDRESS}/users/tabish.hb`, requestOptions);
        const result = await response.json();
        setDataState(result.appRespData[0]);
        console.log(dataState.firstname);
      } catch (error) {
        setErrorMessage("Unable to load data. Please refresh the page or load after time");
        console.error(error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
              <CardTitle
                    tag="h6"
                    style={{
                      color: "rgb(82,203,206)",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      WebkitTextTransform: "capitalize", // for Safari
                    }}
                  >
                    {camelCaseWithSpaces("User Profile")}
                  </CardTitle>
              </CardHeader>
              <CardBody>
                <Form>
                  <Row>
                    <Col className="pr-1" md="6">
                      <FormGroup>
                        <label>First Name</label>
                        <Input
                          defaultValue={dataState.firstname}
                          disabled
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>

                    <Col  md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                         defaultValue={dataState.lastname}
                          placeholder="Username"
                          disabled
                          type="text"
                        />
                      </FormGroup>
                    </Col>

                  </Row>

                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Email</label>
                        <Input
                          defaultValue={dataState.email}
                          disabled
                          placeholder="Company"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Contact No</label>
                        <Input
                          defaultValue={dataState.contact_no}
                          disabled
                          placeholder="Last Name"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                
                  
                
                </Form>
              </CardBody>
            </Card>

            <Card>
            <CardHeader>
            <CardTitle
                    tag="h6"
                    style={{
                      color: "rgb(82,203,206)",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      WebkitTextTransform: "capitalize", // for Safari
                    }}
                  >
                    {camelCaseWithSpaces("Organization")}
                  </CardTitle>
              </CardHeader>
              <CardBody>
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Tilte</label>
                        <Input
                          defaultValue={dataState.organization_title}
                          disabled
                          placeholder="Home Address"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col  md="6">
                      <FormGroup>
                        <label>Address</label>
                        <Input
                          defaultValue={dataState.organization_address}
                          disabled
                          placeholder="City"
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  </CardBody>
            </Card>

            <Card>
              <CardHeader>
              <CardTitle
                    tag="h6"
                    style={{
                      color: "rgb(82,203,206)",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      WebkitTextTransform: "capitalize", // for Safari
                    }}
                  >
                    {camelCaseWithSpaces("Role")}
                  </CardTitle>
              </CardHeader>
              <CardBody>
             
                  <Row>
                    <Col md="6">
                      <FormGroup>
                        <label>Role</label>
                        <Input
                          type="text"
                          disabled
                          defaultValue={dataState.role_name}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button className="buttonClose" color="primary" onClick={() => window.history.back()} style={{ visibility: 'visible', opacity: 1 }}>
              Close
            </Button>
            </div>
      </div>
    </>
  );
}

export default UserProfile;
