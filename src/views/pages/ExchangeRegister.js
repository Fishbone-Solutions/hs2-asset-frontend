import React from "react";
import { useState, useContext } from "react";
// reactstrap components
import {
  Card,
  Button,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  CardHeader,
  CardTitle,
  CardFooter,
  Row,
  Col,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  NavLink,
  Modal,
  Container,
} from "reactstrap";
import ReactTable from "components/ReactTable/ReactTable.js";
import { GlobalContext } from "GlobalState";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_ADDRESS from "views/components/serverAddress";
import DateRangePicker from "views/components/DateRangePicker";
import defaultLiveIconImage from "assets/img/live.png";

import SvgFilePlus from "../../components/svg/FilePlus";

import FloatingLabelDropdown from "../components/FloatingLabelDropdown";
import {
  IoSearchSharp,
  IoAddCircleOutline,
  IoMegaphoneOutline,
  IoFileTrayStackedSharp,
} from "react-icons/io5";
import SvgSearchPlus from "../../components/svg/SearchPlus";

function ExchangeRegister() {
  const [filterFormData, setFilterFormDate] = useState({
    id: "",
    asset_name: "",
    available_from: "",
    available_to: "",
  });
  const [dataState, setDataState] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [rangeDates, setRangeDates] = useState({ startDate: "", endDate: "" });

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [alert, setAlert] = React.useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { username } = useContext(GlobalContext);

  const handleClearClick = () => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: "",
      asset_name: "",
      available_from: "",
      available_to: "",
    }));
  };

  React.useEffect(() => {
    fetchData();
  }, [filterFormData]); // Empty dependency array to ensure this effect runs only once when the component mounts

  const fetchData = async () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("token", "x8F!@p01,*MH");
    myHeaders.append("user_id", username);
    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    const params = new URLSearchParams({
      fltr_id: getValueOrDefault(filterFormData.id),
      fltr_name: getValueOrDefault(filterFormData.asset_name),
      fltr_from_availability: getValueOrDefault(filterFormData.available_from),
      fltr_to_availability: getValueOrDefault(filterFormData.available_to),
      fltr_category1: getValueOrDefault(filterFormData.fltr_category1),
      fltr_category2: getValueOrDefault(filterFormData.fltr_category2),
    });

    try {
      const response = await fetch(
        `${BACKEND_ADDRESS}/register?${params.toString()}`,
        requestOptions
      );
      const result = await response.json();
      setDataState(result.appRespData);
      console.log(result);
    } catch (error) {
      setErrorMessage(
        "Unable to load data. Please refresh the page or load after time"
      );
      console.error(error);
    }
  };

  const getValueOrDefault = (value) => (value ? value : "-1");

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

  const handleView = (asset_id, mode) => {
    navigate(`/admin/assetregister/${asset_id}?mode=${mode}`);
  };

  const handleSubmissionEoi = (assetId, mode) => {
    navigate(`/admin/exchange/eoisubmission/${assetId}?mode=${mode}`);
  };

  const handleDate = (startDate, endDate) => {
    setRangeDates((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
    }));
  };

  const handleCategoryChange = (category) => {
    console.log(category);
  };

  const handleSubCategoryChange = (subCategory) => {
    console.log(subCategory);
  };

  const statusOptions = [
    { value: "category", label: "category" },
    { value: "category-1", label: "Category-1" },
  ];

  const handleNameSearch = (e) => {
    if (e.key === "Enter") {
      setFilterFormDate({ asset_name: e.target.value });
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
    setFilterFormDate({ ...filterFormData, asset_name: "" });
  };

  const handleInputChange = (e) => {
    // Update the state with the new input value
    setFilterFormDate({ ...filterFormData, asset_name: e.target.value });
  };

  const closeModal = () => setModalIsOpen(false);

  const columns = React.useMemo(
    () => [
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>ID</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "asset_id",
        width: "2%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>CATEGORY</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "categorycode1",
        width: "2%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>SUB CATEGORY</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "categorycode2",
        width: "8%",
      },

      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>NAME</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "asset_name",
        width: "10%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>DESCRIPTION</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "description",
        width: "16%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>SELLER</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "seller_title",
        width: "8%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>AVAILABILITY</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "available_from",
        width: "2%",
      },
      {
        Header: "ACTIONS",
        accessor: "actions",
        sortable: false,
        width: "1%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              className="btn-icon btn-simple"
              color="info"
              size="sm"
              onClick={() => handleView(row.original.asset_id, "view")}
            >
              <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="success"
              size="sm"
              onClick={() => handleSubmissionEoi(row.original.asset_id, "edit")}
            >
              <SvgFilePlus />
            </Button>
          </div>
        ),
      },
    ],
    []
  );
  return (
    <>
      <div className="content">
        {alert}

        <Row>
          <Col md="12">
            <Card>
              <CardBody className="pt-4">
                <Container className="custom-fuild mb-1" fluid>
                  <Row className="align-items-center">
                    <Col xs={12} md={12}>
                      <div className="d-flex justify-content-end align-items-center">
                        {/* Search Input */}
                        <div className="custom-input-search input-group flex-grow-1 mt-2 me-2 col-6">
                          <span className="input-group-text" id="basic-addon1">
                            <IoSearchSharp color="white" />
                          </span>
                          <input
                            type="text"
                            id="quickSearch"
                            onKeyPress={handleNameSearch}
                            handleInputChange={handleInputChange}
                            className="form-control custom-placeholder"
                            placeholder="Type name of item you are looking for or use Advanced search"
                          />
                        </div>

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
                          <button
                            onClick={() =>
                              navigate("/admin/exchange/requestequipment")
                            }
                            className="p-0 icon-style"
                          >
                            <div>
                              <IoMegaphoneOutline color="white" size="2.2em" />
                            </div>
                          </button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Container>
                <ReactTable
                  data={dataState}
                  columns={columns}
                  className="-striped -highlight primary-pagination "
                />
                {errorMessage}
              </CardBody>
              <CardFooter></CardFooter>
            </Card>
          </Col>
        </Row>
      </div>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Filter Modal"
      >
        <div className="content2">
          <div className="placer">
            <Form onSubmit={handleAdvancedFilter}>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center p-2 card-header-custom">
                      <h6 className="text-white m-0 d-flex align-items-center">
                        <SvgSearchPlus
                          width="20"
                          height="20"
                          className="me-2"
                        />
                        Advanced Search
                      </h6>
                      <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close"
                        className="btn-close close-icon"
                      >
                        <i className="fa fa-times text-white"></i>
                      </button>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col sm="6">
                          <FormGroup floating>
                            <Input
                              id="id"
                              name="id"
                              placeholder="ID"
                              type="number"
                            />
                            <Label for="id">ID</Label>
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <FormGroup floating>
                            <Input
                              id="assetName"
                              name="name"
                              placeholder="name"
                              type="text"
                            />
                            <Label for="assetName">Name</Label>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="6">
                          <FloatingLabelDropdown
                            label="Category"
                            options={statusOptions}
                            onChange={handleCategoryChange}
                          />
                        </Col>
                        <Col sm="6">
                          <FloatingLabelDropdown
                            label="Sub-Category"
                            options={statusOptions}
                            onChange={handleSubCategoryChange}
                          />
                        </Col>

                        <Col sm="6">
                          <FormGroup>
                            <DateRangePicker
                              label="Availability Range"
                              inputName="availablility_range"
                              onChange={handleDate}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-primary px-2 py-2"
                          onClick={handleClearClick}
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
}

export default ExchangeRegister;
