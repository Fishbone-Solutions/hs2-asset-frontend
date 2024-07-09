import React from "react";
import Select from "react-select";
import { FileUpload } from 'primereact/fileupload';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Label,
  FormGroup,
  Form,
  Input,
  FormText,
  Row,
  Col,
} from "reactstrap";

function AssetRegister() {
  const [selectCondition, setSingleSelect] = React.useState(null);
  const [singleSelect2, setSingleSelect2] = React.useState(null);
  return (
    <>
      <div className="content">
        <Row>
          {/* Asset Seller Detail*/}
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Asset Seller Details</CardTitle>
              </CardHeader>
              <CardBody>
              <Form action="/" className="form-horizontal" method="get">
                  <Row>
                    <Label sm="2">Seller Title</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />
                        <FormText color="default" tag="span">
                        </FormText>
                        
                      </FormGroup>
                    </Col>
                    <Label sm="2">Contact No</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" />

                        
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Row>
                    <Label sm="2">Email Address</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />
                      </FormGroup>
                    </Col>
                    <Label sm="2">Location</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />  
                      </FormGroup>
                    </Col>
                    
                  </Row>

                
                
                
                </Form>
              </CardBody>
            </Card>
          </Col>
                {/* Category Detail*/}

           <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Category  Selection </CardTitle>
              </CardHeader>
              <CardBody>
                <Form action="/" className="form-horizontal" method="get">
                  <Row>
                    <Label sm="2">Category 1</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="singleSelect2"
                          value={selectCondition}
                          onChange={(value) => setSingleSelect(value)}
                          options={[
                            {
                              value: "",
                              label: "Single Option 2",
                              isDisabled: true,
                            },
                            { value: "2", label: "Used" },
                            { value: "3", label: "Wizardary" },
                            { value: "4", label: "WitchCraft" },
                          ]}
                          placeholder="Single Select"
                        />
                      </FormGroup>
                    </Col>
                    <Label sm="2">Category 2</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="singleSelect2"
                          value={selectCondition}
                          onChange={(value) => setSingleSelect(value)}
                          options={[
                            {
                              value: "",
                              label: "Single Option 2",
                              isDisabled: true,
                            },
                            { value: "2", label: "Used" },
                            { value: "3", label: "Wizardary" },
                            { value: "4", label: "WitchCraft" },
                          ]}
                          placeholder="Single Select"
                        />
                      </FormGroup>
                    </Col>
                    
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
                         {/* Asset Detail*/}
 
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Asset Detail</CardTitle>
              </CardHeader>
              <CardBody>
                <Form action="/" className="form-horizontal" method="get">
                  <Row>
                    <Label sm="2">Asset ID</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />
                        <FormText color="default" tag="span">
                        </FormText>
                        
                      </FormGroup>
                    </Col>
                    <Label sm="2">Available From</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />
                      
                        
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Row>
                    <Label sm="2">Name</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />
                      </FormGroup>
                    </Col>
                    <Label sm="2">Description</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />  
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Row>
                    <Label sm="2">Condition</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="singleSelect2"
                          value={selectCondition}
                          onChange={(value) => setSingleSelect(value)}
                          options={[
                            {
                              value: "",
                              label: "Single Option 2",
                              isDisabled: true,
                            },
                            { value: "2", label: "Used" },
                            { value: "3", label: "Wizardary" },
                            { value: "4", label: "WitchCraft" },
                          ]}
                          placeholder="Single Select"
                        />
                        
                      </FormGroup>
                    </Col>
                    <Label sm="2">Quantity</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Row>
                    <Label sm="2">Location</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />
                      
                        
                      </FormGroup>
                    </Col>
                    <Label sm="2">Estimated Value</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" />
                      
                        
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Row>
               
              
                    
                  </Row>
                  <Row>
  <Label sm="4">Other Details</Label>
  <Col md="10">
    <FormGroup>
    <Input type="textarea" style={{ width: '100%', height: '100%' }} />

    </FormGroup>
  </Col>
</Row>
                
                
                
                </Form>
              </CardBody>
            </Card>
          </Col>

       

           {/* Upload Images*/}

          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4"> Upload Images </CardTitle>
              </CardHeader>
              <CardBody>
 
              <FileUpload
      name="demo[]"
      url="/api/upload"
      multiple
      accept="image/*"
      maxFileSize={1000000}
      emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
      className="custom-fileupload"
       uploadButtonClassName="p-button p-fileupload-choose p-component"
      cancelButtonClassName="custom-cancel-button"
    />

              </CardBody>
            </Card>
          </Col>
     {/* Upload Documents*/}

     <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4"> Upload Documents</CardTitle>
              </CardHeader>
              <CardBody>
              <FileUpload name="demo[]" url={'/api/upload'} multiple accept="image/*" maxFileSize={1000000} emptyTemplate={<p className="m-0">Drag and drop files to here to upload.</p>} />
              </CardBody>
            </Card>
          </Col>
      {/* Set Asset Status */}
      <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4"> Set Asset Status</CardTitle>
              </CardHeader>
              <CardBody>
              <Row>
              <Label sm="2">Status</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="selectCondition"
                          value={selectCondition}
                          onChange={(value) => setSingleSelect(value)}
                          options={[
                            {
                              value: "",
                              label: "Single Option",
                              isDisabled: true,
                            },
                            { value: "2", label: "New Entry" },
                            { value: "3", label: "Open for EoI" },
                            { value: "4", label: "Unavailable-Sold" },
                          ]}
                          placeholder="Single Select"
                        />
                        
                      </FormGroup>
                    </Col>
</Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  <Button color="primary">Close</Button>
  <Button color="primary">Save</Button>
</div>
      </div>
    </>
  );
}

export default AssetRegister;
