import React, { useState, useEffect, useContext } from "react";
// reactstrap components
import {
  Card,
  Button,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  CardHeader,
  CardTitle,
  CardFooter,
  Row,
  Col,
} from "reactstrap";
import { GlobalContext } from "../../GlobalState";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import BACKEND_ADDRESS from "../components/serverAddress";
import Select from "react-select";
import ReactDatetime from "react-datetime";
import moment from "moment";
import ReactBSAlert from "react-bootstrap-sweetalert";

const camelCaseWithSpaces = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const EoIPage = () => {
  const { assetId } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode");
  const eoi = query.get("eoino");
  const [registerEmailState, setRegisterEmailState] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const { username } = useContext(GlobalContext);

  var options = [];
  if (mode === "edit") {
    options = [
      { value: "EOI-SUBMITTED", label: "EOI Submitted" },
      { value: "IN-NEGOTIATION", label: "In Negotiation" },
      { value: "PAYMENT-RECEIVED", label: "Payment Received" },
      { value: "GOODS-SENT", label: "Goods Sent" },
    ];
  }
  if (mode === "exchange_edit") {
    options = [
      { value: "PAYMENT-SENT", label: "Payment Sent" },
      { value: "GOODS-RECEIVED", label: "Goods Received" },
    ];
  }
  const [formData, setFormData] = useState({
    id: "",
    code: "",
    asset_id: "",
    submission_date_formatted: "",
    buyer_name: "",
    organization: "",
    contact_no: "",
    email: "",
    address: "",
    delivery_location: "",
    contact_time_preference: "",
    eoi_status: "",
    approval_status: "",
    approval_ref_no: "",
    status_trail: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "edit" || mode === "view" || mode === "exchange_edit") {
        try {
          const myHeaders = new Headers();
          myHeaders.append("accept", "application/json");
          myHeaders.append("token", "x8F!@p01,*MH");
          myHeaders.append("user_id", username);

          const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
          };

          const response = await fetch(
            `${BACKEND_ADDRESS}/assets/${assetId}/eoi/${eoi}`,
            requestOptions
          );

          if (response.ok) {
            const result = await response.json();
            console.log("results", result.appRespData[0]);
            setFormData(result.appRespData[0]);
          } else {
            console.error("Failed to fetch data", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData();
  }, [assetId, mode, eoi, username]);

  const hideAlert = () => {
    setAlert(null);
  };

  const verifyEmail = (value) => {
    var emailRex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRex.test(value);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFormData((prevState) => ({
      ...prevState,
      eoi_status: selectedOption.value,
    }));
  };

  const handleSubmit = async () => {
    const url = `${BACKEND_ADDRESS}/assets/${assetId}/eoi/${eoi}`;
    const requestBody = {
      eoi_status: formData.eoi_status,
      approval_status: formData.approval_status,
      approval_ref_no: formData.approval_ref_no,
      status_trail: formData.status_trail,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: "x8F!@p01,*MH",
          user_id: username,
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      setAlert(
        <ReactBSAlert
          success
          style={{ display: "block", marginTop: "-100px" }}
          title="Submitted"
          onConfirm={() => hideAlert()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          btnSize=""
        >
          EoI submitted
        </ReactBSAlert>
      );
      if (mode == "edit") {
        navigate(`/admin/eoi/${assetId}`);
      } else if (mode == "exchange_edit") {
        navigate(`/admin/myeoi`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => handleSubmit()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      />
    );
  };

  const isReadOnly = mode === "view" || mode === "edit";

  const handleApprove = () => {
    setAlert(
      <ReactBSAlert
        input
        title="Approval"
        showCancel
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Submit"
        cancelBtnText="Cancel"
        onConfirm={submitApproval}
        onCancel={() => hideAlert()}
        btnSize=""
      >
        <div>
          <Label>Approval Status</Label>
          <Select
            className="react-select primary"
            classNamePrefix="react-select"
            name="approval_status"
            value={options.find((option) => option.value === approvalStatus)}
            onChange={(selectedOption) =>
              setApprovalStatus(selectedOption.value)
            }
            options={[
              { value: "PENDING", label: "Pending" },
              { value: "APPROVED", label: "Approved" },
              { value: "REJECTED", label: "Rejected" },
            ]}
            placeholder="Select an approval status"
            required
          />
        </div>
      </ReactBSAlert>
    );
  };

  const submitApproval = async () => {
    setAlert(
      <ReactBSAlert
        success
        style={{ display: "block", marginTop: "-100px" }}
        title="Submitted"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        Approval request submitted
      </ReactBSAlert>
    );
  };

  return (
    <>
      <div className="content">
        <Form onSubmit={handleFormSubmission}>
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
                      WebkitTextTransform: "capitalize",
                    }}
                  >
                    {"EoI Information"}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>EoI No</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="id"
                          value={eoi}
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>
                        Submission Date
                      </Label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: "form-control",
                            placeholder: "DD/MM/YYYY",
                            readOnly: true, // Keep this as read-only for styling purposes
                            disabled: true, // Disable the input entirely
                          }}
                          value={
                            formData.submission_date_formatted
                              ? moment(
                                  formData.submission_date_formatted,
                                  "DD/MM/YYYY"
                                )
                              : null
                          }
                          onChange={(momentDate) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              submission_date_formatted:
                                momentDate.format("DD/MM/YYYY"),
                            }))
                          }
                          timeFormat={false}
                          readOnly // This readOnly is for the input field generated by the component
                          dateFormat="DD/MM/YYYY" // Specify the date format
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter>{/* Your Card Footer */}</CardFooter>
              </Card>
            </Col>
            {/* Approval Detail*/}
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
                    {camelCaseWithSpaces("Approval")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Approval Status</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="approval_status"
                          value={formData.approval_status}
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>CEMAR Ref No</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="approval_ref_no" // Corrected name field
                          value={formData.approval_ref_no}
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            {/* Audit Trail Detail*/}
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
                    {camelCaseWithSpaces("Tracking History")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="status_trail"
                          value={formData.status_trail}
                          onChange={handleChange}
                          style={{ width: "100%", height: "100%" }}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Buyer  Details*/}
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
                    {camelCaseWithSpaces("Buyer Details")}
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
                          value={formData.buyer_name}
                          onChange={handleChange}
                          required
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Company</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          required
                          readOnly
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
                          value={formData.contact_no}
                          onChange={handleChange}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Email</Label>
                      <FormGroup className={`has-label ${formData.email}`}>
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
                              email: value, // Corrected field
                            }));
                          }}
                          required
                          readOnly
                        />
                        {registerEmailState === "has-danger" ? (
                          <label className="error">
                            Please enter a valid email address.
                          </label>
                        ) : null}
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
                          value={formData.address}
                          onChange={handleChange}
                          readOnly
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
                          value={formData.delivery_location}
                          onChange={handleChange}
                          readOnly
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
                          value={formData.contact_time_preference}
                          onChange={handleChange}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Set EoI Status */}
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
                    {"EoI Status"}
                  </CardTitle>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}> Status *</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="eoi_status"
                          value={options.find(
                            (option) => option.value === formData.eoi_status
                          )}
                          onChange={handleSelectChange}
                          options={options}
                          placeholder="Select an option"
                          isDisabled={
                            mode !== "edit" && mode !== "exchange_edit"
                          } // Enable only in edit mode
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
            {mode === "edit" && (
              <Button
                color="primary"
                onClick={() => handleApprove}
                type="submit"
              >
                REQUEST APPROVAL
              </Button>
            )}
            {(mode === "edit" || mode === "exchange_edit") && (
              <Button color="primary" type="submit">
                SAVE
              </Button>
            )}
            <Button
              className="buttonClose"
              color="primary"
              onClick={() => window.history.back()}
              style={{ visibility: "visible", opacity: 1 }}
            >
              CLOSE
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default EoIPage;
