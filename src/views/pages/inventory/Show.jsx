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
} from "reactstrap";
import Select from "react-select";
import DateRangePicker from "components/Common/DateRangePicker";
import { useParams } from "react-router-dom";
import { EndPointService } from "@/services/methods";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { GlobalContext } from "@/GlobalState";

const Show = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
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

  const fetchInventoryById = async () => {
    try {
      setLoader(true);
      const headers = { user_id: username };
      const res = await EndPointService.getInventoryById(headers, id);
      console.log(res);
      setLoader(false);
      setFormData(res.appRespData[0]);
      setToastType("success");
      setToastMessage(res.appRespMessage);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  useEffect(() => {
    console.log("useEffect");
    fetchInventoryById();
  }, []);

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
                          value={" Auto Generated"}
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
                          isDisabled="true"
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
                          readOnly="true"
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
                          readOnly="true"
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
                          readOnly="true"
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
                    Item Status
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Status *</Label>
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
                          isDisabled="true"
                          required
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
        </Form>
      </div>
    </>
  );
};

export default Show;
