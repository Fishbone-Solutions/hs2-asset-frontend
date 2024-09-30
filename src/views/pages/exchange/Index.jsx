import React, {
  PropTypes,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "../../../services/methods";
import {
  Container,
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
} from "reactstrap";
import {
  IoSearchSharp,
  IoCloseSharp,
  IoMegaphoneOutline,
} from "react-icons/io5";
import ReactTable from "components/ReactTable/ReactTable";
import { Form, NavLink, useNavigate } from "react-router-dom";
import DateRangePicker from "components/Common/DateRangePicker";
import { GlobalContext } from "@/GlobalState";
import TableColumn from "variables/tables/exchange/Index";
import FloatingLabelDropdown from "components/Common/FloatingLabelDropdown";
import SvgSearchPlus from "components/svg/SearchPlus";
import RefreshComponetIcon from "components/svg/RefreshComponet";
import { categorycode1 } from "variables/common";
import { subCategory } from "variables/common";
import ModalComponent from "components/Common/ModalComponent";
import moment from "moment";

const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const { username } = useContext(GlobalContext);
  const [isHovered, setIsHovered] = useState(false);
  const [refreshData, setRefreshData] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  const [clearDateBoolean, setClearDateBoolean] = useState(false);
  const [cities, setCities] = useState([]);
  
  const [appliedFilters, setAppliedFilters] = useState([]);

  const headers = { user_id: sessionStorage.getItem("username") };
  const [rangeDates, setRangeDates] = useState({
    startDate: "",
    endDate: "",
  });

  const [filterFormData, setFilterFormDate] = useState({
    id: "",
    asset_name: "",
    category: null,
    subCategory: null,
    available_from: null,
    available_to: null,
    statuscode: null,
    city: null,
    location: null,
  });

  const [filterDataState, setFilterDataState] = useState({
    id: null,
    asset_name: null,
    statuscode: null,
    category: null,
    subCategory: null,
    city: null,
    location: null,
  });

  const getValueOrDefault = (value) => (value ? value : "-1");
  const [activeModal, setActiveModal] = useState(null);

  
  const fetchCityData = async () => {
    try {
      const res = await EndPointService.getCityData();
      console.log('city', res);
      setCities(res.appRespData);
    } catch (e) {
      console.log(e);
    }
  }

  const fetchInventory = async () => {
    try {
      setLoader(true);
      // Construct the query parameters
      const params = new URLSearchParams({
        fltr_id: getValueOrDefault(filterFormData.id),
        fltr_name: getValueOrDefault(filterFormData.asset_name),
        fltr_status: getValueOrDefault(filterFormData.statuscode),
        fltr_category1: getValueOrDefault(filterFormData.category),
        fltr_category2: getValueOrDefault(filterFormData.subCategory),
        fltr_from_availability: getValueOrDefault(
          filterFormData.available_from
        ),
        fltr_to_availability: getValueOrDefault(filterFormData.available_to),
        fltr_city: getValueOrDefault(filterFormData.city),
        fltr_location: getValueOrDefault(filterFormData.location),
      });

      const res = await EndPointService.getExchange(headers, params);
      setDataState(res.appRespData);
      setLoader(false);
    } catch (e) {
      console.log(e);
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleEoI = () => {};

  useEffect(() => {
    fetchInventory();
    fetchCityData();
    const filters = [];
    if (filterFormData.id)
      filters.push({ label: ` ${filterFormData.id}`, key: "id" });
    if (filterFormData.asset_name)
      filters.push({
        label: `${filterFormData.asset_name}`,
        key: "asset_name",
      });
    if (filterFormData.location)
        filters.push({
          label: `${filterFormData.location}`,
          key: "location",
        });
    if (filterFormData.city)
          filters.push({
            label: `${filterFormData.city}`,
            key: "city",
          });
    if (filterFormData.category)
          filters.push({
            label: `${filterFormData.category}`,
            key: "category",
          });
      if (filterFormData.subCategory)
            filters.push({
              label: `${filterFormData.subCategory}`,
              key: "subCategory",
            });
   
    if ((filterFormData.available_from !== '' && filterFormData.available_from !== null ) && (filterFormData.available_to !== '' && filterFormData.available_to !== null))
      filters.push({
        label: `Availablility: ${filterFormData.available_from} ${filterFormData.available_to}`,
        key: ["available_from", "available_to"],
      });
    if (filterFormData.status)
      filters.push({
        label: `${filterFormData.status.label}`,
        key: "status",
      });

    setAppliedFilters(filters);
    console.log("applied filter", appliedFilters, filterFormData);
  }, [filterFormData]);

  const handleDate = (startDate, endDate) => {
    setRangeDates((prevState) => ({
      ...prevState,
      startDate: moment(startDate).format("DD/MM/YYYY"),
      endDate: moment(endDate).format("DD/MM/YYYY"),
    }));

    setClearDateBoolean(false);
  };

  const handleClearClick = () => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: "",
      asset_name: "",
      available_from: "",
      available_to: "",
      category: "",
      subCategory: "",
      location: "",
    }));
    setFilterDataState({
      id: "",
      asset_name: "",
      statuscode: "",
      category: "",
      subCategory: "",
      location: "",
    });

    setClearDateBoolean(true);
  };

  const handleAdvancedFilter = () => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: filterDataState.id,
      asset_name: filterDataState.asset_name,
      available_from: rangeDates.startDate,
      available_to: rangeDates.endDate,
      category: filterDataState.category,
      subCategory: filterDataState.subCategory,
      city: filterDataState.city,
      location: filterDataState.location,
    }));
  };

  const handleNameSearch = (e) => {
    if (e.key === "Enter") {
      setFilterFormDate({ asset_name: e.target.value });
    }
  };

  const openModal = (modalId) => {
    setModalIsOpen(true);
    if (inputValue.length > 0) {
      setFilterFormDate({ ...filterFormData, asset_name: "" });
      clearInput();
    }
    setActiveModal(modalId);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const clearInput = () => {
    setFilterFormDate({ ...filterFormData, asset_name: "" });
    handleClearClick();
    setInputValue("");
  };

  const handleRefreshComponet = () => {
    const refreshUpdateData = refreshData + 1;
    setRefreshData(refreshUpdateData);
    clearInput();
  };

  const handleCategoryChange = (category) => {
    console.log(category);
    setFilterDataState({ ...filterDataState, category: category.value });
    setClearDateBoolean(false);
  };

  const handleSubCategoryChange = (subCategory) => {
    console.log(subCategory);
    setFilterDataState({ ...filterDataState, subCategory: subCategory.value });
    setClearDateBoolean(false);
  };

  const handleCityChange = (city) => {
    setFilterDataState({ ...filterDataState, city: city.value });
    setClearDateBoolean(false);
  };
  const closeModal = () => setActiveModal(null);

  const handleRemoveFilter = (filterKeys) => {
    // If filterKeys is not an array, convert it into an array
    const keys = Array.isArray(filterKeys) ? filterKeys : [filterKeys];

    // Update the filter form state
    setFilterFormDate((prev) => {
      const updatedState = { ...prev };
      keys.forEach((key) => {
        updatedState[key] = key === "status" ? null : ""; // Handle special cases like 'status'
      });
      return updatedState;
    });

    // Remove the filter(s) from the applied filters array
    setAppliedFilters((prevFilters) =>
      prevFilters.filter((filter) => !keys.includes(filter.key))
    );

    // Update filter data state
    setFilterDataState((prev) => {
      const updatedState = { ...prev };
      keys.forEach((key) => {
        updatedState[key] = ""; // Reset the field in filterDataState
      });
      return updatedState;
    });
  };

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
              <CardBody className="pt-4">
                <Container className="custom-fuild mb-1" fluid>
                  <Row className="align-items-center">
                    <Col xs={12} md={12}>
                      <div className="d-flex justify-content-end align-items-center">
                        {/* Search Input */}
                        <div className="custom-input-search input-group flex-grow-1 mt-2 me-2 col-5">
                          <span className="input-group-text" id="basic-addon1">
                            <IoSearchSharp size="1.5em" color="white" />
                          </span>
                          <input
                            type="text"
                            id="quickSearch"
                            onKeyPress={handleNameSearch}
                            onChange={handleInputChange}
                            value={inputValue}
                            className={`form-control custom-placeholder ${inputValue ? "active-close-btn" : ""}`}
                            placeholder="Type name of item you are looking for or use Advanced search"
                          />
                          {inputValue && (
                            <span
                              className="input-group-text close-search-btn"
                              onClick={clearInput}
                              style={{ cursor: "pointer" }}
                            >
                              <IoCloseSharp color="red" />
                            </span>
                          )}
                        </div>

                        {/* Search Icon */}

                        <div className="ms-auto d-inline-flex">
                          <div
                            onClick={handleRefreshComponet}
                            className="me-2 icon-style"
                            style={{ cursor: "pointer" }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Refresh Gird"
                          >
                            <RefreshComponetIcon
                              width="30"
                              height="30"
                              color="white"
                              size="2.4em"
                            />
                          </div>
                          <div
                            onClick={() => openModal('filter-modal')}
                            className="me-2 icon-style"
                            style={{ cursor: "pointer" }}
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Advanced Search"
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
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Request Equipment"
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
                <div className="applied-filters">
                  {appliedFilters && appliedFilters.length > 0 &&
                    appliedFilters.map((filter) => (
                      <div
                        key={filter.key}
                        className="filter-tag badge text-black rounded-pill"
                      >
                        {filter.label}
                        <button
                          type="button"
                          onClick={() => handleRemoveFilter(filter.key)}
                          className="btn text-black p-0 ms-2 "
                        >
                          <i className="p-1 rounded-circle  fa fa-times"></i>
                        </button>
                      </div>
                    ))}
                </div>

                <ReactTable
                  data={dataState}
                  columns={TableColumn()}
                  isLoading={loader}
                  className="-striped -highlight primary-pagination "
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      
      <ModalComponent
        modalId="filter-modal"
        title={
          <h6 className="text-white m-0 d-flex align-items-center">
                        <SvgSearchPlus
                          width="25"
                          height="25"
                          className="me-2"
                        />
                        Advanced Search
                      </h6>
        }
        content={
          <>
          <Row>
          <Col sm="6">
            <FormGroup floating>
              <Input
                id="id"
                name="id"
                value={filterDataState.id}
                onChange={(e) =>
                  setFilterDataState((previousState) => ({
                    ...previousState,
                    id: e.target.value,
                  }))
                }
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
                value={filterDataState.asset_name}
                onChange={(e) =>
                  setFilterDataState((previousState) => ({
                    ...previousState,
                    asset_name: e.target.value,
                  }))
                }
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
              options={categorycode1}
              onChange={handleCategoryChange}
              clearSelection={clearDateBoolean}
            />
          </Col>
          <Col sm="6">
            <FloatingLabelDropdown
              label="Sub-Category"
              options={subCategory}
              onChange={handleSubCategoryChange}
              clearSelection={clearDateBoolean}
            />
          </Col>

          <Col sm="6">
            <FormGroup>
              <DateRangePicker
                label="Availability Range"
                inputName="availablility_range"
                onChange={handleDate}
                clearDates={clearDateBoolean}
              />
            </FormGroup>
          </Col>
              
          <Col sm="6">
          <FormGroup>
          <FloatingLabelDropdown
              label="City"
              options={cities.map((city) => ({
                value: city.code,
                label: city.name
              }))}
              onChange={handleCityChange}
              clearSelection={clearDateBoolean}
            />
                              </FormGroup>
                            </Col>


          <Col sm="6">
            <FormGroup floating>
              <Input
                id="location"
                name="name"
                value={filterDataState.location}
                onChange={(e) =>
                  setFilterDataState((previousState) => ({
                    ...previousState,
                    location: e.target.value,
                  }))
                }
                placeholder="location"
                type="text"
              />
              <Label for="assetName">Location</Label>
            </FormGroup>
          </Col>
        </Row>
        </>
        }
        showModal={activeModal === "filter-modal"}
        onCloseCross={closeModal}
        onClose={handleClearClick}
        onSubmit={handleAdvancedFilter}
        closeButtonText="Clear"
        submitButtonText="Filter"
        closeButtonColor="red" // Dynamic color for close button
        submitButtonColor="green" // Dynamic color for submit button
      />



      {/* <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Filter Modal"
      >
        <div className="content2">
          <div className="placer">
            <Form>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader className="d-flex justify-content-between align-items-center p-2 card-header-custom">
                      <h6 className="text-white m-0 d-flex align-items-center">
                        <SvgSearchPlus
                          width="25"
                          height="25"
                          className="me-2"
                        />
                        Advanced Search
                      </h6>
                      <button
                        type="button"
                        onClick={closeModal}
                        aria-label="Close"
                      >
                        <i className="fa fa-times text-red"></i>
                      </button>
                    </CardHeader>
                    <CardBody>
                      <Row>
                        <Col sm="6">
                          <FormGroup floating>
                            <Input
                              id="id"
                              name="id"
                              value={filterDataState.id}
                              onChange={(e) =>
                                setFilterDataState((previousState) => ({
                                  ...previousState,
                                  id: e.target.value,
                                }))
                              }
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
                              value={filterDataState.asset_name}
                              onChange={(e) =>
                                setFilterDataState((previousState) => ({
                                  ...previousState,
                                  asset_name: e.target.value,
                                }))
                              }
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
                            options={categorycode1}
                            onChange={handleCategoryChange}
                            clearSelection={clearDateBoolean}
                          />
                        </Col>
                        <Col sm="6">
                          <FloatingLabelDropdown
                            label="Sub-Category"
                            options={subCategory}
                            onChange={handleSubCategoryChange}
                            clearSelection={clearDateBoolean}
                          />
                        </Col>

                        <Col sm="6">
                          <FormGroup>
                            <DateRangePicker
                              label="Availability Range"
                              inputName="availablility_range"
                              onChange={handleDate}
                              clearDates={clearDateBoolean}
                            />
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <FormGroup floating>
                            <Input
                              id="location"
                              name="name"
                              value={filterDataState.location}
                              onChange={(e) =>
                                setFilterDataState((previousState) => ({
                                  ...previousState,
                                  location: e.target.value,
                                }))
                              }
                              placeholder="location"
                              type="text"
                            />
                            <Label for="assetName">Location</Label>
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
                          className="btn btn-success submission px-2 py-2"
                          type="button"
                          onClick={handleAdvancedFilter}
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
      </Modal> */}
    </>
  );
};

export default Index;
