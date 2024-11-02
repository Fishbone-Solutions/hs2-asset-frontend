import React, {
  PropTypes,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DynamicToast from "components/Common/Toast";
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
  InputGroup,
  InputGroupText,
  Popover,
  PopoverBody,
} from "reactstrap";
import Select from "react-select";
import DateRangePicker from "components/Common/DateRangePicker";
import { useParams } from "react-router-dom";
import { EndPointService } from "@/services/methods";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { GlobalContext } from "@/GlobalState";
import { useNavigate } from "react-router-dom";
import { categorycode1 } from "variables/common";
import { subCategory } from "variables/common";
import { inventoryStatusOptions } from "variables/common";
import { conditionOptions } from "variables/common";
import { FileUpload } from "primereact/fileupload";
import AttachmentList from "components/Common/AttachmentList";
import { DocumentType } from "variables/common";
import { useAlert } from "components/Common/NotificationAlert";
import moment from "moment";
import { RiAttachment2 } from "react-icons/ri";
import { ErrorMessage, Field, Formik, Form, useFormikContext } from "formik";
import {
  initialInventoryValues,
  inventorySchema,
} from "variables/Validations/InventorySchema";
import { ImageType } from "variables/common";
import { handleInput } from "variables/common";
import AttachmentPreview from "components/Common/AttachmentPreview";
import InfoBulb from "components/svg/InfoBulb";

