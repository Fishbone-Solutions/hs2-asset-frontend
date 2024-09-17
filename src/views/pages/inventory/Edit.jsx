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
import { useNavigate } from "react-router-dom";
import { categorycode1 } from "variables/common";
import { subCategory } from "variables/common";
import { inventoryStatusOptions } from "variables/common";
import { conditionOptions } from "variables/common";
import { FileUpload } from "primereact/fileupload";
import AttachmentList from "components/Common/AttachmentList";
import { DocumentType } from "variables/common";
import { useAlert } from "components/Common/NotificationAlert";

import { RiAttachment2 } from "react-icons/ri";

const Edit = () => {
  const { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const [attachments, setAttachments] = useState([]);
  const [deletedAttachmentsIds, setDeletedAttachmentsIds] = useState([]);

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const [files, setFiles] = useState([]);

  const [docs, setDocs] = useState([]);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: "", // Initialize id based on mode
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

  const handleFormSubmission = async () => {
    showAlert({
      title: "Are you sure?",
      type: "warning",
      onConfirm: () => handleUpdateInventory(),
      onCancel: hideAlert,
    });
  };

  const handleUpdateInventory = async () => {
    try {
      setLoader(true);
      const headers = {
        user_id: sessionStorage.getItem("username"),
        "Content-Type": "multipart/form-data",
      };

      const formDataWithFiles = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataWithFiles.append(key, formData[key]);
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
        title: `Item '${formData.asset_name}' updated to Inventory.`,
        content: `Asset ID = ${id}`,
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
  }, []);

  const onUploadImages = (event) => {
    const files = Array.from(event.files);
    setFiles(files);
    console.log("images", event.files, files);
  };
  const onUploadDocs = (event) => {
    const checkValidation = onFileUpload(event, 3, DocumentType);
    console.log("checkValidation", checkValidation);
    if (checkValidation) {
      const files = Array.from(event.files);
      setDocs(files);
      console.log("onuploadodcs");
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seller_title: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seller_contactno: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seller_email: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              seller_location: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              asset_name: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              description: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              asset_location: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              value: e.target.value,
                            })
                          }
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
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              additional_info: e.target.value,
                            })
                          }
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
                  <AttachmentList
                    attachments={attachments}
                    attachmentType="images"
                    showDeleteIcon="true"
                    onDelete={handleDeleteAttachment}
                  />

                  <FileUpload
                    name="files[]"
                    multiple
                    accept="image/*"
                    onSelect={onUploadImages}
                    chooseLabel={
                      <span>
                        <RiAttachment2 className="me-1" /> {/* Add the icon */}
                        Attach
                      </span>
                    }
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
                    onSelect={onUploadDocs}
                    className="custom-file-upload"
                    chooseLabel={
                      <span>
                        <RiAttachment2 className="me-1" /> {/* Add the icon */}
                        Attach
                      </span>
                    }
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
                      <Label>Status *</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="statuscode"
                          value={inventoryStatusOptions.find(
                            (option) => option.value === formData.statuscode
                          )}
                          onChange={(selectedOption) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              statuscode: selectedOption.value,
                            }))
                          }
                          options={inventoryStatusOptions}
                          placeholder="Select an option"
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
            <Button
              className="buttonClose"
              color="primary"
              onClick={handleFormSubmission}
              style={{ visibility: "visible", opacity: 1 }}
            >
              Update
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Edit;
