import DynamicToast from "components/Common/Toast";
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
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EndPointService } from "@/services/methods";
import TableColumn from "variables/tables/inventory/Eoi";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { GlobalContext } from "@/GlobalState";
import ReactTable from "components/ReactTable/ReactTable";

const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [inventoryData, setInventoryData] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const { id } = useParams();
  console.log(TableColumn);

  const fetchData = async () => {
    console.log("calll");
    try {
      setLoader(true);
      const headers = { user_id: username };
      //inventory
      const res = await EndPointService.getInventoryById(headers, id);
      setInventoryData(res.appRespData[0]);
      //eois
      const eoiData = await EndPointService.eoiOnbehaveInventory(headers, id);
      setDataState(eoiData.appRespData);
      setToastType("success");
      setToastMessage(eoiData.appRespMessage);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = (assetId, eoino) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(assetId, eoino)}
        onCancel={cancelDelete}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this item.
      </ReactBSAlert>
    );
  };

  const successDelete = (assetId, eoiNo) => {
    console.log("successfully delete");
  };

  return (
    <>
      <div className="content">
        <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        />
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
                    Item Reference
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>ID</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="code"
                          value={inventoryData.asset_id}
                          required
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_name"
                          value={inventoryData.asset_name}
                          required
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Description</Label>
                      <FormGroup
                        className={`has-label ${inventoryData.seller_email}`}
                      >
                        <Input
                          type="text"
                          name="description"
                          value={inventoryData.description}
                          required
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Availability</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="statuscode"
                          value={inventoryData.available_from}
                          required
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col md="12">
            <Card>
              <CardHeader
                className="mb-1 pt-0"
                style={{
                  translate: "4.8px 20px",
                }}
              >
                <CardTitle
                  tag="h6"
                  className="fw-bold"
                  style={{
                    color: "#52cbce",
                  }}
                >
                  Expression of Interests
                </CardTitle>
              </CardHeader>
              <CardBody>
                <ReactTable
                  data={dataState}
                  columns={TableColumn(handleDelete)}
                  className="-striped -highlight primary-pagination"
                  isLoading={loader}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Index;