const Edit = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const [attachments, setAttachments] = useState([]);
  const [deletedAttachmentsIds, setDeletedAttachmentsIds] = useState([]);

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const [refreshImageComponent, setRefreshImageComponent] = useState(0);
  const [files, setFiles] = useState([]);

  const [popoverOpen, setPopoverOpen] = useState(false);

  const togglePopover = () => setPopoverOpen(!popoverOpen);

  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialInventoryValues);
  const [cities, setCities] = useState([]);

  const fetchInventoryById = async () => {
    try {
      setLoader(true);
      const headers = { user_id: sessionStorage.getItem("username") };
      const res = await EndPointService.getInventoryById(headers, id);
      setFormData(res.appRespData[0]);

      console.log(formData);

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

  const handleFormSubmission = async (values, { setSubmitting }) => {
    showAlert({
      title: <h4 className="sweet-alert-sure">Are you sure?</h4>,
      type: "warning",
      onConfirm: () => handleUpdateInventory(values),
      onCancel: hideAlert,
    });
  };

  const handleUpdateInventory = async (values) => {
    try {
      setLoader(true);
      const headers = {
        user_id: sessionStorage.getItem("username"),
        "Content-Type": "multipart/form-data",
      };

      const formDataWithFiles = new FormData();
      Object.keys(values).forEach((key) => {
        let value = values[key];

        // Check if the key is 'available_form' and if the value is a valid date
        if (key === "available_from") {
          // Format the date to your desired format, e.g., 'YYYY-MM-DD'
          value = moment(value).format("DD/MM/YYYY");
        } else if (key === "date_of_purchase") {
          value = moment(value).format("DD/MM/YYYY");
        } else if (key === "sold_value" && value === "null") {
          value = "";
        }

        // Append the value (formatted or not) to the formDataWithFiles object
        formDataWithFiles.append(key, value);
      });
      files.forEach((file) => {
        formDataWithFiles.append("files[]", file);
      });

      docs.forEach((file) => {
        formDataWithFiles.append("docs[]", file);
      });
      formDataWithFiles.append("deletedIds", deletedAttachmentsIds);
      console.log(formDataWithFiles);
      const res = await EndPointService.updateInventory(
        headers,
        id,
        formDataWithFiles
      );

      setLoader(false);
      showAlert({
        title: (
          <h6 className="sweet-title-size sweet-title-padding">
            Item '{formData.asset_name}' updated
          </h6>
        ),
        content: null,
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          navigate("/admin/inventory");
        },
      });
    } catch (e) {
      console.log(e);
      setLoader(false);
    }
  };

  useEffect(() => {
    console.log("useEffect");
    fetchInventoryById();
    fetchCityData();
    console.log(formData);
  }, []);

  const onUploadImages = (event) => {
    console.log("repeat", event);
    const maxFiles =
      5 - attachments.filter((att) => att.att_type === "images").length;
    const validation = onFileUpload(event, maxFiles, 5, ImageType, "image");
    console.log("validation", validation);
    if (files.length < maxFiles) {
      setRefreshImageComponent(refreshImageComponent + 1);
      if (validation) {
        const filesData = Array.from(event.files);
        // Take only up to the limit
        const limitedFiles = filesData.slice(0, maxFiles);
        //const files = Array.from(event.files);
        setFiles((prevFiles) => [
          ...prevFiles,
          ...limitedFiles, // Assuming `limitedFiles` is an array of selected and validated files
        ]);
      }
    } else {
      setRefreshImageComponent(refreshImageComponent + 1);
      showAlert({
        title: (
          <p class="sweet-title-size sweet-title-padding">
            You can only upload a maximum of {maxFiles} files
          </p>
        ),
        type: "error",
        onConfirm: () => hideAlert(),
        confirmText: "Ok",
        showCancelButton: false,
      });
    }
  };
  const onUploadDocs = (event) => {
    const checkValidation = onFileUpload(
      event,
      3 - attachments.filter((att) => att.att_type === "docs").length,
      3,
      DocumentType
    );
    console.log("checkValidation", checkValidation);
    if (checkValidation) {
      const files = Array.from(event.files);
      setDocs(files);
    }
  };

  const handleDeleteAttachment = (id) => {
    setAttachments(
      attachments.filter((attachment) => attachment.att_id !== id)
    );
    // Add the deleted attachment ID to the deletedAttachmentsIds array
    setDeletedAttachmentsIds((prevIds) => [...prevIds, id]);
  };

  const onFileUpload = (
    event,
    maxFiles = 2,
    totalFiles = 5,
    allowedExtensions = [".pdf", ".docx"],
    type,
    maxSize = 2000000
  ) => {
    console.log("hello", event);
    const files = event.files;

    // Limit number of files
    if (files.length > maxFiles) {
      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding">
            You can only upload a maximum of {totalFiles} files
          </p>
        ),
        type: "error",
        onConfirm: () => hideAlert(),
        confirmText: "Ok",
        showCancelButton: false,
      });
      return;
    }

    for (let file of files) {
      // Check file type
      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        showAlert({
          title: (
            <p className="sweet-title-size sweet-title-padding">
              {type === "image"
                ? `File type ${fileExtension} is not supported. Please upload Images only in .png, .jpeg, .jpg, .bmp`
                : `File type ${fileExtension} is not supported. Please upload Documents only in Text, Word, Excel, Pdf format`}
            </p>
          ),
          type: "error",
          onConfirm: () => hideAlert(),
          confirmText: "Ok",
          showCancelButton: false,
        });
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        setToastType("error");
        setToastMessage(
          `File size exceeds the ${maxSize / 1000000}MB limit: ${file.name}`
        );
        return;
      }
    }
    return true;
  };

  // Handle deleting an image
  const deleteImage = (imageIndex) => {
    console.log("deleteImages");
    // Remove the image from the state
    const updatedImages = files.filter((_, index) => index !== imageIndex);
    // Update the state and re-trigger the onUploadImages to handle the updated list
    setFiles(updatedImages);
    // Optional: you can call onUploadImages again if necessary for further processing
  };

  // Handle deleting an image
  const deleteDocs = (imageIndex) => {
    console.log("deleteDocs");
    // Remove the image from the state
    const updatedImages = docs.filter((_, index) => index !== imageIndex);
    // Update the state and re-trigger the onUploadImages to handle the updated list
    setDocs(updatedImages);
    // Optional: you can call onUploadImages again if necessary for further processing
  };

  const handleDate = (date) => {
    setFormData((preiousState) => ({
      ...preiousState,
      available_from: date,
    }));
  };

  const handleSoldToast = (selectedStatus) => {
    if (selectedStatus === "Sold") {
      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding ">
            Please enter the final Sold Value
          </p>
        ),
        type: "info",
        showCancelButton: false,
        confirmText: "ok",
        onConfirm: () => hideAlert(),
      });
    }
  };

  const [formSubmission, setFormSubmission] = useState(false);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    console.log(errorCount, formSubmission);

    if (errorCount > 0 && formSubmission) {
      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding">
            Please fill all mandatory fields
          </p>
        ),
        type: "error",
        onConfirm: () => hideAlert(),
        confirmText: "Ok",
        showCancelButton: false,
      });

      setFormSubmission(false);
    }
  }, [formSubmission, errorCount]); // Run whenever errors change

  return (
    <>
      <div className="content">
        <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        />
        {alert}
        {loader ? <FullPageLoader /> : ""}
        <Formik
          initialValues={formData}
          validationSchema={inventorySchema}
          onSubmit={handleFormSubmission}
          enableReinitialize={true}
        >
          {({ errors, values, setFieldValue }) => {
            useEffect(() => {
              setErrorCount(Object.keys(errors).length);
            }, [errors]); // Run whenever errors change

            return (
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
                            <Label className="required">Seller Title</Label>
                            <FormGroup>
                              <Field
                                type="text"
                                name="seller_title"
                                maxLength={40}
                                onInput={handleInput("alphaNumeric")}
                                as={Input}
                              />
                              <ErrorMessage
                                name="seller_title"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>

                          <Col sm="6">
                            <Label className="required">Contact No </Label>
                            <FormGroup>
                              <Field
                                type="text"
                                maxLength={15}
                                onInput={handleInput("numericPlus")}
                                name="seller_contactno"
                                as={Input}
                              />
                              <ErrorMessage
                                name="seller_contactno"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="6">
                            <Label className="required">Email Address </Label>
                            <FormGroup>
                              <Field
                                type="email"
                                name="seller_email"
                                maxLength={40}
                                as={Input}
                              />
                              <ErrorMessage
                                name="seller_email"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>

                          <Col sm="6">
                            <Label className="required">Location </Label>
                            <FormGroup>
                              <Field
                                type="text"
                                name="seller_location"
                                onInput={handleInput("alphaNumericDash")}
                                maxLength={60}
                                as={Input}
                              />
                              <ErrorMessage
                                name="seller_location"
                                component="div"
                                className="text-danger"
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
                            <Label className="required">Category</Label>
                            <FormGroup>
                              <Select
                                name="categorycode1"
                                options={categorycode1}
                                value={categorycode1.find(
                                  (option) =>
                                    option.value === values.categorycode1
                                )}
                                onChange={(selectedOption) =>
                                  setFieldValue(
                                    "categorycode1",
                                    selectedOption.value
                                  )
                                }
                              />
                              <ErrorMessage
                                name="categorycode1"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>

                          <Col sm="6">
                            <Label className="required">Sub Category</Label>
                            <FormGroup>
                              <Select
                                name="categorycode2"
                                options={subCategory}
                                value={subCategory.find(
                                  (option) =>
                                    option.value === values.categorycode2
                                )}
                                onChange={(selectedOption) =>
                                  setFieldValue(
                                    "categorycode2",
                                    selectedOption.value
                                  )
                                }
                              />
                              <ErrorMessage
                                name="categorycode2"
                                component="div"
                                className="text-danger"
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
                              <Field
                                type="text"
                                name="id"
                                as={Input}
                                disabled
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="6">
                            <Label>Reference Code</Label>
                            <FormGroup>
                              <Field
                                type="text"
                                onInput={handleInput("alphaNumericDashSlash")}
                                maxLength={15}
                                name="code"
                                as={Input}
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="6">
                            <Label className="required">Name </Label>
                            <FormGroup>
                              <Field
                                type="text"
                                maxLength={40}
                                name="asset_name"
                                id="assetNameField"
                                onInput={handleInput("alphaNumeric")}
                                onClick={() => setPopoverOpen(true)}
                                onBlur={() => setPopoverOpen(false)}
                                as={Input}
                                autoComplete="new-password"
                              />
                              <ErrorMessage
                                name="asset_name"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>

                            <Popover
                              placement="bottom"
                              isOpen={popoverOpen}
                              target="assetNameField"
                              toggle={togglePopover}
                            >
                              <PopoverBody>
                                <div className="d-flex flex-column align-items-center text-center">
                                  <InfoBulb
                                    width="35"
                                    height="35"
                                    className="mb-3"
                                  />

                                  <h6 className="popover-text">
                                    Buyers most commonly search for items by
                                    Name. Therefore, it is recommended to type
                                    in a name that is short and common.
                                  </h6>
                                  <h6 className="popover-text">
                                    Imagine what you as a Buyer would type in
                                    the search if you were looking for this
                                    item.
                                  </h6>
                                </div>
                              </PopoverBody>
                            </Popover>
                          </Col>
                          <Col sm="6">
                            <Label className="required">Description</Label>
                            <FormGroup>
                              <Field
                                type="text"
                                name="description"
                                onInput={handleInput("alphaNumeric")}
                                maxLength={50}
                                as={Input}
                              />
                              <ErrorMessage
                                name="description"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>

                        <Row>
                          <Col sm="6">
                            <Label className="required">Condition </Label>
                            <FormGroup>
                              <Select
                                name="asset_condition"
                                options={conditionOptions}
                                value={conditionOptions.find(
                                  (option) =>
                                    option.value === values.asset_condition
                                )}
                                onChange={(selectedOption) =>
                                  setFieldValue(
                                    "asset_condition",
                                    selectedOption.value
                                  )
                                }
                              />
                              <ErrorMessage
                                name="asset_condition"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="6">
                            <Label>Maintenance Requirements </Label>
                            <FormGroup>
                              <Field
                                type="text"
                                maxLength={60}
                                onInput={handleInput("alphaNumericDashSlash")}
                                name="maintenance_requirements"
                                as={Input}
                              />
                              <ErrorMessage
                                name="maintenance_requirements"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="6">
                            <Label className="required">Quantity </Label>
                            <FormGroup>
                              <Field
                                type="text"
                                maxLength={20}
                                onInput={handleInput("alphaNumericDashSlash")}
                                name="quantity"
                                as={Input}
                              />
                              <ErrorMessage
                                name="quantity"
                                component="div"
                                className="text-danger"
                              />
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
                                          city.code ===
                                          values.asset_location_city
                                      )
                                        ? {
                                            value: values.asset_location_city,
                                            label: cities.find(
                                              (city) =>
                                                city.code ===
                                                values.asset_location_city
                                            ).name,
                                          }
                                        : null
                                    }
                                    onChange={(selectedOption) =>
                                      setFieldValue(
                                        "asset_location_city",
                                        selectedOption.value
                                      )
                                    }
                                    onInputChange={(e) =>
                                      handleInput("alphabets")(e)
                                    }
                                  />
                                  <ErrorMessage
                                    name="asset_location_city"
                                    component="div"
                                    className="text-danger"
                                  />
                                </FormGroup>
                              </Col>

                              {/* Area Field */}
                              <Col sm="8">
                                <FormGroup>
                                  <Field
                                    type="text"
                                    placeholder="Compound/Area/PostCode"
                                    name="asset_location"
                                    onInput={handleInput(
                                      "alphaNumericDashSlash"
                                    )}
                                    maxLength={60}
                                    as={Input}
                                    className="form-control"
                                  />
                                  <ErrorMessage
                                    name="asset_location"
                                    component="div"
                                    className="text-danger"
                                  />
                                </FormGroup>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="6">
                            <Label className="required">Estimated Value </Label>
                            <FormGroup>
                              <InputGroup>
                                <InputGroupText>£</InputGroupText>
                                <Field
                                  type="text"
                                  name="value"
                                  maxLength={7}
                                  onInput={handleInput("numeric")}
                                  as={Input}
                                  min="0" // Ensures no negative values
                                  step="0.01" // Allows decimal/floating-point values
                                />
                              </InputGroup>
                              <ErrorMessage
                                name="value"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="6">
                            <FormGroup>
                              <DateRangePicker
                                label="Forecasted Availability"
                                requireLabel={true}
                                name="available_from"
                                labelType="NonFloating"
                                selectedDate={values.available_from}
                                onChange={(date) =>
                                  setFieldValue("available_from", date)
                                }
                                mode="single"
                              />
                              <ErrorMessage
                                name="available_from"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="6">
                            <FormGroup>
                              <DateRangePicker
                                label="Purchase Date "
                                name="date_of_purchase"
                                labelType="NonFloating"
                                selectedDate={values.date_of_purchase}
                                onChange={(date) =>
                                  setFieldValue("date_of_purchase", date)
                                }
                                mode="single"
                              />
                              <ErrorMessage
                                name="date_of_purchase"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="6">
                            <Label>Purchase Value </Label>
                            <FormGroup>
                              <InputGroup>
                                <InputGroupText>£</InputGroupText>
                                <Field
                                  type="text"
                                  name="purchase_price"
                                  maxLength={7}
                                  onInput={handleInput("numeric")}
                                  as={Input}
                                  min="0" // Ensures no negative values
                                  step="0.01" // Allows decimal/floating-point values
                                />
                              </InputGroup>
                              <ErrorMessage
                                name="purchase_price"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="6">
                            <Label>Contract No </Label>
                            <FormGroup>
                              <Field
                                type="text"
                                name="contract_no"
                                onInput={handleInput("alphaNumericDashSlash")}
                                maxLength={15}
                                as={Input}
                              />
                              <ErrorMessage
                                name="contract_no"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="6">
                            <Label>Residual Forecast Value </Label>
                            <FormGroup>
                              <InputGroup>
                                <InputGroupText>£</InputGroupText>
                                <Field
                                  type="text"
                                  maxLength={7}
                                  onInput={handleInput("numeric")}
                                  name="residual_forecast_value"
                                  as={Input}
                                />
                              </InputGroup>
                              <ErrorMessage
                                name="residual_forecast_value"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="6">
                            <Label>Sold Value </Label>
                            <FormGroup>
                              <InputGroup>
                                <InputGroupText>£</InputGroupText>
                                <Field
                                  type="text"
                                  name="sold_value"
                                  maxLength={7}
                                  onInput={handleInput("numeric")}
                                  value={
                                    values.sold_value === "null"
                                      ? ""
                                      : values.sold_value
                                  }
                                  disabled={values.statuscode !== "Sold"}
                                  as={Input}
                                />
                              </InputGroup>
                              <ErrorMessage
                                name="sold_value"
                                component="div"
                                className="text-danger"
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Label sm="8">Other Details</Label>
                          <Col md="12">
                            <FormGroup>
                              <Field
                                type="textarea"
                                onInput={handleInput("alphaNumericDescription")}
                                name="additional_info"
                                as={Input}
                              />
                              <ErrorMessage
                                name="additional_info"
                                component="div"
                                className="text-danger"
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
                          Images{" "}
                          <span className="upload-image-notification text-danger">
                            (Max 5, Upto 2MB each)
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <AttachmentList
                          attachments={attachments}
                          attachmentType="images"
                          showDeleteIcon="true"
                          onDelete={handleDeleteAttachment}
                        />

                        <FileUpload
                          name="files[]"
                          key={refreshImageComponent}
                          multiple
                          accept="image/*"
                          chooseLabel={
                            <span>
                              <RiAttachment2 className="me-1" />{" "}
                              {/* Add the icon */}
                              Attach
                            </span>
                          }
                          onSelect={onUploadImages}
                          maxFileSize={2000000}
                          itemTemplate={() => null}
                          className="custom-file-upload"
                        />
                        <AttachmentPreview
                          files={files}
                          deleteFile={deleteImage}
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
                          Documents{" "}
                          <span className="upload-image-notification text-danger">
                            (Max 3, Upto 2MB each)
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <AttachmentList
                          attachments={attachments}
                          attachmentType="docs"
                          showDeleteIcon="true"
                          onDelete={handleDeleteAttachment}
                        />

                        <FileUpload
                          name="docs[]"
                          multiple
                          accept=".pdf, .doc, .docx, .odt, .txt"
                          maxFileSize={2000000}
                          chooseLabel={
                            <span>
                              <RiAttachment2 className="me-1" />{" "}
                              {/* Add the icon */}
                              Attach
                            </span>
                          }
                          onSelect={onUploadDocs}
                          className="custom-file-upload"
                          itemTemplate={() => null}
                          customUpload
                        />
                        <AttachmentPreview
                          files={docs}
                          deleteFile={deleteDocs}
                        />
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
                                name="statuscode"
                                options={inventoryStatusOptions}
                                value={inventoryStatusOptions.find(
                                  (option) => option.value === values.statuscode
                                )}
                                onChange={(selectedOption) => {
                                  setFieldValue(
                                    "statuscode",
                                    selectedOption.value
                                  );
                                  handleSoldToast(selectedOption.value);
                                }}
                              />
                              <ErrorMessage
                                name="statuscode"
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
                    type="button"
                    onClick={() => navigate("/admin/inventory")}
                    style={{ visibility: "visible", opacity: 1 }}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      console.log(Object.keys(errors).length);
                      setFormSubmission(true);
                    }}
                    color="primary"
                    type="submit"
                  >
                    Save
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default Edit;
