import React, {
  PropTypes,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "../../../services/methods";
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Input,
  CardHeader,
  CardTitle,
  Label,
  FormGroup,
  Modal,
} from "reactstrap";

const Create = () => {
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
                            (option) => option.value === formData.categorycode1
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
                      <FormGroup>
                        <DateRangePicker
                          label="Forecasted Availability*"
                          name="availablility_range"
                          onChange={handleDate}
                          labelType="NonFloating"
                          mode="single"
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
                              option.value === formData.asset_condition
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
                              (option) => option.value === formData.statuscode
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

export default Create;
