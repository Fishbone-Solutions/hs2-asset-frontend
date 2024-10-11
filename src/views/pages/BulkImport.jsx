import React, { useContext, useState, useEffect } from "react";
import DynamicToast from "components/Common/Toast";
import { FileUpload } from "primereact/fileupload";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Progress,
  Label,
  Button,
} from "reactstrap";
import { GlobalContext } from "@/GlobalState";
import { FullPageLoader } from "components/Common/ComponentLoader";
import { EndPointService } from "@/services/methods";

const BulkImport = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [DataResponse, setData] = useState();
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [selectedOption, setSelectedOption] = useState(".csv"); // Default value
  const [fileUploaded, setFileUploaded] = useState(false);
  const { username } = useContext(GlobalContext);
  const [fileFormatVerification, setFileFormatVerification] = useState([]);
  const [totalRecordsFound, setTotalRecordsFound] = useState([]);
  const [totalRecordsParsed, setTotalRecordsParsed] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const headers = {
    'Content-Type': 'multipart/form-data',
    user_id: sessionStorage.getItem("username"),
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const onFileUpload = (
    event,
    maxFiles = 1,
    allowedExtensions = [selectedOption],
    maxSize = 9000000000000000
  ) => {
    const files = event.files;

    if (!files || !Array.isArray(files) || files.length === 0) {
      setToastType("error");
      setToastMessage("No files selected.");
      return false;
    }

    // Limit number of files
    if (files.length > maxFiles) {
      setToastType("error");
      setToastMessage(`You can only upload a maximum of ${maxFiles} files.`);
      return false;
    }

    for (let file of files) {
      // Check file type
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        setToastType("error");
        setToastMessage(
          `Invalid file type: ${file.name}. Only ${allowedExtensions.join(", ")} files are allowed.`
        );
        return false;
      }

      // Check file size
      if (file.size > maxSize) {
        setToastType("error");
        setToastMessage(`File size exceeds the ${maxSize / 1000000}MB limit: ${file.name}`);
        return false;
      }
    }
    return true;
  };

  const onUploadDocs = async (event) => {
    const files = Array.from(event.files);
    setUploadedFiles(files); // Save files to state

    const checkValidation = onFileUpload({ files }, 1, [selectedOption]);
    if (checkValidation) {
      try {
        setLoader(true);
        const formData = new FormData();
        files.forEach((file) => {
          formData.append("file", file);
        });
        formData.append("user_id", username);
        setFileUploaded(true); // Ensure this is called on successful upload

        // Call the parse function from the service
        const response = await EndPointService.parse(headers, formData);

        // Log the response for debugging purposes
        console.log("Backend response:", response);
        setData(response);

        setToastType("success");
        setToastMessage(response.message || "File uploaded successfully!");
        setFileFormatVerification(response.file_format_verification);
        setTotalRecordsFound(response.total_records_found);
        setTotalRecordsParsed(response.total_records_parsed);

      } catch (error) {
        // Log the error to understand the issue
        console.error("Error caught during file upload:", error);

        setToastType("error");
        setToastMessage(error.response?.data?.message || "File upload failed.");
        setFileUploaded(false);
      } finally {
        setLoader(false);
      }
    }
  };

  const handleIngest = async () => {
    if (!uploadedFiles || uploadedFiles.length === 0) {
      setToastType("error");
      setToastMessage("No files to ingest. Please upload a file first.");
      return;
    }

    const checkValidation = onFileUpload({ files: uploadedFiles }, 1, [selectedOption]);
    if (checkValidation) {
      const formData = new FormData();
      uploadedFiles.forEach((file) => {
        formData.append("file", file);
      });
      formData.append("user_id", username);

      try {
        setLoader(true);
        // Call the ingest function from the service
        const response = await EndPointService.ingest(headers, formData);
        console.log(response);
        setToastType("success");
        setToastMessage(response.message || "Bulk Import Successful");
        setModalIsOpen("Bulk Import Successful");
        setLoader(false);
        window.location.reload();
      } catch (error) {
        setToastType("error");
        setToastMessage(error.response?.data?.message || "Bulk Import failed.");
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <>
      <div className="content">
        <DynamicToast v-if={toastType} type={toastType} message={toastMessage} />
        {loader ? <FullPageLoader /> : ""}
        <Form>
        <Row>
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
                  Select File Format
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col sm="6">
                    <div className="form-check-radio">
                      <FormGroup>
                        <Label check>
                          <Input
                            value=".csv"
                            id="hs2csv"
                            name="options"
                            type="radio"
                            checked={selectedOption === ".csv"}
                            onChange={handleRadioChange}
                          />
                          HS2 CSV <span className="form-check-sign" />
                        </Label>
                      </FormGroup>
                    </div>
                  </Col>
                  <Col sm="6">
                    <div className="form-check-radio">
                      <FormGroup>
                        <Label check>
                          <Input
                            value=".xlsx"
                            id="hs2excel"
                            name="options"
                            type="radio"
                            checked={selectedOption === ".xlsx"}
                            onChange={handleRadioChange}
                          />
                          HS2 Excel <span className="form-check-sign" />
                        </Label>
                      </FormGroup>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>

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
                  Select file to import records
                </CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col sm="12">
                    <FileUpload
                      name="docs[]"
                      multiple
                      accept=".csv,.xlsx,.xls"
                      maxFileSize={9000000}
                      onSelect={onUploadDocs}
                      className="custom-file-upload"
                      customUpload
                      emptyTemplate={<p className="m-0">Choose data sheet</p>}
                    />
                  </Col>
                </Row>
              </CardBody>
            </Card>
            

            { fileUploaded && (
              <>
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
                      Processing Status
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col sm="12">
                        <Progress multi>
                          <Progress bar barClassName="progress-bar-success" max="100" value="33" />
                          <Progress bar barClassName="progress-bar-warning" max="100" value="33" />
                          <Progress bar barClassName="progress-bar-info" max="100" value="34" />
                        </Progress>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>

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
                      Import Results
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col sm="12">
                        File Format Verification: {fileFormatVerification}
                        <br />
                        Total Records Found: {totalRecordsFound}
                        <br />
                        Total Records Successfully Parsed: {totalRecordsParsed}
                        <br />
                      </Col>
                      <Col sm="12">
                        Click the button below if you wish to save these records in the database
                      </Col>
                      <Col sm="12">
                        <Button color="primary" onClick={(event) => handleIngest(event)}>
                          Save to Database
                        </Button>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </>
            )}
          </Col>
        </Row>
      </Form>
      </div>
    </>
  );
};

export default BulkImport;
