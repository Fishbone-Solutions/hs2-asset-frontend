import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
} from "reactstrap";
import "react-datetime/css/react-datetime.css";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { GlobalContext } from "@/GlobalState";
import { EndPointService } from "@/services/methods";
import DynamicToast from "components/Common/Toast";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { useAlert } from "components/Common/NotificationAlert";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { initialEoiValues, eoiSchema } from "variables/Validations/EoiSchema";
import { initialInventoryValues } from "variables/Validations/InventorySchema";

const Create = () => {
  const { id } = useParams();
  const location = useLocation();
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { username } = useContext(GlobalContext);
  const headers = { user_id: sessionStorage.getItem("username") };
  const [registerEmailState, setRegisterEmailState] = useState("");

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const [formData, setFormData] = useState(initialInventoryValues);
  const timestamp = new Date().toISOString(); // Get the current timestamp
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}/${String(currentDate.getMonth() + 1).padStart(2, "0")}/${currentDate.getFullYear()}`;
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("user", user);
  // Set the initial state using dynamic values
  const [eoiFormData, setEoiFormData] = useState({
    ...initialEoiValues, // Spread the initial object
    submission_date: formattedDate,
    buyer_name: user.firstname + " " + user.lastname,
    organization: user.organization_title,
  });

  const fetchData = async () => {
    try {
      setLoader(true);
      const res = await EndPointService.getInventoryById(headers, id);
      setFormData(res.appRespData[0]);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (values) => {
    try {
      console.log("submission eoi");
      setLoader(true);
      const res = await EndPointService.createEoi(headers, id, values);
      console.log(res);
      setLoader(false);
      showAlert({
        title: `Expression of Interest for '${formData.asset_name}' submitted to Seller`,
        content: `Reference No: ${res.appRespData[0].eoi_add}`,
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          navigate("/admin/exchange");
        },
      });
    } catch (e) {
      console.log(e);
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleFormSubmission = async (values, { setSubmitting }) => {
    showAlert({
      title: "Are you sure?",
      type: "warning",
      onConfirm: () => handleSubmit(values),
      onCancel: hideAlert,
    });
  };

  return (
    <>
      <div className="content">
        <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        />
        {loader ? <FullPageLoader /> : ""}
        <Formik
          initialValues={eoiFormData}
          validationSchema={eoiSchema}
          onSubmit={handleFormSubmission}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Row>
                {/* Asset Seller Detail*/}
                <Col md="12">
                  <Card>
                    <CardHeader>
                      <CardTitle
                        tag="h6"
                        style={{
                          color: "rgb(82,203,206)",
                          fontWeight: "bold",
                          textTransform: "capitalize",
                          WebkitTextTransform: "capitalize",
                        }}
                      >
                        Asset Reference
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col sm="6">
                          <Label>Asset ID</Label>
                          <FormGroup>
                            <Input
                              type="text"
                              name="id"
                              value={id}
                              required
                              readOnly={true}
                            />
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>Name</Label>
                          <FormGroup>
                            <Input
                              type="text"
                              name="asset_name"
                              value={formData.asset_name}
                              required
                              readOnly={true}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>
                            Description
                          </Label>
                          <FormGroup>
                            <Input
                              type="text"
                              name="description"
                              value={formData.description}
                              readOnly={true}
                            />
                          </FormGroup>
                        </Col>

                        <Col sm="6"></Col>
                      </Row>
                    </CardBody>
                    <CardFooter></CardFooter>
                  </Card>
                </Col>

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
                        Buyer Details
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>Name</Label>
                          <FormGroup>
                            <Field type="text" name="buyer_name" as={Input} />
                            <ErrorMessage
                              name="buyer_name"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>Company</Label>
                          <FormGroup>
                            <Field type="text" name="organization" as={Input} />
                            <ErrorMessage
                              name="organization"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>Contact No</Label>
                          <FormGroup>
                            <Field type="text" name="contact_no" as={Input} />
                            <ErrorMessage
                              name="contact_no"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>Email</Label>
                          <FormGroup
                            className={`has-label ${eoiFormData.email}`}
                          >
                            <Field type="email" name="email" as={Input} />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>
                            Buyer Address
                          </Label>
                          <FormGroup>
                            <Field type="text" name="address" as={Input} />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>
                            Item Delivery Location
                          </Label>
                          <FormGroup>
                            <Field
                              type="text"
                              name="delivery_location"
                              as={Input}
                            />
                            <ErrorMessage
                              name="delivery_location"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="6">
                          <Label style={{ color: "#36454F" }}>
                            Preferred Contact Timings
                          </Label>
                          <FormGroup>
                            <Field
                              type="text"
                              name="contact_time_preference"
                              as={Input}
                            />
                            <ErrorMessage
                              name="contact_time_preference"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
              {alert}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  className="buttonClose"
                  color="primary"
                  onClick={() => navigate("/admin/exchange")}
                  style={{ visibility: "visible", opacity: 1 }}
                >
                  Close
                </Button>
                <Button color="primary" type="submit">
                  Submit EoI
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Create;
