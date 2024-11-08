import React, {
  PropTypes,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DynamicToast from "components/Common/Toast";
import {
  Form,
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
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import DateRangePicker from "components/Common/DateRangePicker";
import { useParams } from "react-router-dom";
import { EndPointService } from "@/services/methods";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { GlobalContext } from "@/GlobalState";
import { subCategory } from "variables/common";
import { conditionOptions } from "variables/common";
import { categorycode1 } from "variables/common";
import AttachmentList from "components/Common/AttachmentList";
import { formatLocation } from "variables/common";
import { Tooltip } from "bootstrap"; // Import Bootstrap's Tooltip
import { currencyOptions } from "variables/common";
import { getUkUnits } from "variables/common";

const Show = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const [cities, setCities] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({
    id: "", // Initialize id based on mode
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

  const fetchInventoryById = async () => {
    try {
      setLoader(true);
      const headers = { user_id: sessionStorage.getItem("username") };
      const res = await EndPointService.getInventoryById(headers, id);
      setFormData(res.appRespData[0]);

      const resAttachment = await EndPointService.getAttachmentByAssetId(
        headers,
        id
      );
      setAttachments(resAttachment.appRespData);

      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const fetchCityData = async () => {
    try {
      const res = await EndPointService.getCityData();
      setCities(res.appRespData);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchInventoryById();
    fetchCityData();
  }, []);

  useEffect(() => {
    const initializeTooltips = () => {
      const tooltipTriggerList = document.querySelectorAll(
        '[data-bs-toggle="tooltip"]'
      );
      const tooltips = Array.from(tooltipTriggerList).map(
        (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
      );
      return tooltips;
    };

    const timeoutId = setTimeout(() => {
      const tooltips = initializeTooltips();
      // Cleanup tooltips on unmount
      return () => tooltips.forEach((tooltip) => tooltip.dispose());
    }, 300); // Slightly longer delay

    return () => clearTimeout(timeoutId);
  }, [formData.asset_location]);

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
                    Seller Information
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
                          readOnly="true"
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Contact No *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_contactno"
                          value={formData.seller_contactno}
                          readOnly="true"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label>Email Address *</Label>
                      <FormGroup
                        className={`has-label ${formData.seller_email}`}
                      >
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                          readOnly="true"
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Location *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_location"
                          value={formData.seller_location}
                          readOnly="true"
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
                    style={{
                      color: "rgb(82,203,206)",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      WebkitTextTransform: "capitalize",
                    }}
                  >
                    Category
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Category</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="categorycode1"
                          value={categorycode1.find(
                            (option) => option.value === formData.categorycode1
                          )}
                          onChange={(selectedOption) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              categorycode1: selectedOption.value,
                            }))
                          }
                          options={categorycode1}
                          placeholder="Select an option"
                          isDisabled="true"
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Sub Category</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="categorycode2"
                          value={subCategory.find(
                            (option) => option.value === formData.categorycode2
                          )}
                          onChange={(selectedOption) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              categorycode2: selectedOption.value,
                            }))
                          }
                          options={subCategory}
                          placeholder="Select an option"
                          isDisabled="true"
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
                    Item Information
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>ID</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="id"
                          value={formData.asset_id}
                          disabled
                          readOnly="true"
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Name *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_name"
                          value={formData.asset_name}
                          readOnly="true"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label>Description</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="description"
                          value={formData.description}
                          readOnly="true"
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <FormGroup>
                        <DateRangePicker
                          label="Forecasted Availability*"
                          name="availablility_range"
                          isdisabled={true}
                          selectedDate={formData.available_from}
                          labelType="NonFloating"
                          mode="single"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label>Condition *</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="asset_condition"
                          value={conditionOptions.find(
                            (option) =>
                              option.value === formData.asset_condition
                          )}
                          onChange={(selectedOption) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              asset_condition: selectedOption.value,
                            }))
                          }
                          options={conditionOptions}
                          placeholder="Select an option"
                          isDisabled="true"
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label>Maintenance Requirements *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="quantity"
                          value={formData.maintenance_requirements}
                          readOnly="true"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label>Quantity *</Label>
                      <FormGroup>
                        <InputGroup>
                          <Input
                            type="text"
                            name="quantity"
                            className="quantity-input"
                            value={formData.quantity}
                            readOnly="true"
                          />
                          <div style={{ width: "30%" }}>
                            <Select
                              options={getUkUnits}
                              name="quantity_unit"
                              classNamePrefix="unit-select"
                              isClearable={false}
                              isDisabled="true"
                              defaultValue={getUkUnits[0]}
                              placeholder="Measurement units.."
                              value={getUkUnits.find(
                                (option) =>
                                  option.value === formData.quantity_unit
                              )}
                            />
                          </div>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      {/* Single Label for the Entire Section */}
                      <Label className="required">
                        Location (City, Compound/Area/PostCode)
                      </Label>

                      <Row>
                        {/* City Field */}
                        <Col sm="4 pr-0">
                          <FormGroup>
                            <Select
                              name="statuscode"
                              options={cities.map((city) => ({
                                value: city.code,
                                label: city.name,
                              }))}
                              value={
                                cities.find(
                                  (city) =>
                                    city.code === formData.asset_location_city
                                )
                                  ? {
                                      value: formData.asset_location_city,
                                      label: cities.find(
                                        (city) =>
                                          city.code ===
                                          formData.asset_location_city
                                      ).name,
                                    }
                                  : null
                              }
                              isDisabled={true}
                            />
                          </FormGroup>
                        </Col>

                        {/* Area Field */}
                        <Col sm="8">
                          <FormGroup>
                            <Input
                              type="text"
                              placeholder="Compound/Area/PostCode"
                              name="asset_location"
                              data-bs-toggle="tooltip"
                              data-bs-placement="top"
                              title={formatLocation(formData.asset_location)}
                              value={formatLocation(formData.asset_location)}
                              readOnly="true"
                              style={{ cursor: "default" }}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label>Estimated Value *</Label>
                      <FormGroup>
                        <InputGroup>
                          <div className={{ width: "30%" }}>
                            <Select
                              options={currencyOptions}
                              name="negotiated_val_curr"
                              placeholder="Currency.."
                              defaultValue={currencyOptions[0]}
                              classNamePrefix="currency-select"
                              isClearable={false}
                              isDisabled="false"
                              value={currencyOptions.find(
                                (option) => option.value === formData.value_curr
                              )}
                            />
                          </div>
                          <Input
                            type="text"
                            name="value"
                            className="currency-input"
                            value={formData.value}
                            readOnly="true"
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="8">Other Details</Label>
                    <Col md="12">
                      <FormGroup>
                        <Input
                          type="textarea"
                          name="additional_info"
                          value={formData.additional_info}
                          style={{ width: "100%", height: "100%" }}
                          readOnly="true"
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
                    Images
                  </CardTitle>
                </CardHeader>
                <AttachmentList
                  attachments={attachments}
                  attachmentType="images"
                />
                {/* <CardBody>
                    <FileUpload
                      name="demo[]"
                      url="/api/upload"
                      multiple
                      accept="image/*"
                      maxFileSize={1000000}
                      emptyTemplate={<p className="m-0">{UPLOAD_TEXT}</p>}
                      disabled="true"
                      className="custom-file-upload"
                    />
                  </CardBody> */}
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
                    Documents
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <AttachmentList
                    attachments={attachments}
                    attachmentType="docs"
                  />
                  {/* <FileUpload
                      name="demo[]"
                      url={"/api/upload"}
                      multiple
                      accept="image/*"
                      maxFileSize={1000000}
                      className="custom-file-upload"
                      emptyTemplate={<p className="m-0">{UPLOAD_TEXT}</p>}
                      disabled="true"
                    /> */}
                </CardBody>
              </Card>
            </Col>
            {/* Set Asset Status */}
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
        </Form>
      </div>
    </>
  );
};

export default Show;
