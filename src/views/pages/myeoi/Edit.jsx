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
  Tooltip as ReactstrapTooltip,
} from "reactstrap";
import Select from "react-select";
import moment from "moment";
import ActivityTable from "components/Common/EoiTrackingHistory";
import { approvalStatusOptions } from "variables/common";
import { myEoIUpdateoptions } from "variables/common";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAlert } from "components/Common/NotificationAlert";

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
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const navigate = useNavigate();

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here

  const toggleTooltip = () => setTooltipOpen(!tooltipOpen);

  const fetchData = async () => {
    try {
      setLoader(true);
      // Start all the promises simultaneously
      const [res, resEoi, resEoiActivities] = await Promise.all([
        EndPointService.inventoryBaseEoiDetails(headers, inventoryId, eoiId),
        EndPointService.getMyEoI(headers, username),
        EndPointService.eoiActivityTrackingHistory(headers, inventoryId, eoiId),
      ]);

      // Update the state with the results
      setEoiState(resEoi.appRespData[0]);
      setDataState(res.appRespData[0]);
      setActivities(resEoiActivities.appRespData);
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
    fetchData();
  }, []);

  const handleSelectChange = (selectedOption) => {
    setDataState((prevState) => ({
      ...prevState,
      eoi_status: selectedOption.value,
    }));
  };

  const handleFormSubmission = async (event) => {
    event.preventDefault();
    showAlert({
      title: "Are you sure?",
      type: "warning",
      onConfirm: () => handleSubmit(),
      onCancel: hideAlert,
    });
    // setAlert(
    //   <ReactBSAlert
    //     warning
    //     style={{ display: "block", marginTop: "-100px" }}
    //     title="Are you sure?"
    //     onConfirm={() => handleSubmit()}
    //     onCancel={() => hideAlert()}
    //     confirmBtnBsStyle="info"
    //     cancelBtnBsStyle="danger"
    //     confirmBtnText="Yes"
    //     cancelBtnText="Cancel"
    //     showCancel
    //     btnSize=""
    //   />
    // );
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

      setLoader(false);
      showAlert({
        title: `EOI Submitted to the Seller.`,
        message: `Eoi ID = ${eoiId}`,
        type: "success",
        showCancelButton: false,
        confirmText: "Ok",
        onConfirm: () => {
          hideAlert();
          navigate("/admin/myeoi");
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
      title: "Are you sure?",
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
        title: `Buyer Update successfully.`,
        message: ``,
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
                      <Label>Asset Id</Label>
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
                          name="buyer_name"
                          value={dataState.buyer_name}
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
                      SAVE
                    </Button>
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
                    Acknowledgement To Seller
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
                          value={myEoIUpdateoptions.find(
                            (option) => option.value === dataState.eoi_status
                          )}
                          onChange={handleSelectChange}
                          options={myEoIUpdateoptions}
                          placeholder="Select an option"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      color="primary"
                      type="button"
                      onClick={handleFormSubmission}
                    >
                      SAVE
                    </Button>
                  </div>
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
              CLOSE
            </Button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Edit;
