import React from "react";

// reactstrap components
import {
  Badge,
  Card,
  CardBody,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Row,
  Col,
} from "reactstrap";

function W2() {
  return (
    <>
      <div className="content">
        <div className="header text-center">
          <h3 className="title">Approval Requests</h3>
        </div>
        <Row>
          <Col md="12">
            <Card className="card-timeline card-plain"></Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default W2;
