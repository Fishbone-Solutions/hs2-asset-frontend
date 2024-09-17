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
import { useAlert } from "components/Common/NotificationAlert";
const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const { username } = useContext(GlobalContext);
  const [activeGird, setActiveGird] = useState("Pending");

  const [refreshData, setRefreshData] = useState(0);
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const headers = {
    user_id: sessionStorage.getItem("username") ?? username,
  };
  const fetchData = async () => {
    setLoader(true);
    try {
      const params = new URLSearchParams({
        fltr_approval_status: activeGird,
      });
      const res = await EndPointService.getApprovalRequests(headers, params);
      setDataState(res.appRespData);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleDelete = (id) => {
    showAlert({
      title: "Are you sure?",
      content: "You will not be able to recover this item",
      type: "warning",
      onConfirm: () => successDelete(id),
      onCancel: hideAlert,
    });
  };

  const successDelete = async (id) => {
    setLoader(true);
    try {
      const res = await EndPointService.deleteApprovalRequest(headers, id);
      showAlert({
        title: "Deleted!",
        content: `Request ID ${id} has been deleted`,
        type: "success",
        showCancelButton: false,
        confirmText: "ok",
        onConfirm: hideAlert,
      });
      setLoader(false);
      setRefreshData(refreshData + 1);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeGird, refreshData]);
  return (
    <>
      <div className="content">
        <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        />
        {alert}
        <Form>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <ul
                    role="tablist"
                    class="nav-pills-primary nav-pills-icons justify-content-end nav nav-pills custom-nav-link"
                  >
                    <li class="nav-item">
                      <a
                        data-toggle="tab"
                        href="#"
                        role="tablist"
                        class={
                          activeGird === "Pending"
                            ? "active nav-link"
                            : "nav-link"
                        }
                        onClick={() => {
                          setActiveGird("Pending");
                        }}
                      >
                        <i class="now-ui-icons objects_umbrella-13"></i>Pending
                      </a>
                    </li>

                    <li class="nav-item">
                      <a
                        data-toggle="tab"
                        href="#"
                        role="tablist"
                        class={
                          activeGird === "Processed"
                            ? "active nav-link"
                            : "nav-link"
                        }
                        onClick={() => {
                          setActiveGird("Processed");
                        }}
                      >
                        <i class="now-ui-icons ui-2_settings-90"></i>Processed
                      </a>
                    </li>
                  </ul>
                </CardHeader>
                <CardBody>
                  <Row>
                    <ReactTable
                      data={dataState}
                      columns={TableColumn(handleDelete)}
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
