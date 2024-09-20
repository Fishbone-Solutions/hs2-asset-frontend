import React, { useContext, useState } from "react";
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
import axios from "axios";
import { FullPageLoader } from "components/Common/ComponentLoader";
const BulkImport = () => {
  const [dataState, setDataState] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [selectedOption, setSelectedOption] = useState('hs2csv'); // Default value
  const [fileUploaded, setFileUploaded] = useState(false); // New state to track if a file is uploaded

  const { username } = useContext(GlobalContext);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const onUploadDocs = async (event) => {
    const checkValidation = onFileUpload(event, 1, ['.xlsx', '.csv']);
    if (checkValidation) {
      const files = Array.from(event.files);
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('file', file);
      });

      try {
        setLoader(true);
        const response = await axios.post('http://localhost/bulkimport/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setToastType("success");
        setToastMessage(response.data.message || "File uploaded successfully!");
        setFileUploaded(true); // Set fileUploaded to true once file is successfully uploaded
      } catch (error) {
        setToastType("error");
        setToastMessage(error.response?.data?.message || "File upload failed.");
        setFileUploaded(false); // Set fileUploaded to false on error
      } finally {
        setLoader(false);
      }
    }
  };

  const onFileUpload = (
    event,
    maxFiles = 1,
    allowedExtensions = ['.xlsx', '.csv'],
    maxSize = 2000000
  ) => {
    const files = event.files;

    // Limit number of files
    if (files.length > maxFiles) {
      setToastType("error");
      setToastMessage(`You can only upload a maximum of ${maxFiles} files.`);
      return;
    }

    for (let file of files) {
      // Check file type
      const fileExtension = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        setToastType("error");
        setToastMessage(`Invalid file type: ${file.name}. Only ${allowedExtensions.join(", ")} files are allowed.`);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        setToastType("error");
        setToastMessage(`File size exceeds the ${maxSize / 1000000}MB limit: ${file.name}`);
        return;
      }
    }
    return true;
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
                              value="hs2csv"
                              id="hs2csv"
                              name="options"
                              type="radio"
                              checked={selectedOption === "hs2csv"}
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
                              value="hs2excel"
                              id="hs2excel"
                              name="options"
                              type="radio"
                              checked={selectedOption === "hs2excel"}
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
                        maxFileSize={2000000}
                        onSelect={onUploadDocs}
                        className="custom-file-upload"
                        customUpload
                        emptyTemplate={<p className="m-0">Choose data sheet</p>}
                      />
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Conditionally show Progress and Import Results sections */}
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
                          File Format Verification: Passed
                          <br />
                          Total Records Found: 97
                          <br />
                          Total Records Successfully Parsed: 90
                          <br />
                        </Col>
                        <Col sm="12">
                          Click the button below if you wish to save these records in the database
                        </Col>
                        <Col sm="12">
                          <Button color="primary">Save to Database</Button>
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
