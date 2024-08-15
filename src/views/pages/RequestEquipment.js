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
import BACKEND_ADDRESS from "views/components/serverAddress";
import { GlobalContext } from "GlobalState";
import ReactDatetime from "react-datetime";

const camelCaseWithSpaces = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const RequestEquipment = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode");
  const isAddMode = mode === "add";

  const [registerEmailState, setRegisterEmailState] = useState("");
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const { username } = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    id: isAddMode ? "Auto Generated" : "", // Initialize id based on mode
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

  const options = [
    { value: "Listing", label: "Listing" },
    { value: "Live", label: "Live" },
    { value: "Sold", label: "Sold" },
  ];
  const optionsCategory1 = [
    { value: "construction-office", label: "Construction Office" },
    {
      value: "storage-logistics-facilities",
      label: "Storage/Logistics Facilities",
    },
    { value: "processing-facilities", label: "Processing Facilities" },
    { value: "fixed-services", label: "Fixed Services" },
    { value: "temporary-services", label: "Temporary Services" },
    { value: "security", label: "Security" },
    {
      value: "compound-security-safety-infrastructure",
      label: "Compound Security/Safety Infrastructure",
    },
    {
      value: "site-roads-and-infrastructure",
      label: "Site Roads and Infrastructure",
    },
    { value: "temporary-siding", label: "Temporary Siding" },
    { value: "consolidation-yards", label: "Consolidation Yards" },
    { value: "concrete-production", label: "Concrete Production" },
    { value: "diversions", label: "Diversions" },
    { value: "earthworks", label: "Earthworks" },
    { value: "static-plant", label: "Static Plant" },
    { value: "piling", label: "Piling" },
    { value: "pipework", label: "Pipework" },
    {
      value: "public-highway-traffic-management",
      label: "Public Highway Traffic Management",
    },
    { value: "other-assets", label: "Other Assets" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "edit" || mode === "view") {
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
            `${BACKEND_ADDRESS}/assets/${id}`,
            requestOptions,
          );

          if (response.ok) {
            const result = await response.json();
            setFormData(result.appRespData[0]);
          } else {
            console.error("Failed to fetch data");
          }
        } catch (error) {
          console.error("Error:", error);
        }
      }
    };

    fetchData();
  }, [id, mode]);

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
    // Only allow changes if not in add mode for id field
    if (name === "id" && isAddMode) {
      return; // Prevent changes to id if in add mode
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const url = `${BACKEND_ADDRESS}/assets/${mode === "edit" ? id : ""}`;
    const requestBody = { ...formData };

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
          Asset Listing submitted
        </ReactBSAlert>,
      );
      navigate("/admin/inventory");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();

    const requiredFields = [
      "seller_title",
      "seller_contactno",
      "seller_email",
      "seller_location",
      "categorycode1",
      "categorycode2",
      "asset_name",
      "available_from",
      "asset_condition",
      "quantity",
      "asset_location",
      "value",
      "statuscode",
    ];

    for (let field of requiredFields) {
      if (!formData[field]) {
        setAlert(
          <ReactBSAlert
            warning
            style={{ display: "block", marginTop: "-100px" }}
            title="Missing Information"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="info"
            btnSize=""
          >
            Please fill in all required fields.
          </ReactBSAlert>,
        );
        return;
      }
    }
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
      />,
    );
  };

  const isReadOnly = mode === "view";

  return (
    <>
      <div className="content">
        <Form onSubmit={handleFormSubmission}>
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
                    {camelCaseWithSpaces("Buyer Details")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_title"
                          value={formData.seller_title}
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Company</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_contactno"
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
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
                          name="seller_email"
                          value={formData.seller_email}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Email Address</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>Buyer Address</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>Item Delivery
                      Location</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Preferred
                      Contact Timings</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            </Col>

            {/* Requested Equipment Details */}
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
                    {camelCaseWithSpaces(
                      "Requested Equipment Details",
                    )}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Equipment
                      Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="H"
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Quantity</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="Company"
                          //              value={formData.asset_name}
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Required By</Label>
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
                                  "DD/MM/YYYY",
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

                    <Col sm="12">
                      <Label style={{ color: "#36454F" }}>Please let us know in the box below what is it that you are looking for</Label>
                      <FormGroup
                        className={`has-label ${formData.seller_email}`}
                      >
                        <Input
                          type="textarea"
                          name="additional_info"
                          value={formData.additional_info}
                          onChange={handleChange}
                          style={{ width: "100%", height: "100%" }}
                          readOnly={isReadOnly}
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
            {mode !== "view" && (
              <Button color="primary" type="submit">
                Submit
              </Button>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default RequestEquipment;
