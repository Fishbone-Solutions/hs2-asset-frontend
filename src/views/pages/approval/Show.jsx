import React, { useContext, useEffect, useRef, useState } from "react";
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
} from "reactstrap";
import Select from "react-select";
import moment from "moment";
import ActivityTable from "components/Common/EoiTrackingHistory";
import { useAlert } from "components/Common/NotificationAlert";
import { useNavigate } from "react-router-dom";

const Show = () => {
  const [dataState, setDataState] = useState({});
  const [activities, setActivities] = useState({});
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const { inventoryId, eoiId, requestId } = useParams();
  const [selectedOption, setSelectedOption] = useState(null);
  const headers = { user_id: sessionStorage.getItem("username") };
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const [updateInput, setUpdateInput] = useState(0);

  const navigate = useNavigate();
  const [params, setParams] = useState({
    approval_status: "PENDING",
    approval_ref_no: null,
  });
  // Create a ref to hold the latest params value
  const latestParamsRef = useRef(params);

  var options = [
    { value: "EOI-SUBMITTED", label: "EOI Submitted" },
    { value: "IN-NEGOTIATION", label: "In Negotiation" },
    { value: "PAYMENT-REQUESTED", label: "Payment Requested" },
    { value: "PAYMENT-RECEIVED", label: "Payment Received" },
    { value: "GOODS-SENT", label: "Goods Sent" },
  ];

  const fetchData = async () => {
    try {
      setLoader(true);
      const res = await EndPointService.inventoryBaseEoiDetails(
        headers,
        inventoryId,
        eoiId
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

  const handleDropdownChange = (e) => {
    setSelectedOption(e.target.value);
  };

  // Update the ref whenever the params state changes
  useEffect(() => {
    latestParamsRef.current = params;
  }, [params]);

  // Function to handle modal input
  const handleModalInput = (e) => {
    const { value } = e.target;
    setParams((prevState) => ({
      ...prevState,
      approval_ref_no: value,
    }));
  };

  // Handle approval or rejection action
  const handleRequestApprovalOrRejected = (type) => {
    setParams((prevState) => ({
      ...prevState,
      approval_status: type,
      approval_ref_no: "",
    }));

    showAlert({
      customHeader: (
        <header class="py-2 mb-4 border-bottom sweet-alert-header">
          <div class="container d-flex flex-wrap justify-content-left">
            <span class="fs-6 text-white">{type} REQUEST</span>
          </div>
        </header>
      ),
      confirmText: type === "APPROVED" ? "APPROVE" : "REJECT",
      //title: type === "APPROVED" ? "APPROVAL" : type,
      //type: "info",
      onConfirm: async () => {
        await approvalRequest(type); // No need to pass params, we'll use the ref
      },
      onCancel: hideAlert,
      showCancelButton: true,
      content: (
        <div className="d-flex flex-wrap justify-content-left text-black mt-2">
          <label className="" htmlFor="">
            {type === "APPROVED"
              ? `Enter CEMAR Ref No to Approve this request`
              : `Enter Reason of Rejection`}
          </label>
          <input
            type="text"
            key={updateInput} // Forcing re-render when state changes
            className="form-control"
            value={params.approval_ref_no} // Binding to params state
            onChange={handleModalInput} // Calling handler directly
            placeholder={
              type === "APPROVED" ? `CEMAR Ref No` : `Reason of Rejection`
            }
          />
        </div>
      ),
    });
  };

  // Approval request function that uses the ref to get the latest params
  const approvalRequest = async (type) => {
    const latestParams = latestParamsRef.current; // Get the most recent params

    setLoader(true);
    try {
      console.log("Submitting with params:", latestParams);
      const res = await EndPointService.updateRequestStatus(
        headers,
        requestId,
        latestParams
      );

      showAlert({
        title: type === "APPROVED" ? `Request Approved` : "Rejection Sent",
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          navigate("/admin/approvals/requests");
        },
      });

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
        {alert}
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
                    {"EoI Information"}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>EoI No</Label>
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
                          type="text"
                          name="approval_status"
                          value={dataState.approval_status}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>CEMAR Ref No</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="approval_ref_no" // Corrected name field
                          value={dataState.approval_ref_no}
                          readOnly
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
                    {"EoI Status"}
                  </CardTitle>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label> Status *</Label>
                      <FormGroup>
                        <Select
                          className="react-select primary"
                          classNamePrefix="react-select"
                          name="eoi_status"
                          value={options.find(
                            (option) => option.value === dataState.eoi_status
                          )}
                          options={options}
                          placeholder="Select an option"
                          isDisabled="true"
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
              CLOSE
            </Button>
            {dataState.approval_status === "PENDING" && (
              <>
                <Button
                  className="btn btn-success success-btn"
                  color="primary"
                  style={{ visibility: "visible", opacity: 1 }}
                  onClick={() => handleRequestApprovalOrRejected("APPROVED")}
                >
                  Approve
                </Button>
                <Button
                  className="btn btn-danger danger-btn"
                  color="secondary"
                  onClick={() => handleRequestApprovalOrRejected("REJECTED")}
                  style={{ visibility: "visible", opacity: 1 }}
                >
                  Reject
                </Button>
              </>
            )}
          </div>
        </Form>
      </div>
    </>
  );
};

export default Show;
