import React, { useContext, useEffect, useState } from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "../../../services/methods";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  CardHeader,
  Label,
  FormGroup,
  Modal,
  Container,
} from "reactstrap";
import { IoSearchSharp } from "react-icons/io5";
import ReactTable from "../../../components/ReactTable/ReactTable";
import { Form } from "react-router-dom";
import DateRangePicker from "components/Common/DateRangePicker";
import { GlobalContext } from "@/GlobalState";
import TableColumn from "variables/tables/myeoi/Index";

const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const { username } = useContext(GlobalContext);
  const [isHovered, setIsHovered] = useState(false);

  const [rangeDatesEntry, setRangeDatesEntry] = useState({
    startDate: null,
    endDate: null,
  });

  const [filterFormData, setFilterFormData] = useState({
    id: "",
    asset_id: "",
    asset_name: "",
    entry_date_from: null,
    entry_date_to: null,
  });

  const getValueOrDefault = (value) => (value ? value : "-1");

  const fetchMyEoI = async () => {
    try {
      setLoader(true);
      const headers = { user_id: username };
      const params = new URLSearchParams({
        fltr_eoi_id: getValueOrDefault(filterFormData.id),
        fltr_item_id: getValueOrDefault(filterFormData.asset_id),
        fltr_item_name: getValueOrDefault(filterFormData.asset_name),
        fItr_from_subDate: getValueOrDefault(filterFormData.entry_date_from),
        fItr_to_subDate: getValueOrDefault(filterFormData.entry_date_to),
      });

      const res = await EndPointService.getMyEoI(headers, username, params);
      setDataState(res.appRespData);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage || "Error fetching data");
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchMyEoI();
  }, [filterFormData]);

  const handleFilter = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setFilterFormData((prevState) => ({
      ...prevState,
      id: formData.get("id"),
      asset_id: formData.get("asset_id"),
      asset_name: formData.get("itemname"),
      entry_date_from: rangeDatesEntry.startDate,
      entry_date_to: rangeDatesEntry.endDate,
    }));
  };

  const handleClear = () => {
    setFilterFormData({
      id: "",
      asset_id: "",
      asset_name: "",
      entry_date_from: null,
      entry_date_to: null,
    });
  };

  const handleEntryDate = (startDate, endDate) => {
    setRangeDatesEntry((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
    }));
  };
  return (
    <>
      <div className="content">
        {toastType && <DynamicToast type={toastType} message={toastMessage} />}
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <Container className="custom-fuild mb-1" fluid>
                  <Row className="align-items-center">
                    <Col xs={12} md={12}>
                      <div className="d-flex justify-content-end align-items-center">
                        <div className="ms-auto d-inline-flex">
                          <div
                            onClick={openModal}
                            className="icon-style"
                            style={{ cursor: "pointer" }}
                          >
                            <IoSearchSharp
                              color="white"
                              size="2.4em"
                              className="icon-btn"
                            />
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
                <ReactTable
                  data={dataState}
                  columns={TableColumn()}
                  isLoading={loader}
                  className="-striped -highlight primary-pagination mt-2"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Filter Modal"
      >
        <div className="content2" style={{ overflow: "hidden" }}>
          <div className="placer">
            <Form onSubmit={handleFilter}>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader
                      className="d-flex justify-content-between align-items-center bg-info p-2 card-header-custom"
                      style={{ height: "32px", backgroundColor: "#52CBCE" }}
                    >
                      <h6 className="text-white m-0 d-flex align-items-center">
                        <i
                          className="fa fa-filter me-2 p-1"
                          style={{
                            fontSize: "0.9em",
                            backgroundColor: "#52CBCE",
                            border: "2px solid #52CBCE",
                            borderRadius: "15%",
                          }}
                        ></i>
                        Filter
                      </h6>
                      <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close"
                      >
                        <i
                          className="fa fa-times text-red"
                          style={{ fontSize: "1em" }}
                        ></i>
                      </button>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col sm="6">
                          <FormGroup floating>
                            <Input
                              type="text"
                              name="id"
                              id="id"
                              placeholder="id"
                            />
                            <Label for="id">EoI ID</Label>
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <FormGroup floating>
                            <Input
                              id="asset_id"
                              type="text"
                              name="asset_id"
                              placeholder="Item ID"
                            />
                            <Label for="name">Item ID</Label>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="6">
                          <div className="placer2">
                            <FormGroup>
                              <DateRangePicker
                                label="Submission Date Range"
                                onChange={handleEntryDate}
                              />
                            </FormGroup>
                          </div>
                        </Col>
                        <Col sm="6">
                          <FormGroup>
                            <Input
                              id="itemname"
                              type="text"
                              name="itemname"
                              placeholder="Item Name"
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-primary px-2 py-2"
                          onClick={handleClear}
                          type="button"
                        >
                          Clear
                        </button>
                        <button
                          className="btn btn-success px-2 py-2"
                          type="submit"
                        >
                          Filter
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Index;
