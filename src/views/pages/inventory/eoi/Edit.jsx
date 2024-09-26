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
import ReactBSAlert from "react-bootstrap-sweetalert";
import { approvalStatusOptions } from "variables/common";
import { useAlert } from "components/Common/NotificationAlert";
import { useNavigate } from "react-router-dom";
import { FcUndo } from "react-icons/fc";
import UndoIcon from "components/svg/Undo";

const Edit = () => {
  const [dataState, setDataState] = useState({});
  const [activities, setActivities] = useState({});
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const { inventoryId, eoiId } = useParams();
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const headers = { user_id: sessionStorage.getItem("username") };
  const usersInformation = JSON.parse(sessionStorage.getItem("user"));
  const [approvals, setApprovals] = useState([]);
  const [selectedApproval, setSelectedApproval] = useState(null);
  // Create a ref to hold the latest params value
  const latestSelectedApprovalRef = useRef(selectedApproval);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetchData();
    fetchApprovals();
  }, []);

  // Update the ref whenever the params state changes
  useEffect(() => {
    console.log("selectedApproval", selectedApproval);
    if (selectedApproval != null) {
      latestSelectedApprovalRef.current = selectedApproval;
      handleApprove();
    }
  }, [selectedApproval]);

  const handleSelectChange = (selectedOption) => {
    setDataState((prevState) => ({
      ...prevState,
      eoi_status: selectedOption.value,
    }));
  };

  const handleFormSubmission = async (event) => {
    console.log("edit", event);
    event.preventDefault();
    showAlert({
      title: "Are you sure?",
      confirmText: "Yes",
      onConfirm: async () => {
        await handleSubmit(); // No need to pass params, we'll use the ref
      },
      type: "warning",
      onCancel: hideAlert,
      showCancelButton: true,
    });
  };

  const handleSubmit = async () => {
    setLoader(true);
    try {
      const requestBody = {
        eoi_status: dataState.eoi_status,
      };
      const res = await EndPointService.eoiUpdateStatus(
        headers,
        inventoryId,
        eoiId,
        requestBody
      );
      showAlert({
        title: `EOI status updated`,
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          navigate(`/admin/eois/inventory/${inventoryId}`);
        },
      });
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const fetchApprovals = async () => {
    try {
      const res = await EndPointService.organizatioinApproval(
        headers,
        usersInformation.organization_id
      );
      setApprovals(res.appRespData);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleSelectChangeApproval = (selectedOption) => {
    setSelectedApproval(selectedOption.value);
    console.log(selectedApproval, selectedOption.value);
  };

  const approvalRequest = async () => {
    const latestParams = {
      requester_user_id: sessionStorage.getItem("username"),
      approver_user_id: latestSelectedApprovalRef.current,
    };

    setLoader(true);
    try {
      console.log("Submitting with params:", latestParams);
      const res = await EndPointService.createApprovalRequest(
        headers,
        eoiId,
        latestParams
      );

      showAlert({
        title: `Approval Request sent`,
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          navigate(`/admin/inventory/${inventoryId}/eois/edit/${eoiId}`);
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
  const ApproverSelectionContent = () => {
    // Find the approver with user_id "michael.admin"
    const selectedApproverDetails = approvals.find(
      (approver) => approver.user_id === latestSelectedApprovalRef.current
    );

    return (
      <div className="popup-sweet-alert">
        <Select
          options={[
            { value: "", label: "Select Approver" },
            ...approvals.map((option) => ({
              value: option.user_id,
              label: option.approver_name,
            })),
          ]}
          value={{
            label: selectedApproverDetails
              ? selectedApproverDetails.approver_name
              : "Select Approver",
          }}
          onChange={handleSelectChangeApproval}
        />
        {/* Dynamically show the selected approver's details */}
        <span className="d-flex flex-wrap justify-content-left text-black mt-2">
          {selectedApproverDetails ? (
            <>
              <div className="sweet-alert-content">
                Email: {selectedApproverDetails.email}
              </div>
              <div className="sweet-alert-content">
                Contact: {selectedApproverDetails.contact_no}
              </div>
            </>
          ) : (
            ""
          )}
        </span>
      </div>
    );
  };

  const handleApprove = () => {
    showAlert({
      customHeader: (
        <header class="py-2 mb-4 border-bottom sweet-alert-header">
          <div class="container d-flex flex-wrap justify-content-left">
            <span class="fs-6 text-white">REQUEST APPROVAL</span>
          </div>
        </header>
      ),
      confirmText: "Send Request",
      onConfirm: async () => {
        await approvalRequest(); // No need to pass params, we'll use the ref
      },
      onCancel: hideAlert,
      showCancelButton: true,
      content: <ApproverSelectionContent />, // Use functional component here
    });
  };

  const submitApproval = () => {
    console.log("approval");
  };

  var options = [
    { value: "EOI-SUBMITTED", label: "EOI Submitted" },
    { value: "IN-NEGOTIATION", label: "In Negotiation" },
    { value: "PAYMENT-REQUESTED", label: "Payment Requested" },
    { value: "PAYMENT-RECEIVED", label: "Payment Received" },
    { value: "GOODS-SENT", label: "Goods Sent" },
  ];

  const handleUndoStatus = async () => {
    try {
      const res = await EndPointService.inventoryUndoStatus(
        headers,
        inventoryId,
        eoiId
      );
      showAlert({
        title:
          res.appRespData[0].eoi_undo_last_activity !== -1
            ? `Undo Current Status`
            : "Can not undo Status set by seller",
        type:
          res.appRespData[0].eoi_undo_last_activity !== -1
            ? "success"
            : "error",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          navigate(`/admin/inventory/${inventoryId}/eois/edit/${eoiId}`);
        },
      });
    } catch (e) {}
  };

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
                    <Col sm="6">
                      <Label>Current Status</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="id"
                          value={dataState.eoi_status}
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
                          value={dataState.approval_status}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

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
                    <span className="float-right p-2">
                      <Button
                        type="button"
                        onClick={() => {
                          showAlert({
                            title: `Are you sure you wish to Undo current EOI status ?`,
                            type: "warning",
                            showCancelButton: true,
                            confirmText: "Yes",
                            onCancel: hideAlert,
                            onConfirm: () => {
                              handleUndoStatus();
                            },
                          });
                        }}
                        className="undo-icon p-1 top-0 end-0 mr-3 position-absolute bg-transparent "
                      >
                       <UndoIcon />
                      </Button>
                    </span>
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
                          onChange={handleSelectChange}
                          options={options.map((option) => ({
                            ...option,
                            isdisabled:
                              dataState.approval_status === "PENDING" &&
                              (option.value === "PAYMENT-RECEIVED" ||
                                option.value === "GOODS-SENT" ||
                                option.value === "PAYMENT-REQUESTED"),
                          }))}
                          isOptionDisabled={(option) => option.isdisabled} // disable an option
                          placeholder="Select an option"
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
            <Button color="primary" onClick={handleApprove} type="button">
              REQUEST APPROVAL
            </Button>
            <Button
              color="primary"
              type="button"
              onClick={handleFormSubmission}
            >
              SAVE
            </Button>
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

export default Edit;
