import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Form,
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
  const [formData, setFormData] = useState({
    id: "",
    code: "",
    entrydate_formatted: "",
    categorycode1: "",
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
    seller_email: "",
    seller_location: "",
    statuscode: "",
  });
  const timestamp = new Date().toISOString(); // Get the current timestamp
  const currentDate = new Date();
  const formattedDate = `${String(currentDate.getDate()).padStart(2, "0")}/${String(currentDate.getMonth() + 1).padStart(2, "0")}/${currentDate.getFullYear()}`;
  const user = JSON.parse(sessionStorage.getItem("user"));
  console.log("user", user);
  const [eoiFormData, setEoiFormData] = useState({
    code: "",
    submission_date: formattedDate,
    buyer_name: user.firstname + " " + user.lastname,
    organization: user.organization_title,
    contact_no: "",
    email: "",
    address: "",
    delivery_location: "",
    eoi_status: "EOI_SUBMITTED",
    approval_status: "PENDING",
    status_trail: `EOI_SUBMITTED:${timestamp}`,
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

  const handleSubmit = async () => {
    try {
      console.log("submission eoi");
      setLoader(true);
      const res = await EndPointService.createEoi(headers, id, eoiFormData);
      console.log(res);
      setLoader(false);
      showAlert({
        title: `Expression of Interest for '${formData.asset_name}' submitted to Seller. `,
        content: `Reference No: ${res.appRespData[0].eoi_add}`,
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          navigate("/admin/exchange");
        },
      });

      // setAlert(
      //   <ReactBSAlert
      //     success
      //     style={{ display: "block", marginTop: "-100px" }}
      //     title="Submitted"
      //     onConfirm={() => confirmation()}
      //     onCancel={() => hideAlert()}
      //     confirmBtnBsStyle="info"
      //     btnSize=""
      //   >
      //     EoI submitted
      //   </ReactBSAlert>
      // );
    } catch (e) {
      console.log(e);
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleFormSubmission = async (e) => {
    showAlert({
      title: "Are you sure?",
      type: "warning",
      onConfirm: () => handleSubmit(),
      onCancel: hideAlert,
    });
    // setAlert(
    //   <ReactBSAlert
    //     warning
    //     style={{ display: "block", marginTop: "-100px" }}
    //     title="Are you sure?"
    //     onConfirm={() => handleSubmit()}
    //     onCancel={() => hideAlert()}
    //     confirmBtnBsStyle="info"
    //     cancelBtnBsStyle="danger"
    //     confirmBtnText="Yes"
    //     cancelBtnText="Cancel"
    //     showCancel
    //     btnSize=""
    //   />
    // );
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
                      <Label style={{ color: "#36454F" }}>Description</Label>
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
                        <Input
                          type="text"
                          name="buyer_name"
                          required
                          value={eoiFormData.buyer_name}
                          onChange={(e) =>
                            setEoiFormData({
                              ...eoiFormData,
                              buyer_name: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Company</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="organization"
                          required
                          value={eoiFormData.organization}
                          onChange={(e) =>
                            setEoiFormData({
                              ...eoiFormData,
                              organization: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Contact No</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="contact_no"
                          value={eoiFormData.contact_no}
                          onChange={(e) =>
                            setEoiFormData({
                              ...eoiFormData,
                              contact_no: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Email</Label>
                      <FormGroup className={`has-label ${eoiFormData.email}`}>
                        <Input
                          type="text"
                          name="email"
                          value={eoiFormData.email}
                          onChange={(e) =>
                            setEoiFormData({
                              ...eoiFormData,
                              email: e.target.value,
                            })
                          }
                          //   onChange={(e) => {
                          //     const value = e.target.value;
                          //     if (!verifyEmail(value)) {
                          //       setRegisterEmailState("has-danger");
                          //     } else {
                          //       setRegisterEmailState("has-success");
                          //     }
                          //     setEoiFormData((prevState) => ({
                          //       ...prevState,
                          //       email: value,
                          //     }));
                          //   }}
                          required
                        />
                        {/* {registerEmailState === "has-danger" ? (
                          <label className="error">
                            Please enter a valid email address.
                          </label>
                        ) : null} */}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Buyer Address</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="address"
                          required
                          value={eoiFormData.address}
                          onChange={(e) =>
                            setEoiFormData({
                              ...eoiFormData,
                              address: e.target.value,
                            })
                          }
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>
                        Item Delivery Location
                      </Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="delivery_location"
                          required
                          value={eoiFormData.delivery_location}
                          onChange={(e) =>
                            setEoiFormData({
                              ...eoiFormData,
                              delivery_location: e.target.value,
                            })
                          }
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
                        <Input
                          type="text"
                          name="contact_time_preference"
                          value={eoiFormData.contact_time_preference}
                          onChange={(e) =>
                            setEoiFormData({
                              ...eoiFormData,
                              contact_time_preference: e.target.value,
                            })
                          }
                          required
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
              onClick={() => window.history.back()}
              style={{ visibility: "visible", opacity: 1 }}
            >
              Close
            </Button>
            <Button
              color="primary"
              type="button"
              onClick={handleFormSubmission}
            >
              Submit EoI
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Create;
