import React from "react";
import Select from "react-select";
import { FileUpload } from "primereact/fileupload";
import "primereact/resources/primereact.css";
import { useState, useEffect } from "react";
import ReactDatetime from "react-datetime";
import BACKEND_ADDRESS from "../components/serverAddress";
import moment from "moment";
import "./AssetRegister.css"
import ReactBSAlert from "react-bootstrap-sweetalert";
import { useParams } from "react-router-dom";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  FormText,
  Row,
  Col,
} from "reactstrap";



function AssetRegisterView() {
  const { code } = useParams();

  console.log("asset ID",code)
  const [registerEmailState, setregisterEmailState] = useState("");
  const [requiredState, setrequiredState] = useState("");
  const [required, setrequired] = useState("");
  const [alert, setAlert] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    entrydate: "",
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

  const optionsCategory1 = [
    { value: "plant", label: "Plant" },
    { value: "machinery", label: "Machinery" },
    { value: "fencing", label: "Fencing" },
    { value: "lighting", label: "Lighting" },
    { value: "office-equipment", label: "Office Equipment" },
    { value: "materials", label: "Materials" },
    { value: "aggregate", label: "Aggregate" },
    { value: "signs", label: "Signs" },
  ];

  const verifyEmail = (value) => {
    var emailRex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRex.test(value);
  };

  const verifyLength = (value, length) => value.length >= length;

  useEffect(() => {
    const fetchData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("token", "x8F!@p01,*MH");
     // myHeaders.append("user_id", "tabish.hb");
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      fetch(`${BACKEND_ADDRESS}/assets/${code}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setFormData(result.appRespData[0]);
          console.log(result);
        })
        .catch((error) => console.error(error));
    };


    fetchData();
  }, [assetId]);

  return (
    <>
      <div className="content">
        <Form>
          <Row>
            {/* Asset Seller Detail*/}
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h6" style={{ color: "rgb(82,203,206)" }}>
                    Asset Seller Details
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Seller Title *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_title"
                          value={formData.seller_title}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Contact No *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_contactno"
                          value={formData.seller_contactno}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Email Address *
                    </Label>
                    <Col sm="4">
                      <FormGroup className={`has-label ${formData.seller_email}`}>
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Location *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_location"
                          value={formData.seller_location}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            {/* Category Detail*/}
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle
                    tag="h6"
                    style={{ color: "rgb(82,203,206)", fontWeight: "bold" }}
                  >
                    Category Selection
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Category 1 *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="category1"
                          value={optionsCategory1.find(
                            (option) => option.value === formData.categorycode1
                          )}
                          isDisabled
                          options={optionsCategory1}
                          placeholder="Select an option"
                        />
                      </FormGroup>
                    </Col>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Category 2 *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="category2"
                          value={{ value: formData.categorycode2, label: formData.categorycode2 }}
                          isDisabled
                          options={[
                            { value: "Option 1", label: "Option 1" },
                            { value: "Option 2", label: "Option 2" },
                          ]}
                          placeholder="Select an option"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            {/* Asset Detail*/}
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle
                    tag="h6"
                    style={{ color: "rgb(82,203,206)", fontWeight: "bold" }}
                  >
                    Asset Detail
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Asset ID *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="code"
                          value={formData.code}
                          readOnly
                        />
                        <FormText color="default" tag="span"></FormText>
                      </FormGroup>
                    </Col>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Name *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_name"
                          value={formData.asset_name}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Description
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="description"
                          value={formData.description}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Available From
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: 'form-control',
                            placeholder: 'Date Picker Here',
                            readOnly: true,
                          }}
                          value={formData.available_from ? moment(formData.available_from, 'DD-MM-YYYY') : null}
                          timeFormat={false}
                          isValidDate={() => false}
                          closeOnSelect
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Condition *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="asset_condition"
                          value={{ value: formData.asset_condition, label: formData.asset_condition }}
                          isDisabled
                          options={[
                            { value: "New", label: "New" },
                            { value: "Old", label: "Old" },
                          ]}
                          placeholder="Select an option"
                        />
                      </FormGroup>
                    </Col>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Quantity
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="quantity"
                          value={formData.quantity}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Location *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_location"
                          value={formData.asset_location}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Estimated Value
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="value"
                          value={formData.value}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="4" style={{ color: "#36454F" }}>
                      Other Details
                    </Label>
                    <Col md="10">
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="additional_info"
                          value={formData.additional_info}
                          readOnly
                          style={{ width: "100%", height: "100%" }}
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
                    style={{ color: "rgb(82,203,206)", fontWeight: "bold" }}
                  >
                    Upload Images
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <p>Images upload functionality is disabled in view-only mode.</p>
                </CardBody>
              </Card>
            </Col>
            {/* Upload Documents*/}
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle
                    tag="h6"
                    style={{ color: "rgb(82,203,206)", fontWeight: "bold" }}
                  >
                    Upload Documents
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <p>Documents upload functionality is disabled in view-only mode.</p>
                </CardBody>
              </Card>
            </Col>
            {/* Set Asset Status */}
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle
                    tag="h6"
                    style={{ color: "rgb(82,203,206)", fontWeight: "bold" }}
                  >
                    Asset Status
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Status *
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="statuscode"
                          value={{ value: formData.statuscode, label: formData.statuscode }}
                          isDisabled
                          options={[
                            { value: "New", label: "New" },
                            { value: "Old", label: "Old" },
                          ]}
                          placeholder="Select an option"
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
            <Button color="primary">Close</Button>
          </div>
        </Form>
      </div>
    </>
  );
}

export default AssetRegisterView;


