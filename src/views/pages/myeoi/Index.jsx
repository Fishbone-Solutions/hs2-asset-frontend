import React, {
  PropTypes,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "../../../services/methods";
import { Link } from "react-router-dom";
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
  Modal,
  Container,
} from "reactstrap";
import {
  IoSearchSharp,
  IoMegaphoneOutline,

} from "react-icons/io5";
import ReactTable from "../../../components/ReactTable/ReactTable";
import { Form, NavLink, useNavigate } from "react-router-dom";
import DateRangePicker from "components/Common/DateRangePicker";
import { GlobalContext } from "@/GlobalState";
import TableColumn from "variables/tables/myeoi/Index";
import { itemStatusOptions } from "variables/common";
import FloatingLabelDropdown from "components/Common/FloatingLabelDropdown";
import SvgSearchPlus from "components/svg/SearchPlus";
import { orderStatusOptions } from "variables/common";
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
    startDate: "",
    endDate: "",
  });
  const [rangeDatesAvailablility, setRangeDatesAvailablility] = useState({
    startDate: "",
    endDate: "",
  });
  const [filterFormData, setFilterFormDate] = useState({
    id: "",
    asset_name: "",
    entry_date_from: null,
    entry_date_to: null,
    available_from: null,
    available_to: null,
    statuscode: null,
  });

  const getValueOrDefault = (value) => (value ? value : "-1");

  const fetchMyEoI = async () => {
    try {
      setLoader(true);
      const headers = { user_id: username };
      // Construct the query parameters
      const params = new URLSearchParams({
        fltr_id: getValueOrDefault(filterFormData.id),
        fltr_name: getValueOrDefault(filterFormData.asset_name),
        fltr_status: getValueOrDefault(filterFormData.statuscode),
        fltr_from_entry_date: getValueOrDefault(filterFormData.entry_date_from),
        fltr_to_entry_date: getValueOrDefault(filterFormData.entry_date_to),
        fltr_from_availability: getValueOrDefault(
          filterFormData.available_from
        ),
        fltr_to_availability: getValueOrDefault(filterFormData.available_to),
      });

      const res = await EndPointService.getMyEoI(headers,username);
      setDataState(res.appRespData);
      setToastType("success");
      setToastMessage(res.appRespMessage);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  React.useEffect(() => {
    fetchMyEoI();
  }, [filterFormData]);

  const handleFilter = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    setFilterFormDate((prevState) => ({
      ...prevState,
      id: formData.get("id"),
      asset_name: formData.get("name"),
      available_from: rangeDatesAvailablility.startDate,
      available_to: rangeDatesAvailablility.endDate,
      entry_date_from: rangeDatesEntry.startDate,
      entry_date_to: rangeDatesEntry.endDate,
    }));
  };

  const handleEntryDate = (startDate, endDate) => {
    setRangeDatesEntry((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
    }));
  };

  const handleAvailablilityDate = (startDate, endDate) => {
    setRangeDatesAvailablility((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      statuscode: selectedOption.value,
    }));
  };

  const handleNameSearch = (e) => {
    if (e.key === "Enter") {
      setFilterFormDate({ asset_name: e.target.value });
    }
  };

  const handleInputChange = (e) => {
    // Update the state with the new input value
    setFilterFormDate({ ...filterFormData, asset_name: e.target.value });
  };

  const handleAdvancedFilter = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    setFilterFormDate((prevState) => ({
      ...prevState,
      id: formData.get("id"),
      asset_name: formData.get("name"),
      available_from: rangeDates.startDate,
      available_to: rangeDates.endDate,
    }));
  };

  return (
    <>
      <div className="content">
        <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        />
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
              <Container className="custom-fuild mb-1" fluid>
                    <Row className="align-items-center">
                      <Col xs={12} md={12}>
                        <div className="d-flex justify-content-end align-items-center">
                          {/* Search Input */}
                   

                          {/* Search Icon */}

                          <div className="ms-auto d-inline-flex">
                            <div
                              onClick={openModal}
                              className="me-2 icon-style"
                              style={{ cursor: "pointer" }}
                            >
                              <SvgSearchPlus
                                width="30"
                                height="30"
                                color="white"
                                size="2.4em"
                              />
                            </div>

                            {/* Add Icon */}
                            <Link to="/admin/exchange/requestequipment">
                            <button
                              
                              className="p-0 icon-style"
                            >
                              <div>
                                <IoMegaphoneOutline
                                  color="white"
                                  size="2.2em"
                                />
                              </div>
                            </button>
                            </Link>
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

      {/* { filter modal } */}
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
                          className="fa fa-times text-white"
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
                              onChange=""
                            />

                            <Label for="id">EoI ID</Label>
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <FormGroup floating>
                            <Input
                              id="name"
                              type="text"
                              name="asset_name"
                              placeholder="name"
                              onChange=""
                            />

                            <Label for="name">Name</Label>
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                            <FormGroup>
                              <DateRangePicker
                                label="Entry Range"
                              />
                            </FormGroup>
                        </Col>

                        <Col sm="6">
                          <FormGroup>
                          <Input
                              id="eoi_id"
                              type="text"
                              name="eoi_id"
                              placeholder="Item ID"
                            />
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <FloatingLabelDropdown
                            label="Status"
                            options={orderStatusOptions}
                            onChange={handleSelectChange}
                          />
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-primary px-2 py-2"
                          onClick=""
                          type="clear"
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
