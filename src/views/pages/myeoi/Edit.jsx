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
  InputGroup,
  InputGroupText,
} from "reactstrap";
import Select from "react-select";
import moment from "moment";
import ActivityTable from "components/Common/EoiTrackingHistory";
import { approvalStatusOptions } from "variables/common";
import { myEoIUpdateoptions } from "variables/common";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAlert } from "components/Common/NotificationAlert";
import UndoIcon from "components/svg/Undo";

import { Tooltip } from "bootstrap"; // Import Bootstrap's Tooltip
import { getStatusMessage } from "variables/common";
import WarningIcon from "components/svg/Warning";
import NudgeSvgIcon from "components/svg/Nudge";
import { getUndoStatusMessage } from "variables/common";
import { getNudgeMessage } from "variables/common";
import AlertIcon from "components/svg/AlertIcon";
import { handleInput } from "variables/common";
import { currencyOptions } from "variables/common";

const Edit = () => {
  const [dataState, setDataState] = useState({});
  const [eoiState, setEoiState] = useState({});
  const [activities, setActivities] = useState({});
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const { inventoryId, eoiId } = useParams();
  const headers = { user_id: sessionStorage.getItem("username") };
  const [refreshMainComponent, setRefreshMainComponent] = useState(0);
  const [updateStatus, setUpdateStatus] = useState(null);
  const [inventoryData, setInventoryData] = useState(null);

  const navigate = useNavigate();

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here

  const fetchData = async () => {
    try {
      setLoader(true);
      const params = new URLSearchParams({
        source_module: "MYEOI",
      });
      // Start all the promises simultaneously
      const [res, resEoi, resEoiActivities, inventory] = await Promise.all([
        EndPointService.inventoryBaseEoiDetails(
          headers,
          inventoryId,
          eoiId,
          params
        ),
        EndPointService.getMyEoI(headers, username),
        EndPointService.eoiActivityTrackingHistory(headers, inventoryId, eoiId),
        EndPointService.getInventoryById(headers, inventoryId),
      ]);

      // Update the state with the results
      setEoiState(resEoi.appRespData[0]);
      setDataState(res.appRespData[0]);
      setActivities(resEoiActivities.appRespData);
      setInventoryData(inventory.appRespData[0]);
    } catch (e) {
      console.log(e);
      setToastType("error");
      setToastMessage(e.appRespMessage);
    } finally {
      // Ensure loader is always turned off
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
  }, [refreshMainComponent]);

  const handleSelectChange = (selectedOption) => {
    setUpdateStatus(selectedOption.value);
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();
    if (updateStatus === null || updateStatus === "") {
      showAlert({
        title: (
          <p className="sweet-title-size sweet-title-padding">
            Please choose an Acknowledgement Status to update
          </p>
        ),
        confirmText: "ok",
        onConfirm: hideAlert,
        type: "warning",
        onCancel: hideAlert,
        showCancelButton: false,
      });
    } else {
      console.log("udpateStatus", updateStatus);
      showAlert({
        title: (
          <>
            {updateStatus === "WITHDRAWN" ? (
              <h6 className="warning-alert">
                <span className="text-center">
                  <span className="bg-danger-content">WARNING:</span> You will
                  not be able to undo Withdrawal or make any updates to EOI
                </span>
              </h6>
            ) : (
              ""
            )}
            <h6 className="warning-alert">
              <span className="text-center">
                <span className="bg-danger-content">WARNING:</span> The status
                you are about to set will instantly become visible to the Buyer
              </span>
            </h6>
          </>
        ),
        content: <h4 className="sweet-alert-sure">Are you sure?</h4>,
        type: "warning",
        onConfirm: () => handleSubmit(),
        onCancel: hideAlert,
      });
    }
  };

  const handleSubmit = async () => {
    setLoader(true);
    try {
      const requestBody = {
        eoi_status: updateStatus,
        source_module: "MYEOI",
      };
      const res = await EndPointService.eoiUpdateStatus(
        headers,
        inventoryId,
        eoiId,
        requestBody
      );

      const statusCode = res.appRespData[0].eoi_update_status;
      const isSuccess = statusCode > 0;
      setLoader(false);
      showAlert({
        title: (
          <h6 className="sweet-title-size sweet-title-padding ">
            {isSuccess
              ? `Acknowledgement Status updated`
              : getStatusMessage(statusCode, "Seller")}
          </h6>
        ),
        content: null, // Only show content for success cases
        type: isSuccess ? "success" : "error", // Default to "success", otherwise "error"
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          setUpdateStatus(null);
          setRefreshMainComponent(refreshMainComponent + 1);
        },
      });
    } catch (e) {
      console.log("error");
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleApprove = () => {
    console.log("handleapprove");
    setAlert(
      <ReactBSAlert
        input
        title="Approval"
        showCancel
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Submit"
        cancelBtnText="Cancel"
        onConfirm={submitApproval}
        onCancel={() => hideAlert()}
        btnSize=""
      >
        <div>
          <Label>Approval Status</Label>
          <Select
            className="react-select primary"
            classNamePrefix="react-select"
            name="approval_status"
            // value={options.find((option) => option.value === approvalStatus)}
            // onChange={(selectedOption) =>
            //   setApprovalStatus(selectedOption.value)
            // }
            options={approvalStatusOptions}
            placeholder="Select an approval status"
            required
          />
        </div>
      </ReactBSAlert>
    );
  };

  const buyerConfirmation = () => {
    showAlert({
      title: <h4 className="sweet-alert-sure">Are you sure?</h4>,
      type: "warning",
      onConfirm: () => handleFormBuyerDetails(),
      onCancel: hideAlert,
    });
  };

  const handleFormBuyerDetails = async () => {
    setLoader(true);
    try {
      const requestBody = {
        buyer_name: dataState.buyer_name,
        organization: dataState.organization,
        contact_no: dataState.contact_no,
        email: dataState.email,
        address: dataState.address,
        delivery_location: dataState.delivery_location,
        contact_time_preference: dataState.contact_time_preference,
      };
      const res = await EndPointService.updateEoiBuyerDetials(
        headers,
        inventoryId,
        eoiId,
        requestBody
      );
      setLoader(false);
      showAlert({
        title: (
          <h6 className="sweet-title-size sweet-title-padding">
            Buyer details updated
          </h6>
        ),
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
        },
      });
    } catch (e) {
      console.log("error");
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const submitApproval = () => {
    console.log("approval");
  };

  const handleUndoStatus = async () => {
    try {
      const requestBody = {
        source_module: "MYEOI",
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
          <p className="sweet-title-size sweet-title-padding">
            {getUndoStatusMessage(undoStatus, "Seller")}
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

  const handleNudge = async () => {
    setLoader(true);
    try {
      const params = {
        send_nudge_to: "SELLER",
      };
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
            {getNudgeMessage(res.appRespData[0].eoi_nudge, "SELLER")}
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
            {/* Reference Item Summary*/}
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
                    Item Reference
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Item Id</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_id"
                          value={dataState.asset_id}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Asset Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_id"
                          value={dataState.ref_asset_name}
                          readOnly
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Seller Title</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_title" // Corrected name field
                          value={dataState.ref_asset_seller}
                          readOnly
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6  more-col">
                      <Link
                        to={`/admin/myeoi/${dataState.asset_id}/show/${dataState.id}`}
                      >
                        More...
                      </Link>
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
                          maxLength={40}
                          name="buyer_name"
                          value={dataState.buyer_name}
                          onInput={handleInput("alphaNumeric")}
                          onChange={(e) =>
                            setDataState((previousState) => ({
                              ...previousState,
                              buyer_name: e.target.value,
                            }))
                          }
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Company</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="organization"
                          maxLength={40}
                          onInput={handleInput("alphaNumericDashSlash")}
                          value={dataState.organization}
                          onChange={(e) =>
                            setDataState((previousState) => ({
                              ...previousState,
                              organization: e.target.value,
                            }))
                          }
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
                          maxLength={15}
                          onInput={handleInput("numericPlus")}
                          value={dataState.contact_no}
                          onChange={(e) =>
                            setDataState((previousState) => ({
                              ...previousState,
                              contact_no: e.target.value,
                            }))
                          }
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label>Email</Label>
                      <FormGroup className={`has-label ${dataState.email}`}>
                        <Input
                          type="text"
                          name="email"
                          maxLength={40}
                          value={dataState.email}
                          onChange={(e) =>
                            setDataState((previousState) => ({
                              ...previousState,
                              email: e.target.value,
                            }))
                          }
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
                          maxLength={60}
                          onInput={handleInput("alphaNumericDashSlash")}
                          onChange={(e) =>
                            setDataState((previousState) => ({
                              ...previousState,
                              address: e.target.value,
                            }))
                          }
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
                          onInput={handleInput("alphaNumericDashSlash")}
                          maxLength={60}
                          onChange={(e) =>
                            setDataState((previousState) => ({
                              ...previousState,
                              delivery_location: e.target.value,
                            }))
                          }
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
                          maxLength={30}
                          onChange={(e) =>
                            setDataState((previousState) => ({
                              ...previousState,
                              contact_time_preference: e.target.value,
                            }))
                          }
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      color="primary"
                      type="button"
                      onClick={buyerConfirmation}
                    >
                      update
                    </Button>
                  </div>
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

            {inventoryData?.statuscode !== "Sold" &&
            dataState.buyer_eoi_status !== "WITHDRAWN" ? (
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
                      Acknowledgement To Seller
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
                            title="Undo Current Buyer Status"
                            onClick={() => {
                              showAlert({
                                title: (
                                  <h6 className="warning-alert ">
                                    <span className="text-center">
                                      <span className="bg-danger-content">
                                        WARNING:
                                      </span>{" "}
                                      The Buyer might have already reacted to
                                      your current status
                                    </span>
                                  </h6>
                                ),
                                content: (
                                  <h6 className="sweet-title-size sweet-title-padding">
                                    Are you sure you wish to undo your Current
                                    Buyer Status?
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
                            title="Nudge Seller for response"
                            onClick={() => {
                              showAlert({
                                title: (
                                  <p className="sweet-title-size sweet-title-padding">
                                    Are you sure you wish to nudge the seller?
                                  </p>
                                ),
                                type: "warning",
                                showCancelButton: true,
                                confirmText: "Yes",
                                onCancel: hideAlert,
                                onConfirm: () => {
                                  handleNudge(); // replace with appropriate nudge action
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
                        <Label>Status *</Label>
                        <FormGroup>
                          <Select
                            className="react-select primary"
                            classNamePrefix="react-select"
                            name="eoi_status"
                            value={
                              myEoIUpdateoptions.find(
                                (option) => option.value === updateStatus
                              ) || null
                            }
                            options={myEoIUpdateoptions.map((option) => ({
                              ...option,
                            }))}
                            onChange={handleSelectChange}
                            placeholder="Select an option"
                          />
                        </FormGroup>
                      </Col>
                    </Row>

                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <Button
                        color="primary"
                        type="button"
                        onClick={handleFormSubmission}
                      >
                        UPDATE
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            ) : (
              ""
            )}
          </Row>
          {alert}
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

export default Edit;
