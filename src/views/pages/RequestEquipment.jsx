import React, { useState, useEffect, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
} from "reactstrap";
import "react-datetime/css/react-datetime.css";
import ReactBSAlert from "react-bootstrap-sweetalert";
import BACKEND_ADDRESS from "views/components/serverAddress";
import { GlobalContext } from "@/GlobalState";
import DateRangePicker from "components/Common/DateRangePicker";
import { useAlert } from "components/Common/NotificationAlert";

const camelCaseWithSpaces = (text) => {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const RequestEquipment = () => {
  const { id } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);

  const { alert, showAlert, hideAlert } = useAlert();
  const mode = query.get("mode");
  const isAddMode = mode === "add";

  const handleDate = (startDate, endDate) => {
    setRangeDates((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
    }));
  };

  const isReadOnly = mode === "view";

  const handleBroadcastSubmit = () => {
    showAlert({
      title: (
        <div className="alert-content-padding">
          <h6 className="sweet-title-size sweet-title-padding text-start">
            This feature is not available in BETA Version
          </h6>
        </div>
      ),
      content: "",
      type: "warning",
      confirmText: "ok",
      showCancelButton: false,
      onConfirm: hideAlert,
    });
  };

  return (
    <>
      <div className="content">
        <Form>
          <Row>
            {/* Requested Equipment Details */}
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
                    Requested Item Information
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label className="required">Item Name</Label>
                      <FormGroup>
                        <Input type="text" name="H" readOnly={isReadOnly} />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label className="required">Quantity</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="Company"
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <FormGroup>
                        <DateRangePicker
                          label="Required By"
                          requireLabel={true}
                          inputName="availablility_range"
                          labelType="non-float"
                          onChange={handleDate}
                          mode="single"
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="12">
                      <Label className="required">
                        Please let us know in the box below what is it that you
                        are looking for
                      </Label>
                      <FormGroup className={`has-label`}>
                        <Input
                          type="textarea"
                          name="additional_info"
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

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
                    {camelCaseWithSpaces("Buyer Details")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label className="required">Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_title"
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label className="required">Company</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_contactno"
                          readOnly={isReadOnly}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label className="required">Contact No</Label>
                      <FormGroup>
                        <Input type="text" name="seller_contactno" />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label className="required">Email Address</Label>
                      <FormGroup>
                        <Input type="text" name="seller_email" />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label className="required">Buyer Address</Label>
                      <FormGroup>
                        <Input type="text" name="seller_email" />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label className="required">Item Delivery Location</Label>
                      <FormGroup>
                        <Input type="text" name="seller_email" />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label className="required">
                        Preferred Contact Timings
                      </Label>
                      <FormGroup>
                        <Input type="text" name="seller_email" />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter></CardFooter>
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
              <Button
                color="primary"
                onClick={handleBroadcastSubmit}
                type="button"
              >
                Broadcast Request
              </Button>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default RequestEquipment;
