import React, { useContext, useEffect, useState } from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "@/services/methods";
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
  Button
} from "reactstrap";
import { GlobalContext } from "@/GlobalState";
const BulkImport = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const { username } = useContext(GlobalContext);
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
                            defaultValue="option1"
                            id="hs2csv"
                            name="hs2csv"
                            type="radio"
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
                            defaultValue="option1"
                            id="hs2csv"
                            name="hs2csv"
                            type="radio"
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
                    accept=".csv .xlsx .xls"
                    maxFileSize={2000000}
                //    onSelect={onUploadDocs}
                    className="custom-file-upload"
                    customUpload
                    emptyTemplate={<p className="m-0">Choose data sheet</p>}
                  />
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
                        value="15"
                      />
                      <Progress
                        bar
                        barClassName="progress-bar-warning"
                        max="100"
                        value="30"
                      />
                      <Progress
                        bar
                        barClassName="progress-bar-info"
                        max="100"
                        value="20"
                      />
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
                   <br></br>
                    Total Records Found: 97
                    <br></br>

                    Total Records Successfully Parsed: 90
                    <br></br>

                    Total Records Failed: 7
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
            </Col>
            </Row>
            </Form>
      </div>
    
    </>
  );
};

export default BulkImport;
