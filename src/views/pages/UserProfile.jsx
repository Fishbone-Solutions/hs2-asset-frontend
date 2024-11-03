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
  Input,
  Row,
  Col,
} from "reactstrap";
import { EndPointService } from "@/services/methods";
import DynamicToast from "components/Common/Toast";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { useAlert } from "components/Common/NotificationAlert";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { initialProfilValues } from "variables/Validations/Profile";
import { profileSchema } from "variables/Validations/Profile";

function UserProfile() {
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const { username } = useContext(GlobalContext);
  const [dataState, setDataState] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const [dataUpdate, setDataUpdate] = useState(initialProfilValues);
  const [formSubmission, setFormSubmission] = useState(false);
  const [errorCount, setErrorCount] = useState(0);
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
        firstname: resData.firstname,
        lastname: resData.lastname,
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

  const handleFormSubmission = async (values, { setSubmitting }) => {
    showAlert({
      title: <h4 className="sweet-alert-sure">Are you sure?</h4>,
      type: "warning",
      onConfirm: () => handleUpdateProfile(values),
      onCancel: hideAlert,
    });
  };

  const handleUpdateProfile = (values) => {
    setLoader(true);
    try {
      const res = EndPointService.updateProfile(
        headers,
        sessionStorage.getItem("username"),
        values
      );
      let sessionData = JSON.parse(sessionStorage.getItem("user"));
      sessionData.firstname = values.firstname;
      sessionData.lastname = values.lastname;
      sessionData.email = values.email;
      sessionData.contact_no = values.contact_no;

      sessionStorage.setItem("user", JSON.stringify(sessionData));

      setLoader(false);
      showAlert({
        title: (
          <p class="sweet-title-size sweet-title-padding">Profile updated</p>
        ),
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

  useEffect(() => {
    console.log(errorCount, formSubmission);

    if (errorCount > 0 && formSubmission) {
      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding">
            Please fill all mandatory fields
          </p>
        ),
        type: "error",
        onConfirm: () => hideAlert(),
        confirmText: "Ok",
        showCancelButton: false,
      });

      setFormSubmission(false);
    }
  }, [formSubmission, errorCount]); // Run whenever errors change

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
                <Formik
                  initialValues={dataUpdate}
                  validationSchema={profileSchema}
                  onSubmit={handleFormSubmission}
                  enableReinitialize={true}
                  //validate={handleValidationFailure}
                >
                  {({ errors, values, setFieldValue }) => {
                    useEffect(() => {
                      setErrorCount(Object.keys(errors).length);
                    }, [errors]); // Run whenever errors change

                    return (
                      <Form>
                        <Row>
                          <Col className="pr-1" md="6">
                            <label className="required">First Name</label>
                            <FormGroup>
                              <Field
                                placeholder="first name"
                                type="text"
                                as={Input}
                                name="firstname"
                                className="form-control"
                              />
                              <ErrorMessage
                                name="firstname"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>

                          <Col md="6">
                            <label className="required">Last Name</label>
                            <FormGroup>
                              <Field
                                placeholder="last name"
                                as={Input}
                                type="text"
                                className="form-control"
                                name="lastname"
                              />
                              <ErrorMessage
                                name="lastname"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col md="6">
                            <label className="required">Email</label>
                            <FormGroup>
                              <Field
                                placeholder="email"
                                className="form-control"
                                as={Input}
                                type="text"
                                name="email"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                          <Col md="6">
                            <label>Contact No</label>
                            <FormGroup>
                              <Field
                                className="form-control"
                                placeholder="contact no."
                                as={Input}
                                type="text"
                                name="contact_no"
                                value={values.contact_no}
                              />
                              <ErrorMessage
                                name="contact_no"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          <Button
                            color="primary"
                            type="submit"
                            onClick={() => {
                              console.log(Object.keys(errors).length);
                              setFormSubmission(true);
                            }}
                          >
                            UPDATE
                          </Button>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
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
