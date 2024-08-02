import React from "react";
import { useEffect } from "react";
import { useState,useContext } from "react";
// reactstrap components
import {
Card,
Button,
CardBody,
Form,
FormGroup,
Input,
Label,
CardHeader,
CardTitle,
CardFooter,
Row,
Col,
} from "reactstrap";
import { GlobalContext } from "GlobalState";
import { useParams,useLocation ,useNavigate} from "react-router-dom";
import BACKEND_ADDRESS from "views/components/serverAddress";
import Select from "react-select";
import ReactDatetime from "react-datetime";
import moment from "moment";
const camelCaseWithSpaces = (text) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
  

const EoIPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const mode = query.get('mode');
    const [registerEmailState, setRegisterEmailState] = useState("");
    const [alert, setAlert] = useState(null);
    const navigate = useNavigate();
    const {username } =  useContext(GlobalContext);
    const [formData, setFormData] = useState(
      {
        "id": "",
        "code": "",
        "asset_id": "",
        "submission_date": "",
        "buyer_name": "",
        "organization": "",
        "contact_no": "",
        "email": "",
        "address": "",
        "delivery_location": "",
        "contact_time_preference": "",
        "eoi_status": "",
        "approval_status": "",
        "approval_ref_no": "",
        "status_trail": ""
      
   
    });
  
    useEffect(() => {
      const fetchData = async () => {
        if (mode === "edit" || mode === "view") {
          try {
            const myHeaders = new Headers();
            myHeaders.append("accept", "application/json");
            myHeaders.append("token", "x8F!@p01,*MH");
            myHeaders.append("user_id", username);
  
  
            const requestOptions = {
              method: "GET",
              headers: myHeaders,
              redirect: "follow",
            };
  
            const response = await fetch(
              `${BACKEND_ADDRESS}/assets/${asset_id}/eoi/${id}`,
              requestOptions
            );
  
            if (response.ok) {
              const result = await response.json();
              setFormData(result.appRespData[0]);
            } else {
              console.error("Failed to fetch data");
            }
          } catch (error) {
            console.error("Error:", error);
          }
        }
      };
  
      fetchData();
    }, [id, mode]);
  
    const hideAlert = () => {
      setAlert(null);
    };
  
    const verifyEmail = (value) => {
      var emailRex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return emailRex.test(value);
    };
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = async () => {
      const url = `${BACKEND_ADDRESS}/assets/${mode === "edit" ? id : ""}`;
      const requestBody = { ...formData };
  
      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: "x8F!@p01,*MH",
            "user_id":username
          },
          body: JSON.stringify(requestBody),
        });
        const data = await response.json();
        setAlert(
          <ReactBSAlert
            success
            style={{ display: "block", marginTop: "-100px" }}
            title="Submitted"
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="info"
            btnSize=""
          >
            Asset Listing submitted
          </ReactBSAlert>
        );
        navigate('/admin/inventory');
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    };
  
    const handleFormSubmission = async (event) => {
      event.preventDefault();
      const requiredFields = [
          "id",
          "code",
          "asset_id",
          "submission_date",
          "buyer_name",
          "organization",
          "contact_no",
          "email",
          "address",
          "delivery_location",
          "contact_time_preference",
          "eoi_status",
          "approval_status",
          "approval_ref_no",
          "status_trail" 

      ];
  
      for (let field of requiredFields) {
        if (!formData[field]) {
          setAlert(
            <ReactBSAlert
              warning
              style={{ display: "block", marginTop: "-100px" }}
              title="Missing Information"
              onConfirm={() => hideAlert()}
              onCancel={() => hideAlert()}
              confirmBtnBsStyle="info"
              btnSize=""
            >
              Please fill in all required fields.
            </ReactBSAlert>
          );
          return;
        }
      }
      setAlert(
        <ReactBSAlert
          warning
          style={{ display: "block", marginTop: "-100px" }}
          title="Are you sure?"
          onConfirm={() => handleSubmit()}
          onCancel={() => hideAlert()}
          confirmBtnBsStyle="info"
          cancelBtnBsStyle="danger"
          confirmBtnText="Yes"
          cancelBtnText="Cancel"
          showCancel
          btnSize=""
        />
      );
    };
  
    const isReadOnly = mode === 'view';
  
    return (
      <>
        <div className="content">
        <Form onSubmit={handleFormSubmission}>
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
            {/* Your Card Title */}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col sm="6">
              <Label>EoI No</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>

            <Col sm="6">
              <Label style={{ color: "#36454F" }}>EoI Date</Label>
              <FormGroup>
                <ReactDatetime
                  inputProps={{
                    className: "form-control",
                    placeholder: "DD/MM/YYYY",
                  }}
                  value={
                    formData.submission_date
                      ? moment(formData.submission_date, "DD-MM-YYYY")
                      : null
                  }
                  onChange={(momentDate) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      submission_date: momentDate.format("DD-MM-YYYY"), // Correct field name
                    }))
                  }
                  timeFormat={false}
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>

            <Col sm="6">
              <Label style={{ color: "#36454F" }}>Current Status</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="eoi_status" // Correct field name
                  value={formData.eoi_status}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
        <CardFooter>
          {/* Your Card Footer */}
        </CardFooter>
      </Card>
    </Col>
    {/* Approval Detail*/}
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
            {camelCaseWithSpaces("Approval")}
          </CardTitle>
        </CardHeader>
        <CardBody>
        <Row>
            <Col sm="6">
              <Label>Approval Status</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  required
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>

            <Col sm="6">
              <Label style={{ color: "#36454F" }}>CEMAR Ref No</Label>
              <FormGroup>
              <Input
                  type="text"
                  name="id"
                  value={formData.approval_ref_no}
                  onChange={handleChange}
                  required
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>

            
          </Row>
        </CardBody>
      </Card>
    </Col>
    {/* Audit Trail Detail*/}
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
            {camelCaseWithSpaces("Audit Trail - Tracking History")}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
        <Col md="12">

                      <FormGroup>
                        <Input
                          type="textarea"
                          name="additional_info"
                          value={formData.additional_info}
                          onChange={handleChange}
                          style={{ width: "100%", height: "100%" }}
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                    </Row>
        </CardBody>
       
      </Card>
    </Col>



    {/* Buyer  Details*/}
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
            {camelCaseWithSpaces("Buyer Details")}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col sm="6">
              <Label style={{ color: "#36454F" }}>Name</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="buyer_name"
                  value={formData.buyer_name}
                  onChange={handleChange}
                  required
                  disabled
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>

            <Col sm="6">
              <Label style={{ color: "#36454F" }}>Company</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  required
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="6">
              <Label style={{ color: "#36454F" }}>Contact No</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="contact_no"
                  value={formData.contact_no}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>

            <Col sm="6">
              <Label style={{ color: "#36454F" }}>Email Availability</Label>
              <FormGroup className={`has-label ${formData.email}`}>
                        <Input
                          type="text"
                          name="email"
                          value={formData.email}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!verifyEmail(value)) {
                              setRegisterEmailState("has-danger");
                            } else {
                              setRegisterEmailState("has-success");
                            }
                            setFormData((prevState) => ({
                              ...prevState,
                              seller_email: value,
                            }));
                          }}
                          required
                          readOnly={isReadOnly}
                        />
                        {registerEmailState === "has-danger" ? (
                          <label className="error">
                            Please enter a valid email address.
                          </label>
                        ) : null}
                      </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Label style={{ color: "#36454F" }}>Buyer Address</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>
            <Col sm="12">
              <Label style={{ color: "#36454F" }}>Item Delivery Location</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="delivery_location"
                  value={formData.delivery_location}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col sm="12">
              <Label style={{ color: "#36454F" }}>Preferred Contact Timings</Label>
              <FormGroup>
                <Input
                  type="text"
                  name="contact_time_preference"
                  value={formData.contact_time_preference}
                  onChange={handleChange}
                  readOnly={isReadOnly}
                />
              </FormGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>

    {/* Set EoI Status */}
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
            {camelCaseWithSpaces("EoI Status")}
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col sm="6">
              <Label style={{ color: "#36454F" }}>Status *</Label>
              <FormGroup>
                <Select
                  className="react-select primary"
                  classNamePrefix="react-select"
                  name="eoi_status"
                  /*           value={options.find(
                              (option) => option.value === formData.statuscode
                            )} */
                  onChange={(selectedOption) =>
                    setFormData((prevState) => ({
                      ...prevState,
                      eoi_status: selectedOption.value,
                    }))
                  }
                  options={[
                    { value: "IN_NEGOTIATION", label: "In Negotiation" },
                    { value: "PAYMENT_RECEIVED", label: "Payment Received" },
                    { value: "GOODS_SENT", label: "Goods Sent" },
                  ]}
                  placeholder="Select an option"
                  isDisabled={isReadOnly}
                  required
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
      onClick={() => window.history.back()}
      style={{ visibility: "visible", opacity: 1 }}
    >
      Close
    </Button>
    {mode !== "view" && (
      <Button color="primary" type="submit">
        Approve
      </Button>
    )}
    {mode !== "view" && (
      <Button color="primary" type="submit">
        Request Approval
      </Button>
    )}
  </div>
</Form>
        </div>
      </>
    );

}

export default EoIPage;
