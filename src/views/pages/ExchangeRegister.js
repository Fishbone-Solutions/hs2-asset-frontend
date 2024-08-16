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

import FloatingLabelDropdown from "../components/FloatingLabelDropdown";
import {
  IoSearchSharp,
  IoAddCircleOutline,
  IoMegaphoneOutline,
} from "react-icons/io5";

function ExchangeRegister() {
  const [formData, setFormData] = useState({
    id: "",
    asset_name: "",
    available_from: "",
    available_to: "",
  });
  const [filterFormData, setFilterFormDate] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [alert, setAlert] = React.useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { username } = useContext(GlobalContext);
  const [open, setOpen] = useState();
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const handleClearClick = () => {};

  const [liveIconImage, setliveIconImage] =
    React.useState(defaultLiveIconImage);

  React.useEffect(() => {
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

      try {
        const response = await fetch(
          `${BACKEND_ADDRESS}/register?fltr_id=-1&fltr_name=-1&fltr_from_availability=-1&fltr_to_availability=-1`,
          requestOptions
        );
        const result = await response.json();
        setFilterFormDate(result.appRespData);
        console.log(result);
      } catch (error) {
        setErrorMessage(
          "Unable to load data. Please refresh the page or load after time"
        );
        console.error(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure this effect runs only once when the component mounts

  const handleChange = async (event) => {
    const { name, value } = event.target;
    event.preventDefault();

    const getValueOrDefault = (value) => (value ? value : "-1");

    // Construct the query parameters
    const params = new URLSearchParams({
      fltr_id: getValueOrDefault(filterFormData.id),
      fltr_name: getValueOrDefault(filterFormData.asset_name),
      fltr_from_availability: getValueOrDefault(filterFormData.available_from),
      fltr_to_availability: getValueOrDefault(filterFormData.available_to),
    });

    const url = `${BACKEND_ADDRESS}/assets/-1?${params.toString()}`;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: "x8F!@p01,*MH",
        user_id: username,
      },
    };

    try {
      const response = await fetch(url, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data.appRespData); // Debugging log
      setFilterFormDate(data.appRespData); // Update your component state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleView = (asset_id, mode) => {
    navigate(`/admin/assetregister/${asset_id}?mode=${mode}`);
  };

  const handleSubmissionEoi = (assetId, mode) => {
    navigate(`/admin/exchange/eoisubmission/${assetId}?mode=${mode}`);
  };

  const handleDate = (startDate, endDate) => {
    console.log(startDate, endDate);
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

  const openModal = () => setModalIsOpen(true);
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
              <i className="fa fa-edit" style={{ fontSize: "0.9em" }}></i>
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
                <Container fluid>
                  <Row className="align-items-center">
                    <Col xs={12} md={12}>
                      <div className="d-flex justify-content-end align-items-center">
                        {/* Search Input */}
                        <div className="me-2 flex-grow-1 mt-1">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Type name of item you are looking for or use Advanced search"
                          />
                        </div>

                        {/* Search Icon */}
                        <div
                          onClick={openModal}
                          className="me-2"
                          style={{ cursor: "pointer" }}
                          className="icon-style mr-2"
                        >
                          <IoSearchSharp color="white" size="2.4em" />
                        </div>

                        {/* Add Icon */}
                        <button
                          onClick={() =>
                            navigate("/admin/exchange/requestequipment")
                          }
                          className="p-0 icon-style"
                        >
                          <div>
                            <i class="fa fa-megaphone"></i>
                            <IoMegaphoneOutline color="white" size="2.4em" />
                          </div>
                        </button>
                      </div>
                    </Col>
                  </Row>
                </Container>
                <ReactTable
                  data={filterFormData}
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
            <Form onSubmit={handleChange}>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader
                      className="d-flex justify-content-between align-items-center bg-info p-2"
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
                              onChange={handleDate}
                            />
                          </FormGroup>
                        </Col>
                      </Row>

                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-primary"
                          onClick={handleClearClick}
                          type="clear"
                        >
                          Clear
                        </button>
                        <button className="btn btn-success" type="submit">
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
