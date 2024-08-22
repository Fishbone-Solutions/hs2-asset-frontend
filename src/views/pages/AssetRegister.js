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
import Select from "react-select";
import moment from "moment";
import "react-datetime/css/react-datetime.css";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { FileUpload } from "primereact/fileupload";
import BACKEND_ADDRESS from "views/components/serverAddress";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "./AssetRegister.css";
import { GlobalContext } from "GlobalState";
import "react-datetime/css/react-datetime.css";
import "react-datetime/css/react-datetime.css";
import ReactDatetime from "react-datetime";

const camelCaseWithSpaces = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const AssetRegister = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const mode = query.get("mode");
  const isAddMode = mode === "add";
  console.log("mode asset", mode);
  const UPLOAD_TEXT =
    mode === "add" || mode === "edit"
      ? "Drag and drop files here to upload"
      : "";
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

  const requiredFields = [
    "seller_title",
    "seller_contactno",
    "seller_email",
    "seller_location",
    "categorycode1",
    "categorycode2",
    "asset_name",
    // "availablility_range",
    "asset_condition",
    "quantity",
    "seller_location",
    "value",
    "statuscode",
  ];
  const Conditionoptions = [
    { value: "New", label: "New" },
    { value: "Used-Working", label: "Used - Working" },
    { value: "Used-Not-Working", label: "Used - Not Working" },
    { value: "Refurbished", label: "Refurbished" },
    { value: "Expired", label: "Expired" },
  ];
  const options = [
    { value: "Live", label: "Live" },
    { value: "Listing", label: "Listing" },
    { value: "Sold", label: "Sold" },
  ];

  const optionsCategory1 = [
    { value: "Construction Office", label: "Construction Office" },
    {
      value: "Storage/Logistics Facilities",
      label: "Storage/Logistics Facilities",
    },
    { value: "Processing Facilities", label: "Processing Facilities" },
    { value: "Fixed Services", label: "Fixed Services" },
    { value: "Temporary Services", label: "Temporary Services" },
    { value: "Security", label: "Security" },
    {
      value: "Compound Security/Safety Infrastructure",
      label: "Compound Security/Safety Infrastructure",
    },
    {
      value: "Site Roads and Infrastructure",
      label: "Site Roads and Infrastructure",
    },
    { value: "Temporary Siding", label: "Temporary Siding" },
    { value: "Consolidation Yards", label: "Consolidation Yards" },
    { value: "Concrete Production", label: "Concrete Production" },
    { value: "Diversions", label: "Diversions" },
    { value: "Earthworks", label: "Earthworks" },
    { value: "Static Plant", label: "Static Plant" },
    { value: "Piling", label: "Piling" },
    { value: "Pipework", label: "Pipework" },
    {
      value: "Public Highway Traffic Management",
      label: "Public Highway Traffic Management",
    },
    { value: "Other Assets", label: "Other Assets" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      if (mode === "edit" || mode === "view" || mode === "exchange") {
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

  const handleDate = () => {};

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

  const isReadOnly = mode === "view" || mode === "exchange";

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
                    {camelCaseWithSpaces("Seller Information")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Seller Title *</Label>
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
                      <Label style={{ color: "#36454F" }}>Contact No *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_contactno"
                          value={formData.seller_contactno}
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>
                        Email Address *
                      </Label>
                      <FormGroup
                        className={`has-label ${formData.seller_email}`}
                      >
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!verifyEmail(value)) {
                              setRegisterEmailState("has-danger");
                            } else {
                              setRegisterEmailState("has-success");
                            }
                            setFormData((prevState) => ({
                              ...prevState,
                              seller_email: value,
                            }));
                          }}
                          required
                          readOnly={isReadOnly}
                        />
                        {registerEmailState === "has-danger" ? (
                          <label className="error">
                            Please enter a valid email address.
                          </label>
                        ) : null}
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Location *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_location"
                          value={formData.seller_location}
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            </Col>
            {/* Category Detail*/}
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
                    {camelCaseWithSpaces("Category")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Category</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="categorycode1"
                          value={optionsCategory1.find(
                            (option) => option.value === formData.categorycode1,
                          )}
                          onChange={(selectedOption) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              categorycode1: selectedOption.value,
                            }))
                          }
                          options={optionsCategory1}
                          placeholder="Select an option"
                          isDisabled={isReadOnly}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Sub Category</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="categorycode2"
                          value={{
                            value: formData.categorycode2,
                            label: formData.categorycode2,
                          }}
                          onChange={(selectedOption) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              categorycode2: selectedOption.value,
                            }))
                          }
                          options={[
                            { value: "Generic", label: "Generic" },
                            { value: "Other", label: "Other" },
                          ]}
                          placeholder="Select an option"
                          isDisabled={isReadOnly}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            {/* Item Information*/}
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
                    {camelCaseWithSpaces("Item Information")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>ID</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="id"
                          value={" Auto Generated"}
                          onChange={handleChange}
                          required
                          disabled
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Name *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_name"
                          value={formData.asset_name}
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
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
                          onChange={handleChange}
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>
                        Forecasted Availability*
                      </Label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: "form-control",
                            placeholder: "DD/MM/YYYY",
                          }}
                          value={
                            formData.available_from
                              ? moment(formData.available_from, "DD/MM/YYYY")
                              : null
                          }
                          onChange={(momentDate) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              available_from: momentDate.format("DD/MM/YYYY"),
                            }))
                          }
                          timeFormat={false}
                          readOnly={isReadOnly}
                          dateFormat="DD/MM/YYYY"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Condition *</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="asset_condition"
                          value={Conditionoptions.find(
                            (option) =>
                              option.value === formData.asset_condition,
                          )}
                          onChange={(selectedOption) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              asset_condition: selectedOption.value,
                            }))
                          }
                          options={Conditionoptions}
                          placeholder="Select an option"
                          isDisabled={isReadOnly}
                          required
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Quantity *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Location *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_location"
                          value={formData.asset_location}
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>
                        Estimated Value *
                      </Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="value"
                          value={formData.value}
                          onChange={handleChange}
                          required
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="8" style={{ color: "#36454F" }}>
                      Other Details
                    </Label>
                    <Col md="12">
                      <FormGroup>
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
            {/* Upload Images*/}
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
                    {camelCaseWithSpaces("Images")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <FileUpload
                    name="demo[]"
                    url="/api/upload"
                    multiple
                    accept="image/*"
                    maxFileSize={1000000}
                    emptyTemplate={<p className="m-0">{UPLOAD_TEXT}</p>}
                    disabled={isReadOnly}
                    className="custom-file-upload"
                  />
                </CardBody>
              </Card>
            </Col>
            {/* Upload Documents*/}
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
                    {camelCaseWithSpaces("Documents")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <FileUpload
                    name="demo[]"
                    url={"/api/upload"}
                    multiple
                    accept="image/*"
                    maxFileSize={1000000}
                    className="custom-file-upload"
                    emptyTemplate={<p className="m-0">{UPLOAD_TEXT}</p>}
                    disabled={isReadOnly}
                  />
                </CardBody>
              </Card>
            </Col>
            {/* Set Asset Status */}
            {mode !== "exchange" && (
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
                      {camelCaseWithSpaces("Item Status")}
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col sm="6">
                        <Label style={{ color: "#36454F" }}>Status *</Label>
                        <FormGroup>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            name="statuscode"
                            value={options.find(
                              (option) => option.value === formData.statuscode,
                            )}
                            onChange={(selectedOption) =>
                              setFormData((prevState) => ({
                                ...prevState,
                                statuscode: selectedOption.value,
                              }))
                            }
                            options={[
                              { value: "Live", label: "Live" },
                              { value: "Listing", label: "Listing" },
                              { value: "Sold", label: "Sold" },
                            ]}
                            placeholder="Select an option"
                            isDisabled={isReadOnly}
                            required
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            )}
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
            {mode !== "view" && (mode === "add" || mode === "edit") && (
              <Button color="primary" type="submit">
                Save
              </Button>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default AssetRegister;
