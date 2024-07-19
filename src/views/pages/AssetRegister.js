import React from "react";
import Select from "react-select";
import { FileUpload } from 'primereact/fileupload';
import 'primereact/resources/primereact.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import { useState,useEffect } from "react";
import BACKEND_ADDRESS from "../components/serverAddress"

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
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
  const [formData, setFormData] = useState({
     code:"",
     entrydate:"",
    categorycode1:"",
    categorycode2:"",
    asset_name:"",
    description:"",
    asset_condition:"",
    quantity:"",
    asset_location:"",
    value:"",
    additional_info:"",
    available_from:"",
    seller_title:"",
    seller_contactno:"",
    seller_email:"",
    seller_location:"",
    statuscode:""
  });

    // useEffect hook to perform initial setup or fetches
    useEffect(() => {
      console.log("Component did mount or update specific props");
      // Here you can fetch initial data if required
    }, []); // Empty dependency array means this effect runs only once after the initial render
  
    // Function to handle input changes and update state
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    };
  
    // Function to handle form submission
    const handleSubmit = async (event) => {
      event.preventDefault(); // Prevent the default form submit action
      try {
        const response = await fetch(`${BACKEND_ADDRESS}/assets/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'token': 'x8F!@p01,*MH',
            'userId': 'tabish.hb'
          },
          body: JSON.stringify(formData)
        });
        console.log(formData);
        const data = await response.json();
        console.log('Form submitted successfully:', data);
      } catch (error) {
        console.error('Error submitting form:', error);
      }
    };
  return (
    <>
      <div className="content">
      <Form onSubmit={handleSubmit}>

        <Row>
          {/* Asset Seller Detail*/}
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Asset Seller Details</CardTitle>
              </CardHeader>
              <CardBody>
              <Form  onSubmit={handleSubmit}>
                  <Row>
                    <Label sm="2">Seller Title * </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text"    
          name="seller_title"
          value={formData.seller_title}
          onChange={handleChange}
          required />
                        <FormText color="default" tag="span">
                        </FormText>

                      </FormGroup>
                    </Col>
                    <Label sm="2">Contact No *</Label>
                    <Col sm="4">
                      <FormGroup> 
                      <Input type="text"    
          name="seller_contactno"
          value={formData.seller_contactno}
          onChange={handleChange}
          required />

                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Label sm="2">Email Address *</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input type="text" 
                           name="seller_email"
                           value={formData.seller_email}
                           onChange={handleChange}
                           required />
                      </FormGroup>
                    </Col>
                    <Label sm="2">Location *</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" 
                           name="seller_location"
                           value={formData.seller_location}
                           onChange={handleChange}
                           required />
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
                  <Row>
                    <Label sm="2">Category 1 *</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Select
  className="react-select primary"
  classNamePrefix="react-select"
  name="category1"
  value={formData.categorycode1}
  onChange={(selectedOption) =>
    setFormData((prevState) => ({
      ...prevState,
      categorycode1 : selectedOption
    }))
  }
  options={[
    { value: "plant", label: "Plant" },
    { value: "machinery", label: "Machinery" },
    { value: "fencing", label: "Fencing" },
    { value: "lighting", label: "Lighting" },
    { value: "office-equipment", label: "Office Equipment" },
    { value: "materials", label: "Materials" },
    { value: "aggregate", label: "Aggregate" },
    { value: "signs", label: "Signs" },
  ]}
  placeholder="Select an option"
  required
/>
                      </FormGroup>
                    </Col>
                    <Label sm="2">Category 2 *</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="category2"
                        value={formData.categorycode2}
                        onChange={(categorycode2) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            categorycode2  : categorycode2
                          }))
                        }
                        options={[
                          { value: "Option 1", label: "Option 1" },
                          { value: "Option 2", label: "Option 2" },
                        ]}
                        placeholder="Select an option"
                        required
                        />
                      </FormGroup>
                    </Col>

                  </Row>
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
                    <Label sm="2">Asset ID *</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" 
                           name="code"
                           value={formData.code}
                           onChange={handleChange}
                           required />
                        <FormText color="default" tag="span">
                        </FormText>

                      </FormGroup>
                    </Col>
                    <Label sm="2">Name *</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" 
                           name="asset_name"
                           value={formData.asset_name}
                           onChange={handleChange}
                           required />

                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Label sm="2">Description</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" 
                           name="description"
                           value={formData.description}
                           onChange={handleChange}
                           required />
                      </FormGroup>
                    </Col>
                    <Label sm="2"> Available From </Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" 
                           name="available_from"
                           value={formData.available_from}
                           onChange={handleChange}
                           required />
                      </FormGroup>
                    </Col>

                  </Row>
                  <Row>
                    <Label sm="2">Condition *</Label>
                    <Col sm="4">
                      <FormGroup>
                        <Select
                                               className="react-select primary"
                                               classNamePrefix="react-select"
                                               name="asset_condition"
                                               value={formData.asset_condition}
                                               onChange={(asset_condition) =>
                                                 setFormData((prevState) => ({
                                                   ...prevState,
                                                   asset_condition : asset_condition
                                                 }))
                                               }
                                               options={[
                                                 { value: "New", label: "New" },
                                                 { value: "Old", label: "Old" },
                                               ]}
                                               placeholder="Select an option"
                                               required
                        />

                      </FormGroup>
                    </Col>
                    <Label sm="2">Quantity</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" 
                           name="quantity"
                           value={formData.quantity}
                           onChange={handleChange}
                           required />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2">Location *</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" 
                           name="quantity"
                           value={formData.asset_location}
                           onChange={handleChange}
                           required />
                      </FormGroup>
                    </Col>
                    <Label sm="2">Estimated Value</Label>
                    <Col sm="4">
                      <FormGroup>
                      <Input type="text" 
                           name="estimatedvalue"
                           value={formData.value}
                           onChange={handleChange}
                            />
                     </FormGroup>
                    </Col>

                  </Row>
                  <Row>



                  </Row>
                  <Row>
                    <Label sm="4">Other Details</Label>
                    <Col md="10">
                      <FormGroup>
                        <Input type="textarea" 
                                name="additional_info"
                                value={formData.additional_info}
                                onChange={handleChange}
                        style={{ width: '100%', height: '100%' }} />

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
                <CardTitle tag="h5" style={{ color: "rgb(82,203,206)" }}>  Asset Status</CardTitle>
              </CardHeader>
              <CardBody>
                <Row>
                  <Label sm="2" style={{ color: "greywhite" }} >Status *</Label>
                  <Col sm="4">
                    <FormGroup>
                      <Select
                        className="react-select primary"
                        classNamePrefix="react-select"
                        name="statuscode"
                         value={formData.statuscode}
                        onChange={(statuscode) =>
                          setFormData((prevState) => ({
                            ...prevState,
                            statuscode : statuscode
                          }))
                        }
                        options={[
                          { value: "New", label: "New" },
                          { value: "Old", label: "Old" },
                        ]}
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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button color="primary">Close</Button>
          <Button color="primary" type="submit">Save</Button>
          </div>
          </Form>

      </div>
      
    </>
  );
}

export default AssetRegister;
