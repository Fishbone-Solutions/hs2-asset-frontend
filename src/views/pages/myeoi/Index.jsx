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
  CardFooter,
  Row,
  Col,
  Modal,
  Container,
} from "reactstrap";
import ReactTable from "../../../components/ReactTable/ReactTable";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_ADDRESS from "views/components/serverAddress";
import DateRangePicker from "components/Common/DateRangePicker";
import defaultLiveIconImage from "assets/img/live.png";
import { IoSearchSharp, IoMegaphoneOutline } from "react-icons/io5";
import SvgSearchPlus from "components/svg/SearchPlus";
import SvgFilePlus from "components/svg/FilePlus";
import FloatingLabelDropdown from "../../../components/Common/FloatingLabelDropdown";
import { GlobalContext } from "../../../GlobalState";
import TableColumn from "variables/tables/inventory";


const  MyEoI  = () =>   {
  const [formData, setFormData] = useState([]);
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
          `${BACKEND_ADDRESS}/users/${username}/eoi`,
          requestOptions,
        );
        const result = await response.json();
        setFormData(result.appRespData);
        console.log(result);
      } catch (error) {
        setErrorMessage(
          "Unable to load data. Please refresh the page or load after time",
        );
        console.error(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure this effect runs only once when the component mounts

  const handleView = (asset_id, mode) => {
    navigate(`/admin/assetregister/${asset_id}?mode=${mode}`);
  };

    const handleSubmissionEoi = (assetId, mode, eoino) => {
      console.log("mode from edit", mode);
      navigate(`/admin/eoi/details/${assetId}?mode=${mode}&eoino=${eoino}`);
    };

  const handleDate = (startDate, endDate) => {
    set;
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
  const handleCategoryChange = (category) => {
    console.log(category);
  };

  const handleSubCategoryChange = (subCategory) => {
    console.log(subCategory);
  };

  const handleClearClick = () => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: "",
      asset_name: "",
      available_from: "",
      available_to: "",
    }));
  };

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Used-Working", label: "Used - Working" },
    { value: "Used-Not-Working", label: "Used - Not Working" },
    { value: "Refurbished", label: "Refurbished" },
    { value: "Expired", label: "Expired" },
  ];
  const optionsCategory1 = [
    { value: "construction-office", label: "Construction Office" },
    {
      value: "storage-logistics-facilities",
      label: "Storage/Logistics Facilities",
    },
    { value: "processing-facilities", label: "Processing Facilities" },
    { value: "fixed-services", label: "Fixed Services" },
    { value: "temporary-services", label: "Temporary Services" },
    { value: "security", label: "Security" },
    {
      value: "compound-security-safety-infrastructure",
      label: "Compound Security/Safety Infrastructure",
    },
    {
      value: "site-roads-and-infrastructure",
      label: "Site Roads and Infrastructure",
    },
    { value: "temporary-siding", label: "Temporary Siding" },
    { value: "consolidation-yards", label: "Consolidation Yards" },
    { value: "concrete-production", label: "Concrete Production" },
    { value: "diversions", label: "Diversions" },
    { value: "earthworks", label: "Earthworks" },
    { value: "static-plant", label: "Static Plant" },
    { value: "piling", label: "Piling" },
    { value: "pipework", label: "Pipework" },
    {
      value: "public-highway-traffic-management",
      label: "Public Highway Traffic Management",
    },
    { value: "other-assets", label: "Other Assets" },
  ];

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  // EoI.No, Submission Date, Item, Seller, Status

  return (
    <>
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
                            <span
                              className="input-group-text"
                              id="basic-addon1"
                            >
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
                                <IoMegaphoneOutline
                                  color="white"
                                  size="2.2em"
                                />
                              </div>
                            </button>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                  <ReactTable
                    data={formData}
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
                                mode="single"
                                onChange={(start, end) =>
                                  console.log("Selected date:", start, end)
                                }
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
    </>
  );
}

export default MyEoI;