import React, { useContext, useEffect, useState } from "react";
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
} from "reactstrap";
import Select from "react-select";
import DateRangePicker from "components/Common/DateRangePicker";
import { useParams } from "react-router-dom";
import { EndPointService } from "@/services/methods";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { GlobalContext } from "@/GlobalState";
import { subCategory, conditionOptions, categorycode1 } from "variables/common";
import AttachmentList from "components/Common/AttachmentList";

const Show = () => {
  const { inventoryId } = useParams();
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const { username } = useContext(GlobalContext);

  const [attachments, setAttachments] = useState([]);
  const [formData, setFormData] = useState({
    id: "",
    asset_id: "",
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
      const res = await EndPointService.getInventoryById(headers, inventoryId);
      setFormData(res.appRespData[0]);

      const resAttachment = await EndPointService.getAttachmentByAssetId(
        headers,
        inventoryId
      );
      setAttachments(resAttachment.appRespData);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchInventoryById();
  }, []);

  return (
    <>
      <div className="content">
        {toastType && <DynamicToast type={toastType} message={toastMessage} />}
        {loader && <FullPageLoader />}
        <Form>
          {formData && formData.seller_title ? (
            <Row>
              {/* Asset Seller Detail */}
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
                            readOnly
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
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <Label>Email Address *</Label>
                        <FormGroup>
                          <Input
                            type="text"
                            name="seller_email"
                            value={formData.seller_email}
                            readOnly
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
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {/* Category Detail */}
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
                              (option) =>
                                option.value === formData.categorycode1
                            )}
                            onChange={(selectedOption) =>
                              setFormData((prevState) => ({
                                ...prevState,
                                categorycode1: selectedOption.value,
                              }))
                            }
                            options={categorycode1}
                            placeholder="Select an option"
                            isDisabled
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
                              (option) =>
                                option.value === formData.categorycode2
                            )}
                            onChange={(selectedOption) =>
                              setFormData((prevState) => ({
                                ...prevState,
                                categorycode2: selectedOption.value,
                              }))
                            }
                            options={subCategory}
                            placeholder="Select an option"
                            isDisabled
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {/* Item Information */}
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
                            readOnly
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
                            readOnly
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
                            readOnly
                          />
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <FormGroup>
                          <DateRangePicker
                            label="Forecasted Availability*"
                            name="availablility_range"
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
                            isDisabled
                          />
                        </FormGroup>
                      </Col>
                      <Col sm="6">
                        <Label>Quantity *</Label>
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
                      <Col sm="6">
                        <Label>Location *</Label>
                        <FormGroup>
                          <Input
                            type="text"
                            name="asset_location"
                            value={formData.asset_location}
                            readOnly
                          />
                        </FormGroup>
                      </Col>

                      <Col sm="6">
                        <Label>Estimated Value *</Label>
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
                      <Label sm="8">Other Details</Label>
                      <Col md="12">
                        <FormGroup>
                          <Input
                            type="textarea"
                            name="additional_info"
                            value={formData.additional_info}
                            style={{ width: "100%", height: "100%" }}
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              {/* Upload Images */}
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
                      Images
                    </CardTitle>
                  </CardHeader>
                  {/* Uncomment the FileUpload component when needed */}
                  <CardBody>
                    <AttachmentList
                      attachments={attachments}
                      attachmentType="images"
                    />
                  </CardBody>
                </Card>
              </Col>
              {/* Upload Documents */}
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
                      Documents
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    {/* Uncomment the FileUpload component when needed */}
                    <AttachmentList
                      attachments={attachments}
                      attachmentType="docs"
                    />
                  </CardBody>
                </Card>
              </Col>
              {/* Set Asset Status */}
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
            </Row>
          ) : (
            <h4>Complete information is no longer available.</h4>
          )}
        </Form>
      </div>
    </>
  );
};

export default Show;
