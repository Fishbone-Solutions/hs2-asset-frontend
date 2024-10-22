import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { GlobalContext } from "../../GlobalState";
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
import { EndPointService } from "@/services/methods";
import DynamicToast from "components/Common/Toast";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { useAlert } from "components/Common/NotificationAlert";

function UserProfile() {
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const { username } = useContext(GlobalContext);
  const [dataState, setDataState] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const [dataUpdate, setDataUpdate] = useState({
    first_name: "",
    last_name: "",
    email: "",
    contact_no: "",
  });
  const camelCaseWithSpaces = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const headers = { user_id: sessionStorage.getItem("username") };

  const fetchData = async () => {
    setLoader(true);
    try {
      const res = await EndPointService.getUserInformation(
        headers,
        sessionStorage.getItem("username")
      );
      const resData = res.appRespData[0];
      setDataState(resData);
      setDataUpdate((previousState) => ({
        ...previousState,
        first_name: resData.firstname,
        last_name: resData.lastname,
        email: resData.email,
        contact_no: resData.contact_no,
      }));
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleUpdateProfile = () => {
    setLoader(true);
    try {
      const res = EndPointService.updateProfile(
        headers,
        sessionStorage.getItem("username"),
        dataUpdate
      );
      setLoader(false);
      showAlert({
        title: "Updated Profile",
        type: "success",
        onConfirm: () => {
          hideAlert();
        },
        showCancelButton: false,
        onCancel: hideAlert,
      });
    } catch (e) {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="content">
        {toastType && <DynamicToast type={toastType} message={toastMessage} />}
        {loader && <FullPageLoader />}
        {alert}
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
                          placeholder="first name"
                          onInput={(e) => {
                            setDataUpdate((previousState) => ({
                              ...previousState,
                              first_name: e.target.value,
                            }));
                          }}
                          type="text"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="6">
                      <FormGroup>
                        <label>Last Name</label>
                        <Input
                          defaultValue={dataState.lastname}
                          placeholder="last name"
                          onInput={(e) => {
                            setDataUpdate((previousState) => ({
                              ...previousState,
                              last_name: e.target.value,
                            }));
                          }}
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
                          placeholder="email"
                          onInput={(e) => {
                            setDataUpdate((previousState) => ({
                              ...previousState,
                              email: e.target.value,
                            }));
                          }}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col md="6">
                      <FormGroup>
                        <label>Contact No</label>
                        <Input
                          defaultValue={dataState.contact_no}
                          placeholder="contact no."
                          onInput={(e) => {
                            setDataUpdate((previousState) => ({
                              ...previousState,
                              contact_no: e.target.value,
                            }));
                          }}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      color="primary"
                      type="button"
                      onClick={() => {
                        showAlert({
                          title: "Are you sure?",
                          type: "warning",
                          onConfirm: () => handleUpdateProfile(),
                          onCancel: hideAlert,
                        });
                      }}
                    >
                      UPDATE
                    </Button>
                  </div>
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
                  <Col md="6">
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
          <Button
            className="buttonClose"
            color="primary"
            onClick={() => window.history.back()}
            style={{ visibility: "visible", opacity: 1 }}
          >
            Close
          </Button>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
