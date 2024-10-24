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
import { Link } from "react-router-dom";
import ModalComponent from "components/Common/ModalComponent";
import { useSearchParams } from "react-router-dom";
import { handleInput } from "variables/common";
import { handleInputFilteration } from "variables/common";

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
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (modalId) => setActiveModal(modalId);
  const [validationError, setValidationError] = useState(false);
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status"); // "approved"
  console.log("status", status);
  const closeModal = () => {
    const modalElement = document.getElementById(activeModal);
    modalElement.classList.remove("show");
    modalElement.style.display = "none"; // Hides the modal
    const backdropElement = document.querySelector(".modal-backdrop");
    if (backdropElement) {
      backdropElement.remove();
    }
    setActiveModal(null);
  };

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
  const handleModalInput = (value) => {
    setParams((prevState) => ({
      ...prevState,
      approval_ref_no: value,
    }));
    setValidationError(false);
  };

  // Handle approval or rejection action
  const handleRequestApprovalOrRejected = (type) => {
    setParams((prevState) => ({
      ...prevState,
      approval_status: type,
      approval_ref_no: "",
    }));
    openModal("approval-modal");

    // showAlert({
    //   customHeader: (
    //     <header class="py-2 mb-4 border-bottom sweet-alert-header">
    //       <div class="container d-flex flex-wrap justify-content-left">
    //         <span class="fs-6 text-white">{type} REQUEST</span>
    //       </div>
    //     </header>
    //   ),
    //   confirmText: type === "APPROVED" ? "APPROVE" : "REJECT",
    //   //title: type === "APPROVED" ? "APPROVAL" : type,
    //   //type: "info",
    //   onConfirm: async () => {
    //     await approvalRequest(type); // No need to pass params, we'll use the ref
    //   },
    //   onCancel: hideAlert,
    //   showCancelButton: true,
    //   content: (
    //     <div className="d-flex flex-wrap justify-content-left text-black mt-2">
    //       <label className="" htmlFor="">
    //         {type === "APPROVED"
    //           ? `Enter CEMAR Ref No to Approve this request`
    //           : `Enter reason of Rejection`}
    //       </label>
    //       <input
    //         type="text"
    //         key={updateInput} // Forcing re-render when state changes
    //         className="form-control"
    //         value={params.approval_ref_no} // Binding to params state
    //         onChange={handleModalInput} // Calling handler directly
    //         placeholder={
    //           type === "APPROVED" ? `CEMAR Ref No` : `Reason of Rejection`
    //         }
    //       />
    //     </div>
    //   ),
    // });
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
          navigate("/admin/approval-requests");
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
                        to={`/admin/approval/inventory/${dataState.asset_id}/show/${requestId}/${eoiId}`}
                      >
                        More...
                      </Link>
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

                    <Col sm="6">
                      <Label>
                        {dataState.approval_status == "APPROVED"
                          ? "CEMAR Ref No"
                          : dataState.approval_status === "Not Requested" ||
                              dataState.approval_status === "Requested"
                            ? "CEMAR Ref No Or Rejection Reason"
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

            {status !== "Processed" ? (
              <>
                <Button
                  className="btn btn-success success-btn"
                  color="primary"
                  style={{ visibility: "visible", opacity: 1 }}
                  onClick={() => {
                    handleRequestApprovalOrRejected("APPROVED");
                    setValidationError(false);
                  }}
                >
                  Approve
                </Button>
                <Button
                  className="btn btn-danger danger-btn"
                  color="secondary"
                  onClick={() => {
                    handleRequestApprovalOrRejected("REJECTED");
                    setValidationError(false);
                  }}
                  style={{ visibility: "visible", opacity: 1 }}
                >
                  Reject
                </Button>
              </>
            ) : (
              ""
            )}
          </div>
        </Form>
      </div>

      <ModalComponent
        modalId="approval-modal"
        title={
          <h6 className="text-white m-0 d-flex align-items-center">
            {params.approval_status === "APPROVED" ? "APPROVE" : "REJECT"}{" "}
            REQUEST
          </h6>
        }
        content={
          <div className="d-flex flex-wrap justify-content-left text-black mt-2">
            <label className="" htmlFor="">
              {params.approval_status === "APPROVED"
                ? `Enter CEMAR Ref No to Approve this request`
                : `Enter reason of Rejection`}
            </label>
            <input
              type="text"
              key={updateInput} // Forcing re-render when state changes
              className="form-control"
              maxLength={params.approval_status === "APPROVED" ? 20 : 40}
              value={params.approval_ref_no} // Binding to params state
              onChange={(e) => {
                const data = handleInputFilteration(
                  "alphaNumericDashSlashColun"
                )(e);
                handleModalInput(data);
              }} // Calling handler directly
              placeholder={
                params.approval_status === "APPROVED"
                  ? `CEMAR Ref No`
                  : `Reason of Rejection`
              }
            />
            {validationError && (
              <div className="text-danger mt-1">
                Please fill the{" "}
                {params.approval_status === "APPROVED"
                  ? `CEMAR Ref No`
                  : `Reason of Rejection`}
              </div>
            )}
          </div>
        }
        showModal={activeModal === "approval-modal"}
        onCloseCross={closeModal}
        onSubmit={() => {
          if (
            params.approval_ref_no === null ||
            params.approval_ref_no === ""
          ) {
            setValidationError(true);
          } else {
            setValidationError(false);
            showAlert({
              title: "Are you sure?",
              type: "warning",
              onConfirm: () => approvalRequest(params.approval_status),
              onCancel: hideAlert,
            });
          }
        }}
        onClose={closeModal}
        closeButtonText="Cancel"
        submitButtonText={
          params.approval_status === "APPROVED" ? "APPROVE" : "REJECT"
        }
        closeButtonColor="red" // Dynamic color for close button
        submitButtonColor="green" // Dynamic color for submit button
      />
    </>
  );
};

export default Show;
