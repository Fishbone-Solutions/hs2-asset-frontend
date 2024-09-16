import React, { useContext, useEffect, useState } from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "@/services/methods";
import { FileUpload } from "primereact/fileupload";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Progress,
  Label,
  Button,
} from "reactstrap";
import { GlobalContext } from "@/GlobalState";

import ReactTable from "components/ReactTable/ReactTable";

import TableColumn from "variables/tables/approval/Index";
const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const headers = {
    user_id: sessionStorage.getItem("username") ?? username,
  };
  const fetchData = async () => {
    setLoader(true);
    try {
      const res = await EndPointService.getApprovalRequests(headers);
      setDataState(res.appRespData);
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
                <CardBody>
                  <Row>
                    <ReactTable
                      data={dataState}
                      columns={TableColumn()}
                      isLoading={loader}
                      className="-striped -highlight primary-pagination "
                    />
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default Index;
