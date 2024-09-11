import React, { useContext, useEffect, useState } from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "@/services/methods";
import {
  Card,
  CardBody,
  Row,
  Col,
} from "reactstrap";
import { GlobalContext } from "@/GlobalState";
const BulkImport = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const { username } = useContext(GlobalContext);
  return (
    <>
      <div className="content">
        <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        />
        {alert}
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <p>Bulk Import</p>
              </CardBody>
              </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default BulkImport;
