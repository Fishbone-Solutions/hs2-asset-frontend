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
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import DateRangePicker from "components/Common/DateRangePicker";
import { inventoryStatusOptions, DocumentType } from "variables/common";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { GlobalContext } from "@/GlobalState";
import { useNavigate } from "react-router-dom";
import { categorycode1 } from "variables/common";
import { conditionOptions } from "variables/common";
import { subCategory } from "variables/common";
import { FileUpload } from "primereact/fileupload";
import { useAlert } from "components/Common/NotificationAlert";
import { RiAttachment2 } from "react-icons/ri";
import { ImageType } from "variables/common";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  initialInventoryValues,
  inventorySchema,
} from "variables/Validations/InventorySchema";
import moment from "moment";

const Create = () => {
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const navigate = useNavigate();
  const headers = {
    user_id: sessionStorage.getItem("username"),
    "Content-Type": "multipart/form-data",
  };
  const [files, setFiles] = useState([]);

  const [docs, setDocs] = useState([]);
  const [cities, setCities] = useState([]);

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here

  const handleFormSubmission = async (values, { setSubmitting }) => {
    console.log("value", values);
    showAlert({
      title: "Are you sure?",
      type: "warning",
      onConfirm: () => successSubmit(values),
      onCancel: hideAlert,
    });
  };

  const fetchCityData = async () => {
    try {
      const res = await EndPointService.getCityData();
      console.log('city', res);
      setCities(res.appRespData);
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    fetchCityData();
  }, []);

  const successSubmit = async (values) => {
    try {
      setLoader(true);
      const formDataWithFiles = new FormData();
      Object.keys(values).forEach((key) => {
        let value = values[key];

        // Check if the key is 'available_form' and if the value is a valid date
        if (key === "available_from") {
          // Format the date to your desired format, e.g., 'YYYY-MM-DD'
          value = moment(value).format("DD/MM/YYYY");
        } else if (key === "date_of_purchase") {
          value = moment(value).format("DD/MM/YYYY");
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

      const res = await EndPointService.createInventory(
        headers,
        formDataWithFiles
      );
      setLoader(false);
      showAlert({
        title: (
          <h6 className="success-sweet-title">
             Item '{values.asset_name}' added to inventory.
          </h6>
        ),
        content: (
          <h6 className="success-sweet-content-color">
            Item ID = {res.appRespData.asset_id}
          </h6>
        ),
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
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  // const handleDate = (date) => {
  //   setFormData((preiousState) => ({
  //     ...preiousState,
  //     available_from: date,
  //   }));
  // };

  const onUploadImages = (event) => {
    console.log("repeat", event);
    const maxFiles = 5;
    onFileUpload(event, maxFiles, ImageType);
    const files = Array.from(event.files);
    // Take only up to the limit
    const limitedFiles = files.slice(0, maxFiles);
    //const files = Array.from(event.files);
    setFiles(limitedFiles);
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
    const updatedImages = files.filter((_, index) => index !== imageIndex);
    // Update the state and re-trigger the onUploadImages to handle the updated list
    setDocs(updatedImages);
    // Optional: you can call onUploadImages again if necessary for further processing
  };

  const onUploadDocs = (event) => {
    const maxFiles = 3;
    onFileUpload(event, maxFiles, DocumentType);

    const files = Array.from(event.files);
    // Take only up to the limit
    const limitedFiles = files.slice(0, maxFiles);
    setDocs(limitedFiles);
  };

  const onFileUpload = (
    event,
    maxFiles = 2,
    allowedExtensions = [".pdf", ".docx"],
    maxSize = 2000000
  ) => {
    console.log("hello", event);
    const files = event.files;

    // Limit number of files
    if (files.length > maxFiles) {
      setToastType("error");
      setToastMessage(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    for (let file of files) {
      // Check file type
      const fileExtension = file.name
        .substring(file.name.lastIndexOf("."))
        .toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        setToastType("error");
        setToastMessage(
          `Invalid file type: ${file.name}. Only ${allowedExtensions.join(", ")} files are allowed.`
        );
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

  const handleValidationFailure = async (values) => {
    console.log(values, "submitting");
    const errors = {};

    try {
      // Wait for yup validation to complete
      await inventorySchema.validate(values, { abortEarly: false });
    } catch (validationErrors) {
      // Collect errors from yup validation
      validationErrors.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
    }
    console.log(Object.keys(errors).length);
    // If there are errors, trigger the toast notification
    if (Object.keys(errors).length > 0) {
      setToastType("error");
      setToastMessage("Please fill all fields properly.");
    }

    console.log(errors);

    return errors; // Return the errors to formik for further handling
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
        <Formik
          initialValues={initialInventoryValues}
          validationSchema={inventorySchema}
          onSubmit={handleFormSubmission}
          //validate={handleValidationFailure}
        >
          {({ values, setFieldValue }) => (
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
                            <Field type="text" name="seller_title" as={Input} />
                            <ErrorMessage
                              name="seller_title"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <Label className="required">Contact No</Label>
                          <FormGroup>
                            <Field
                              type="text"
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
                            <Field type="text" name="id" as={Input} disabled />
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <Label>Reference Code</Label>
                          <FormGroup>
                            <Field type="text" name="code" as={Input} />
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <Label className="required">Name </Label>
                          <FormGroup>
                            <Field type="text" name="asset_name" as={Input} />
                            <ErrorMessage
                              name="asset_name"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <Label className="required">Description</Label>
                          <FormGroup>
                            <Field type="text" name="description" as={Input} />
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
                            <Field type="text" name="quantity" as={Input} />
                            <ErrorMessage
                              name="quantity"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          {/* Single Label for the Entire Section */}
                          <Label className="required">Location</Label>

                          <Row>
                            {/* City Field */}
                            <Col sm="4 pr-0">

                            <FormGroup>
                            <Select
                              name="statuscode"
                              options={cities.map((city) => ({
                                value: city.code,
                                label: city.name
                              }))}
                              value={cities.find(
                                (city) => city.value === values.asset_location_city
                              )}
                              onChange={(selectedOption) =>
                                setFieldValue(
                                  "asset_location_city",
                                  selectedOption.value
                                )
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
                                  placeholder="Area, Street and postcode"
                                  name="asset_location"
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
                                type="number"
                                name="value"
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
                          <Label>Purcahse Value </Label>
                          <FormGroup>
                            <InputGroup>
                              <InputGroupText>£</InputGroupText>
                              <Field
                                type="number"
                                name="purchase_price"
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
                            <Field type="text" name="contract_no" as={Input} />
                            <ErrorMessage
                              name="contract_no"
                              component="div"
                              className="text-danger"
                            />
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <Label>Residual Forcast Value </Label>
                          <FormGroup>
                          <InputGroup>
                          <InputGroupText>£</InputGroupText>
                            <Field
                              type="number"
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
                            <Field type="number" name="sold_value" disabled as={Input} />
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
                        Images
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
                      <FileUpload
                        name="files[]"
                        multiple
                        accept="image/*"
                        chooseLabel={
                          <span>
                            <RiAttachment2 className="me-1" /> Attach
                          </span>
                        }
                        onSelect={onUploadImages}
                        onRemove={deleteImage}
                        maxFileSize={2000000}
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
                        Documents
                      </CardTitle>
                    </CardHeader>
                    <CardBody>
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
                        onRemove={deleteDocs}
                        className="custom-file-upload"
                        customUpload
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
                          <Label className="required">Status </Label>
                          <FormGroup>
                            <Select
                              name="statuscode"
                              options={inventoryStatusOptions}
                              value={inventoryStatusOptions.find(
                                (option) => option.value === values.statuscode
                              )}
                              onChange={(selectedOption) =>
                                setFieldValue(
                                  "statuscode",
                                  selectedOption.value
                                )
                              }
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
                <Button color="primary" type="submit">
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Create;
