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
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import moment from "moment";
import ActivityTable from "components/Common/EoiTrackingHistory";
import { useAlert } from "components/Common/NotificationAlert";
import { useNavigate } from "react-router-dom";
import UndoIcon from "components/svg/Undo";
import ModalComponent from "components/Common/ModalComponent";
import { Tooltip } from "bootstrap"; // Import Bootstrap's Tooltip
import WarningIcon from "components/svg/Warning";
import { getStatusMessage } from "variables/common";
import NudgeSvgIcon from "components/svg/Nudge";
import NudgeApproverSvgIcon from "components/svg/NudgeApproverSvgIcon";
import { getUndoStatusMessage } from "variables/common";
import { getNudgeMessage } from "variables/common";
import AlertIcon from "components/svg/AlertIcon";
import { handleInputFilteration } from "variables/common";
import { getStatusMessageApprovalRequest } from "variables/common";
import { formatStringWithDash } from "variables/common";

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
  const [negotiatedValue, setNegotiatedValue] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  // Create a ref to hold the latest params value
  const latestSelectedApprovalRef = useRef(selectedApproval);
  const navigate = useNavigate();
  const [refreshModal, setRefreshModal] = useState(0);
  const [refreshMainComponent, setRefreshMainComponent] = useState(0);
  const [validationError, setValidationError] = useState(false);
  const [updateStatus, setUpdateStatus] = useState(null);

  const openModal = (modalId) => {
    console.log(dataState.negotiated_value, negotiatedValue);
    if (dataState.negotiated_value !== null && negotiatedValue !== null) {
      setActiveModal(modalId);
    } else {
      showAlert({
        title: (
          <h6 className="sweet-title-size sweet-title-padding text-start">
            Please update negotiated value before sending the request
          </h6>
        ),
        type: "info",
        onConfirm: hideAlert,
        showCancelButton: false,
      });
    }
  };
  const closeModal = () => {
    const modalElement = document.getElementById(activeModal);
    modalElement.classList.remove("show");
    modalElement.style.display = "none"; // Hides the modal
    const backdropElement = document.querySelector(".modal-backdrop");
    if (backdropElement) {
      backdropElement.remove();
    }
    setActiveModal(null);
    setValidationError(false);
    setSelectedApproval("");
    setRefreshModal(refreshModal + 1);
  };

  const fetchData = async () => {
    try {
      const params = new URLSearchParams({
        source_module: "INVENTORY",
      });
      setLoader(true);
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
      setNegotiatedValue(res.appRespData[0].negotiated_value);
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
    // Initialize tooltips
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    const tooltips = Array.from(tooltipTriggerList).map(
      (tooltipTriggerEl) => new Tooltip(tooltipTriggerEl)
    );

    // Cleanup tooltips on unmount
    return () => {
      tooltips.forEach((tooltip) => tooltip.dispose());
    };
  }, []);

  useEffect(() => {
    fetchData();
    fetchApprovals();
  }, [refreshMainComponent]);

  // Update the ref whenever the params state changes
  useEffect(() => {
    console.log("selectedApproval", selectedApproval);
    if (selectedApproval != null) {
      latestSelectedApprovalRef.current = selectedApproval;
      setRefreshModal(refreshModal + 1);
    }
  }, [selectedApproval]);

  const handleSelectChange = (selectedOption) => {
    setUpdateStatus(selectedOption.value);
  };

  const handleFormSubmission = async (event) => {
    console.log("edit", event, updateStatus);
    event.preventDefault();
    if (updateStatus === null || updateStatus === "") {
      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding text-start">
            Please choose an EOI Status to update
          </p>
        ),
        confirmText: "ok",
        onConfirm: hideAlert,
        type: "warning",
        onCancel: hideAlert,
        showCancelButton: false,
      });
    } else {
      showAlert({
        title: (
          <h6 className="warning-alert ">
            <span className="text-danger-dark text-start">
              WARNING: The status you are about to set will instantly become
              visible to the Buyer
            </span>
          </h6>
        ),
        content: <h3>Are you sure?</h3>,
        confirmText: "Yes",
        onConfirm: async () => {
          await handleSubmit(); // No need to pass params, we'll use the ref
        },
        type: "warning",
        onCancel: hideAlert,
        showCancelButton: true,
      });
    }
  };

  const handleSubmit = async () => {
    setLoader(true);
    try {
      const requestBody = {
        eoi_status: updateStatus,
        source_module: "INVENTORY",
      };
      const res = await EndPointService.eoiUpdateStatus(
        headers,
        inventoryId,
        eoiId,
        requestBody
      );
      const statusCode = res.appRespData[0].eoi_update_status;
      const isSuccess = statusCode > 0;
      showAlert({
        title: (
          <h6
            className={
              isSuccess
                ? "sweet-title-size sweet-title-padding"
                : "sweet-title-size sweet-title-padding text-start"
            }
          >
            {isSuccess
              ? `EOI status updated`
              : getStatusMessage(statusCode, "Buyer")}
          </h6>
        ),
        content: "", // Only show content for success cases
        type: isSuccess ? "success" : "error", // Default to "success", otherwise "error"
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          setUpdateStatus(null);
          setRefreshMainComponent(refreshMainComponent + 1);
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
      const res = await EndPointService.createApprovalRequest(
        headers,
        eoiId,
        latestParams
      );

      const requestBody = {
        eoi_status: "PROCESSING",
        source_module: "INVENTORY",
      };
      const respone = await EndPointService.eoiUpdateStatus(
        headers,
        inventoryId,
        eoiId,
        requestBody
      );

      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding">
            Approval Request sent
          </p>
        ),
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

    if (
      latestSelectedApprovalRef.current !== null &&
      latestSelectedApprovalRef.current !== ""
    ) {
      setValidationError(false);
    }

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
        {/* Show validation error if no approver is selected */}
        {validationError && (
          <div className="text-danger mt-1">Please select an approver</div>
        )}
        {/* Dynamically show the selected approver's details */}
        <span className="d-flex flex-wrap justify-content-left text-black mt-2">
          {selectedApproverDetails ? (
            <>
              <div className="sweet-alert-content w-full">
                Email: {selectedApproverDetails.email}
              </div>
              <br />
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

  // const handleApprove = () => {
  //   showAlert({
  //     customHeader: (
  //       <header class="py-2 mb-4 border-bottom sweet-alert-header">
  //         <div class="container d-flex flex-wrap justify-content-left">
  //           <span class="fs-6 text-white">REQUEST APPROVAL</span>
  //         </div>
  //       </header>
  //     ),
  //     confirmText: "Send Request",
  //     onConfirm: async () => {
  //       await approvalRequest(); // No need to pass params, we'll use the ref
  //     },
  //     onCancel: hideAlert,
  //     showCancelButton: true,
  //     content: <ApproverSelectionContent />, // Use functional component here
  //   });
  // };

  const submitApproval = () => {
    console.log("approval");
  };

  var options = [
    { value: "IN-NEGOTIATION", label: "In Negotiation" },
    { value: "PAYMENT-REQUESTED", label: "Payment Requested" },
    { value: "PAYMENT-RECEIVED", label: "Payment Received" },
    { value: "GOODS-SENT", label: "Goods Sent" },
    { value: "NOT-PROCEEDING", label: "Not Proceeding" },
  ];

  const handleNudge = async (sendNudgeto) => {
    setLoader(true);
    const params = {
      send_nudge_to: sendNudgeto,
    };
    try {
      const res = await EndPointService.sentNudgeRequest(
        headers,
        inventoryId,
        eoiId,
        params
      );
      setLoader(false);

      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding">
            {getNudgeMessage(res.appRespData[0].eoi_nudge, sendNudgeto)}
          </p>
        ),
        type: res.appRespData[0].eoi_nudge > 0 ? "success" : "error",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          if (res.appRespData[0].eoi_nudge > 0) {
            setRefreshMainComponent(refreshMainComponent + 1);
          }
        },
      });
    } catch (e) {}
  };

  const handleUndoStatus = async () => {
    try {
      const requestBody = {
        source_module: "INVENTORY",
      };
      const res = await EndPointService.inventoryUndoStatus(
        headers,
        inventoryId,
        eoiId,
        requestBody
      );

      const undoStatus = res.appRespData[0].eoi_undo_last_activity;
      const isSuccess = undoStatus > 0;

      showAlert({
        title: (
          <p
            className={
              isSuccess
                ? "sweet-title-size sweet-title-padding"
                : "sweet-title-size sweet-title-padding text-start"
            }
          >
            {getUndoStatusMessage(undoStatus, "BUYER")}
          </p>
        ),
        type: isSuccess ? "success" : "error",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          setRefreshMainComponent(refreshMainComponent + 1);
        },
      });
    } catch (e) {}
  };

  const handleNegotiatedValue = async () => {
    setLoader(true);
    try {
      const res = await EndPointService.negotiatedValueUpdate(
        headers,
        inventoryId,
        eoiId,
        {
          negotiated_value: negotiatedValue,
        }
      );
      setLoader(false);
      setRefreshMainComponent(refreshMainComponent + 1);
      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding">
            Negotiated value Updated
          </p>
        ),
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
        },
      });
    } catch (e) {
      setLoader(false);
      setToastType("error");
      setToastMessage(e.appRespMessage);
    }
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
                          value={dataState?.seller_eoi_status ?? ""}
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
                              ? "NOT-REQUESTED"
                              : formatStringWithDash(dataState.approval_status)
                          }
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>
                        {dataState.approval_status == "APPROVED"
                          ? "CEMAR Ref No"
                          : dataState.approval_status === "NOT-REQUESTED" ||
                              dataState.approval_status === "REQUESTED"
                            ? "CEMAR Ref No Or Rejection Reason"
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
                          <InputGroupText>£</InputGroupText>
                          <Input
                            type="text"
                            name="negotiated_val"
                            onInput={(e) => {
                              const data = handleInputFilteration("numeric")(e);
                              setNegotiatedValue(data);
                            }}
                            value={negotiatedValue}
                            disabled={dataState.approval_status == "APPROVED"}
                          />
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    {dataState.approval_status !== "APPROVED" ? (
                      <Button
                        color="primary"
                        type="button"
                        onClick={() =>
                          showAlert({
                            title: "Are you sure?",
                            type: "warning",
                            onConfirm: () => handleNegotiatedValue(),
                            onCancel: hideAlert,
                          })
                        }
                      >
                        update
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
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
                    {"EOI Status"}
                    <span className="float-right p-2">
                      <div
                        className="button-container"
                        style={{
                          display: "flex",
                          gap: "2px",
                          marginTop: "-33px",
                        }}
                      >
                        <Button
                          type="button"
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Undo Current Seller Status"
                          onClick={() => {
                            showAlert({
                              title: (
                                <h6 className="warning-alert ">
                                  <span className="text-danger-dark text-start">
                                    WARNING: The Buyer might have already
                                    reacted to your current status
                                  </span>
                                </h6>
                              ),
                              content: (
                                <h6 className="sweet-title-size sweet-title-padding text-start">
                                  Are you sure you wish to undo your Current
                                  Seller Status?
                                </h6>
                              ),
                              type: "warning",
                              showCancelButton: true,
                              confirmText: "Yes",
                              onCancel: hideAlert,
                              onConfirm: () => {
                                handleUndoStatus();
                              },
                            });
                          }}
                          className="undo-icon p-1 bg-transparent"
                        >
                          <UndoIcon />
                        </Button>

                        <Button
                          type="button"
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Nudge Approver for response"
                          onClick={() => {
                            if (dataState.approval_status === "REQUESTED") {
                              showAlert({
                                title: (
                                  <p className="sweet-title-size sweet-title-padding text-start">
                                    Are you sure you wish to nudge the Approver?
                                  </p>
                                ),
                                type: "warning",
                                showCancelButton: true,
                                confirmText: "Yes",
                                onCancel: hideAlert,
                                onConfirm: () => {
                                  handleNudge("APPROVER"); // replace with appropriate nudge action
                                },
                              });
                            } else {
                              showAlert({
                                title: (
                                  <p className="sweet-title-size sweet-title-padding">
                                    No pending request at Approver
                                  </p>
                                ),
                                type: "error",
                                showCancelButton: false,
                                confirmText: "ok",
                                onConfirm: hideAlert,
                              });
                            }
                          }}
                          className="undo-icon p-1 bg-transparent"
                        >
                          <NudgeApproverSvgIcon />
                        </Button>

                        <Button
                          type="button"
                          data-bs-toggle="tooltip"
                          data-bs-placement="left"
                          title="Nudge Buyer for response"
                          onClick={() => {
                            showAlert({
                              title: (
                                <p className="sweet-title-size sweet-title-padding text-start">
                                  Are you sure you wish to nudge the buyer?
                                </p>
                              ),
                              type: "warning",
                              showCancelButton: true,
                              confirmText: "Yes",
                              onCancel: hideAlert,
                              onConfirm: () => {
                                handleNudge("BUYER"); // replace with appropriate nudge action
                              },
                            });
                          }}
                          className="undo-icon p-1 bg-transparent"
                        >
                          <NudgeSvgIcon />
                        </Button>
                      </div>
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
                          value={
                            options.find(
                              (option) => option.value === updateStatus
                            ) || null
                          }
                          onChange={handleSelectChange}
                          options={options.map((option) => ({
                            ...option,
                            // isdisabled:
                            //   (dataState.approval_status !== "APPROVED" ||
                            //     dataState.approval_status === "REJECTED") &&
                            //   (option.value === "PAYMENT-RECEIVED" ||
                            //     option.value === "GOODS-SENT" ||
                            //     option.value === "PAYMENT-REQUESTED"),
                          }))}
                          //isOptionDisabled={(option) => option.isdisabled} // disable an option
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
            <Button
              color="primary"
              onClick={() => {
                if (
                  dataState.approval_status === "REQUESTED" ||
                  dataState.approval_status === "APPROVED"
                ) {
                  showAlert({
                    title: (
                      <p className="sweet-title-size sweet-title-padding text-start">
                        {getStatusMessageApprovalRequest(
                          dataState.approval_status
                        )}
                      </p>
                    ),
                    type: "error",
                    showCancelButton: false,
                    confirmText: "ok",
                    onConfirm: hideAlert,
                  });
                } else {
                  openModal("approval-modal");
                }
              }}
              type="button"
            >
              REQUEST APPROVAL
            </Button>
            <Button
              color="primary"
              type="button"
              onClick={handleFormSubmission}
            >
              update
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

      <ModalComponent
        modalId="approval-modal"
        title={
          <h6 className="text-white m-0 d-flex align-items-center">
            APPROVE REQUEST
          </h6>
        }
        content={<ApproverSelectionContent key={refreshModal} />}
        showModal={activeModal === "approval-modal"}
        onCloseCross={closeModal}
        onClose={closeModal}
        onSubmit={() => {
          if (
            latestSelectedApprovalRef.current === null ||
            latestSelectedApprovalRef.current === ""
          ) {
            setValidationError(true);
          } else {
            setValidationError(false);
            showAlert({
              title: "Are you sure?",
              type: "warning",
              onConfirm: () => approvalRequest(),
              onCancel: hideAlert,
            });
          }
        }}
        closeButtonText="Cancel"
        submitButtonText="Send Request"
        closeButtonColor="red" // Dynamic color for close button
        submitButtonColor="green" // Dynamic color for submit button
      />
    </>
  );
};

export default Edit;
