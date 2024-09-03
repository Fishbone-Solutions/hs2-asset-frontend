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
import ReactBSAlert from "react-bootstrap-sweetalert";
import { approvalStatusOptions } from "variables/common";
import { myEoIUpdateoptions } from "variables/common";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Edit = () => {
  const [dataState, setDataState] = useState({});
  const [eoiState, setEoiState] = useState({});
  const [activities, setActivities] = useState({});
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const { inventoryId, eoiId } = useParams();
  const [alert, setAlert] = useState(null);
  const headers = { user_id: localStorage.getItem("username") };
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const navigate = useNavigate();

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

      navigate("/admin/myeoi");
      hideAlert();
      setLoader(false);
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

  const submitApproval = () => {
    console.log("approval");
  };

  const hideAlert = () => {
    setAlert(null);
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
                          value={eoiState.eoi_status}
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
                    Reference Item Summary
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
                </CardBody>
              </Card>
            </Col>
          </Row>
          {alert}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
