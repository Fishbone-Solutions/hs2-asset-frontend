import React, { useEffect, useState } from "react";
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
import { FullPageLoader } from "components/Common/ComponentLoader";
import { EndPointService } from "@/services/methods";
import { RiAttachment2 } from "react-icons/ri";
import CsvIcon from "components/svg/CsvIcon";
import XlsIcon from "components/svg/XlsIcon";

const BulkImport = () => {
  const [progress, setProgress] = useState(0);
  const [DataResponse, setData] = useState();
  const username = sessionStorage.getItem("username");

  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [selectedOption, setSelectedOption] = useState(null); // Default value
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileFormatVerification, setFileFormatVerification] = useState([]);
  const [totalRecordsFound, setTotalRecordsFound] = useState([]);
  const [totalRecordsParsed, setTotalRecordsParsed] = useState([]);
  const [uploadedFile, setUploadedFile] = useState(null); // Single file
  const [refreshUploadFile, setRefreshUploadFile] = useState(0);
  const [sourceFileFormat, setSourceFileFormat] = useState(false);

  const [selectDisabled, setSelectDisabled] = useState(true);
  const [parseFileDisabled, setParseFileDisabled] = useState(true);
  const [responseStatus, setResponseStatus] = useState(null);

  const [segmentWidth, setSegmentWidth] = useState(0);
  const [remainingProgress, setRemaingProgress] = useState(0);
  const headers = {
    "Content-Type": "multipart/form-data",
    user_id: username,
  };

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
    setSelectDisabled(false);
    resetUploadedStates();
  };

  const resetUploadedStates = () => {
    setRefreshUploadFile(refreshUploadFile + 1);
    setSourceFileFormat(false);
    setData(null);
    setTotalRecordsFound([]);
    setTotalRecordsParsed([]);
    setUploadedFile(null);
    setFileUploaded(false);
    setParseFileDisabled(true);
    setProgress(0);
  };

  const resetForm = () => {
    setLoader(false);
    setData(null);
    setToastType(null);
    setFileFormatVerification([]);
    setSelectedOption(null); // Reset the file format option to default
    resetUploadedStates();
    setParseFileDisabled(true);
  };

  const onFileUpload = (
    event,
    allowedExtensions = [selectedOption],
    maxSize = 9000000000
  ) => {
    const file = event.files[0];

    if (!file) {
      setToastType("error");
      setToastMessage("No file selected.");
      return false;
    }

    // Check file type
    const fileExtension = file.name
      .substring(file.name.lastIndexOf("."))
      .toLowerCase();
    if (!allowedExtensions.includes(fileExtension)) {
      setToastType("error");
      setToastMessage(
        `Invalid file type: ${file.name}. Only ${allowedExtensions.join(", ")} files are allowed.`
      );
      setSourceFileFormat(true);
      return false;
    }

    // Check file size
    if (file.size > maxSize) {
      setToastType("error");
      setToastMessage(
        `File size exceeds the ${maxSize / 1000000}MB limit: ${file.name}`
      );
      return false;
    }

    setUploadedFile(file); // Set the single uploaded file
    return true;
  };

  const parseFileData = async (e) => {
    e.preventDefault();

    try {
      //setLoader(true);
      const formData = new FormData();
      formData.append("file", uploadedFile); // Only one file
      formData.append("user_id", username);
      setFileUploaded(true); // Ensure this is called on successful upload

      // Call the parse function from the service
      const response = await EndPointService.parse(
        headers,
        formData,
        (progress) => setProgress(progress)
      );

      // Log the response for debugging purposes
      console.log("Backend response:", response);
      setResponseStatus(response.appRequestStatus);
      setToastMessage(response.message || "File uploaded successfully!");
      setFileFormatVerification(response.file_format_verificatio || []);
      setTotalRecordsFound(response.total_records_found);
      setTotalRecordsParsed(response.total_records_parsed || []);
    } catch (error) {
      // Log the error to understand the issue
      console.error("Error caught during file upload:", error);

      setToastType("error");
      setToastMessage(error.response?.data?.message || "File upload failed.");
      setFileUploaded(false);
    } finally {
      setLoader(false);
    }
  };

  const onUploadDocs = async (event) => {
    if (selectedOption === null || selectedOption === "") {
      setSourceFileFormat(true);
      setParseFileDisabled(true);
    } else {
      setSourceFileFormat(false);
      console.log("selected option", selectedOption);
      const file = event.files[0];
      setUploadedFile(file); // Save the file to state
      const checkValidation = onFileUpload({ files: [file] }, [selectedOption]);
      if (checkValidation) {
        setParseFileDisabled(false);
      }
    }
  };

  const handleIngest = async () => {
    if (!uploadedFile) {
      setToastType("error");
      setToastMessage("No file to ingest. Please upload a file first.");
      return;
    }

    const checkValidation = onFileUpload({ files: [uploadedFile] }, [
      selectedOption,
    ]);
    if (checkValidation) {
      const formData = new FormData();
      formData.append("file", uploadedFile); // Single file
      formData.append("user_id", username);

      try {
        setLoader(true);
        // Call the ingest function from the service
        const response = await EndPointService.ingest(headers, formData);
        console.log(response);
        setToastMessage(response.message || "Bulk Import Successful");
        setToastType("success");
        resetForm();
      } catch (error) {
        setToastType("error");
        setToastMessage(error.response?.data?.message || "Bulk Import failed.");
      } finally {
        setLoader(false);
      }
    }
  };

  const removeFile = () => {
    setParseFileDisabled(true);
    resetUploadedStates();
  };

  useEffect(() => {
    setSegmentWidth(Math.min(progress, 33)); // Limit each segment to 33%
    setRemaingProgress(progress > 66 ? progress - 66 : 0); // Calculate remaining progress for the last segment
    console.log("segmentwidth", segmentWidth);
  }, [progress]);

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
                    Source File Format
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <div className="form-check-radio">
                        <FormGroup className="d-flex">
                          <Label check>
                            <Input
                              value=".csv"
                              id="hs2csv"
                              name="options"
                              type="radio"
                              onChange={handleRadioChange}
                            />
                            <span className="form-check-sign">
                              <CsvIcon width="40" height="40" />
                            </span>
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
                              onChange={handleRadioChange}
                            />
                            <span className="form-check-sign">
                              {" "}
                              <XlsIcon width="40" height="40" />{" "}
                            </span>
                          </Label>
                        </FormGroup>
                      </div>
                    </Col>
                    {sourceFileFormat ? (
                      <span className="text-danger">
                        Please select a source file format
                      </span>
                    ) : (
                      ""
                    )}
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
                    Select Source File
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="12">
                      <FileUpload
                        key={refreshUploadFile}
                        name="doc"
                        accept=".csv,.xlsx,.xls"
                        maxFileSize={9000000}
                        chooseLabel={<span>Select</span>}
                        onSelect={onUploadDocs}
                        onRemove={removeFile}
                        className="custom-file-upload"
                        customUpload
                        disabled={selectDisabled}
                      />
                      <button
                        onClick={parseFileData}
                        disabled={parseFileDisabled}
                        className="custom-parse-button btn btn-primary"
                      >
                        Parse File
                      </button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {fileUploaded && (
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
                            <Progress
                              bar
                              barClassName="progress-bar-success"
                              max="100"
                              value={segmentWidth}
                            />
                            <Progress
                              bar
                              barClassName="progress-bar-warning"
                              max="100"
                              value={segmentWidth}
                            />
                            <Progress
                              bar
                              barClassName="progress-bar-info"
                              max="100"
                              value={
                                remainingProgress > 0 ? remainingProgress : 0
                              }
                            />
                            <span className="progress-percentage">
                              {progress}%
                            </span>
                          </Progress>
                        </Col>
                      </Row>
                    </CardBody>
                  </Card>

                  {progress === 100 ? (
                    <Card key={refreshUploadFile}>
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
                          Processing Summary
                        </CardTitle>
                      </CardHeader>
                      <CardBody>
                        <Row>
                          <Col sm="12">
                            Parsing Status:{" "}
                            {responseStatus === "SUCCESS" ? (
                              <span className="text-success font-weight-bold">
                                Success
                              </span>
                            ) : (
                              <span className="text-danger font-weight-bold">
                                Failed
                              </span>
                            )}
                            <br />
                            Description:{" "}
                            {responseStatus === "SUCCESS" ? (
                              <span className="text-success font-weight-bold">
                                File parsed successfully
                              </span>
                            ) : (
                              <span className="text-danger font-weight-bold">
                                Failed to parse the file. Please verify the
                                template and try again
                              </span>
                            )}
                            <br />
                            Total Records Found:{" "}
                            <span className="text-success font-weight-bold">
                              {totalRecordsFound}
                            </span>
                            <br />
                            Total Records Successfully Parsed:{" "}
                            <span className="text-success font-weight-bold">
                              {Array.isArray(totalRecordsParsed)
                                ? totalRecordsParsed.length
                                : totalRecordsParsed}
                            </span>
                            <br />
                          </Col>

                          <Col className="d-flex justify-content-end" sm="12">
                            <Button
                              className="btn btn-parimary "
                              color="primary"
                              onClick={handleIngest}
                              disabled={
                                responseStatus === "SUCCESS" ? false : true
                              }
                            >
                              Import Records To Inventory
                            </Button>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  ) : (
                    ""
                  )}
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
