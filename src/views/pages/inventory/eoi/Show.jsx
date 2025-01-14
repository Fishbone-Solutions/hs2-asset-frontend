import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/GlobalState";
import { useParams } from "react-router-dom";
import { EndPointService } from "@/services/methods";
import DynamicToast from "components/Common/Toast";
import { FullPageLoader } from "components/Common/ComponentLoader";
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
  Form,
  Modal,
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import moment from "moment";
import ActivityTable from "components/Common/EoiTrackingHistory";
import { currencyOptions } from "variables/common";

const Show = () => {
  const [dataState, setDataState] = useState({});
  const [activities, setActivities] = useState({});
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const { inventoryId, eoiId } = useParams();
  const headers = { user_id: sessionStorage.getItem("username") };

  var options = [
    { value: "EOI-SUBMITTED", label: "EOI Submitted" },
    { value: "IN-NEGOTIATION", label: "In Negotiation" },
    { value: "PAYMENT-RECEIVED", label: "Payment Received" },
    { value: "GOODS-SENT", label: "Goods Sent" },
  ];

  const fetchData = async () => {
    try {
      setLoader(true);
      const params = new URLSearchParams({
        source_module: "INVENTORY",
      });

      const res = await EndPointService.inventoryBaseEoiDetails(
        headers,
        inventoryId,
        eoiId,
        params
      );
      const resEoiActivities = await EndPointService.eoiActivityTrackingHistory(
        headers,
        inventoryId,
        eoiId
      );

      setDataState(res.appRespData[0]);
      setActivities(resEoiActivities.appRespData);

      setLoader(false);
    } catch (e) {
      console.log(e);
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
                    {"EOI Information"}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>EOI No</Label>
                      <FormGroup>
                        <Input type="text" name="id" value={eoiId} readOnly />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Submission Date</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="id"
                          value={dataState.submission_date_formatted}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label>Current Buyer Status</Label>
                      <FormGroup>
                        <Input
                          className="bg-current-status"
                          type="text"
                          name="id"
                          value={dataState.buyer_eoi_status}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label>Current Seller Status</Label>
                      <FormGroup>
                        <Input
                          className="bg-current-status"
                          type="text"
                          name="id"
                          value={dataState.seller_eoi_status}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
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
                    Approval
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Approval Status</Label>
                      <FormGroup>
                        <Input
                          className={
                            dataState.approval_status == "APPROVED"
                              ? "custom-approval-field"
                              : dataState.approval_status == "REJECTED"
                                ? "custom-approval-field-rejected"
                                : ""
                          }
                          type="text"
                          name="approval_status"
                          value={
                            dataState.approval_status === "PENDING"
                              ? "Not Requested"
                              : dataState.approval_status
                          }
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    {dataState.approval_status !== "NOT-REQUESTED" &&
                    dataState.approval_status !== "REQUESTED" ? (
                      <Col sm="6">
                        <Label>
                          {dataState.approval_status == "APPROVED"
                            ? "CEMAR Ref No"
                            : "Rejection Reason"}
                        </Label>
                        <FormGroup>
                          <Input
                            type="text"
                            name="approval_ref_no" // Corrected name field
                            value={
                              dataState.approval_status === "NOT-REQUESTED" ||
                              dataState.approval_status === "REQUESTED"
                                ? ""
                                : dataState.approval_ref_no
                            }
                            readOnly
                          />
                        </FormGroup>
                      </Col>
                    ) : (
                      ""
                    )}
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
                    Tracking History
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="12">
                      <ActivityTable activities={activities} />
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
                    Buyer Details
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="buyer_name"
                          value={dataState.buyer_name}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Company</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="organization"
                          value={dataState.organization}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label>Contact No</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="contact_no"
                          value={dataState.contact_no}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Email</Label>
                      <FormGroup className={`has-label ${dataState.email}`}>
                        <Input
                          type="text"
                          name="email"
                          value={dataState.email}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label>Buyer Address</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="address"
                          value={dataState.address}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label>Item Delivery Location</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="delivery_location"
                          value={dataState.delivery_location}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label>Preferred Contact Timings</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="contact_time_preference"
                          value={dataState.contact_time_preference}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* negotiated form*/}
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
                    Negotiated Value
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Value</Label>
                      <FormGroup>
                        <InputGroup>
                          <div className={{ width: "30%" }}>
                            <Select
                              options={currencyOptions}
                              name="negotiated_val_curr"
                              placeholder="Currency.."
                              classNamePrefix="currency-select"
                              defaultValue={currencyOptions[0]}
                              isClearable={false}
                              isDisabled="false"
                              value={currencyOptions.find(
                                (option) =>
                                  option.value ===
                                  dataState.negotiated_value_curr
                              )}
                            />
                          </div>
                          <Input
                            type="number"
                            name="negotiated_val"
                            className="currency-input"
                            value={dataState.negotiated_value}
                            readOnly
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

            {/* Set EoI Status */}
          </Row>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              className="buttonClose"
              color="primary"
              onClick={() => window.history.back()}
              style={{ visibility: "visible", opacity: 1 }}
            >
              CLOSE
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Show;
