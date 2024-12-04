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
import { handleInput } from "variables/common";
import { handleInputFilteration } from "variables/common";
import { useLocation } from "react-router-dom";

import debounce from "lodash/debounce";

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
  const [clearCityBoolean, setClearCityBoolean] = useState(false);
  const [cities, setCities] = useState([]);
  const [cursorRowNo, setCursorRowNo] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalNumberOfRow, setTotalNumberOfRow] = useState(10);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

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
    cityName: null,
    location: null,
    cursor_row_no: 0,
    page_size: 10,
  });

  const [filterDataState, setFilterDataState] = useState({
    id: null,
    asset_name: null,
    statuscode: null,
    category: null,
    subCategory: null,
    city: null,
    cityName: null,
    location: null,
  });

  const getValueOrDefault = (value) => (value ? value : "-1");
  const [activeModal, setActiveModal] = useState(null);

  const fetchCityData = async () => {
    try {
      const res = await EndPointService.getCityData();
      console.log("city", res);
      setCities(res.appRespData);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchInventory = async () => {
    try {
      console.log("filter form data", filterFormData);
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
        fltr_location_city: getValueOrDefault(filterFormData.city),
        fltr_location: getValueOrDefault(filterFormData.location),
        cursor_row_no: filterFormData.cursor_row_no,
        page_size: filterFormData.page_size,
      });
      console.log("params", params);
      const res = await EndPointService.getExchange(headers, params);
      // Update dataState reactively
      setDataState(res?.appRespData);

      // Update pagination-related states
      if (res?.appRespData?.length > 0) {
        const lastItem = res.appRespData[res.appRespData.length - 1];
        setCursorRowNo(lastItem.row_no);
        setTotalNumberOfRow(lastItem.row_count);
      } else {
        setCursorRowNo(null); // Reset cursor if no data
      }

      // Increment refresh counter
      setRefreshData((prev) => prev + 1);
      setLoader(false);
    } catch (e) {
      console.log(e);
      setToastType("error");
      setLoader(false);
    }
  };

  useEffect(() => {
    if (!location.state && !queryParams.get("state")) return;

    const savedFilters =
      JSON.parse(localStorage.getItem("filters")) ??
      JSON.parse(localStorage.getItem("asset_name"));
    console.log("saved filters effect", savedFilters);
    if (
      savedFilters &&
      (location.state?.from === "exchange" || queryParams.get("state"))
    ) {
      setFilterFormDate((prev) => ({
        ...prev,
        id: savedFilters?.id,
        asset_name: savedFilters?.asset_name,
        available_from: moment(
          rangeDates.startDate,
          "DD/MM/YYYY",
          true
        ).isValid()
          ? rangeDates.startDate
          : "",
        available_to: moment(rangeDates.endDate, "DD/MM/YYYY", true).isValid
          ? rangeDates.endDate
          : "",
        category: savedFilters?.category,
        subCategory: savedFilters?.subCategory,
        city: savedFilters?.city,
        cityName: savedFilters?.cityName,
        location: savedFilters?.location,
      }));
      setInputValue(savedFilters?.asset_name);
    } else {
      localStorage.removeItem("filters");
      localStorage.removeItem("asset_name");
    }

    // Fetch inventory after filters are updated
  }, [location.state]);

  useEffect(() => {
    const fetchDataSequentially = async () => {
      const state = queryParams.get("state"); // Get the value of 'state'
      if (location.state === null && !state) {
        console.log("fetchd data sequentially", location.state, state);
        await fetchInventory();
      } else {
        debouncedFetchInventory(); // Use debounced version
      }
      fetchCityData(); // Fetch next after inventory
    };

    fetchDataSequentially();
  }, [filterFormData]);

  useEffect(() => {
    const filters = [];
    if (filterFormData.id)
      filters.push({ label: ` ${filterFormData.id}`, key: "id" });
    if (filterFormData.asset_name)
      filters.push({
        label: `${filterFormData.asset_name}`,
        key: "asset_name",
      });
    if (filterFormData.city)
      filters.push({ label: `${filterFormData.cityName}`, key: "city" });
    if (filterFormData.location)
      filters.push({ label: `${filterFormData.location}`, key: "location" });
    if (filterFormData.category)
      filters.push({ label: `${filterFormData.category}`, key: "category" });
    if (filterFormData.subCategory)
      filters.push({
        label: `${filterFormData.subCategory}`,
        key: "subCategory",
      });
    if (filterFormData.available_from && filterFormData.available_to) {
      filters.push({
        label: `${filterFormData.available_from} - ${filterFormData.available_to}`,
        key: ["available_from", "available_to"],
      });
    }
    if (filterFormData.status)
      filters.push({ label: `${filterFormData.status.label}`, key: "status" });

    setAppliedFilters(filters);
  }, [filterFormData]);

  // Wrap fetchInventory with debounce
  const debouncedFetchInventory = debounce(fetchInventory, 300);

  const handleEoI = () => {};

  // // Load filters on component mount
  // useEffect(() => {
  //   console.log("location state", location.state);
  //   const savedFilters =
  //     JSON.parse(localStorage.getItem("filters")) ??
  //     JSON.parse(localStorage.getItem("asset_name"));

  //   console.log("saved filters", savedFilters);

  //   // Retain filters only if from the same module
  //   if (savedFilters && location.state?.from === "exchange") {
  //     if (JSON.parse(localStorage.getItem("filters"))) {
  //       setFilterFormDate((prevState) => ({
  //         ...prevState,
  //         id: savedFilters?.id,
  //         asset_name: savedFilters?.asset_name,
  //         available_from: moment(
  //           rangeDates.startDate,
  //           "DD/MM/YYYY",
  //           true
  //         ).isValid()
  //           ? rangeDates.startDate
  //           : "",
  //         available_to: moment(rangeDates.endDate, "DD/MM/YYYY", true).isValid
  //           ? rangeDates.endDate
  //           : "",
  //         category: savedFilters?.category,
  //         subCategory: savedFilters?.subCategory,
  //         city: savedFilters?.city,
  //         cityName: savedFilters?.cityName,
  //         location: savedFilters?.location,
  //       }));
  //       setFilterDataState({
  //         ...filterDataState,
  //         id: savedFilters?.id,
  //         asset_name: savedFilters?.asset_name,
  //         category: savedFilters?.category,
  //         subCategory: savedFilters?.subCategory,
  //         city: savedFilters?.city,
  //         cityName: savedFilters?.cityName,
  //         location: savedFilters?.location,
  //       });

  //       localStorage.removeItem("asset_name");
  //     } else {
  //       setFilterFormDate({ asset_name: savedFilters?.asset_name });
  //       setFilterDataState({
  //         ...filterDataState,
  //         asset_name: savedFilters?.asset_name,
  //       });
  //       setFilterFormDate((prevState) => ({
  //         ...prevState,
  //         asset_name: savedFilters?.asset_name,
  //       }));
  //       setInputValue(savedFilters?.asset_name);
  //     }

  //     // Increment refresh counter
  //     setRefreshData((prev) => prev + 1);
  //   } else {
  //     // Clear saved filters for new module
  //     localStorage.removeItem("filters");
  //   }
  // }, [location.state]);

  // useEffect(() => {
  //   const filters = [];
  //   if (filterFormData.id)
  //     filters.push({ label: ` ${filterFormData.id}`, key: "id" });
  //   if (filterFormData.asset_name)
  //     filters.push({
  //       label: `${filterFormData.asset_name}`,
  //       key: "asset_name",
  //     });
  //   if (filterFormData.city)
  //     filters.push({
  //       label: `${filterFormData.cityName}`,
  //       key: "city",
  //     });
  //   if (filterFormData.location)
  //     filters.push({
  //       label: `${filterFormData.location}`,
  //       key: "location",
  //     });

  //   if (filterFormData.category)
  //     filters.push({
  //       label: `${filterFormData.category}`,
  //       key: "category",
  //     });
  //   if (filterFormData.subCategory)
  //     filters.push({
  //       label: `${filterFormData.subCategory}`,
  //       key: "subCategory",
  //     });

  //   if (
  //     filterFormData.available_from !== "" &&
  //     filterFormData.available_from !== null &&
  //     filterFormData.available_to !== "" &&
  //     filterFormData.available_to !== null &&
  //     filterFormData.available_to !== undefined &&
  //     filterFormData.available_from !== undefined
  //   )
  //     filters.push({
  //       label: `${filterFormData.available_from} - ${filterFormData.available_to}`,
  //       key: ["available_from", "available_to"],
  //     });
  //   if (filterFormData.status)
  //     filters.push({
  //       label: `${filterFormData.status.label}`,
  //       key: "status",
  //     });

  //   setAppliedFilters(filters);

  //   console.log("asfdsadf - execute", filterFormData);
  //   fetchInventory();
  //   fetchCityData();

  //   // Increment refresh counter
  //   setRefreshData((prev) => prev + 1);
  // }, [filterFormData]);

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
      city: "",
      location: "",
      cursor_row_no: 0,
      page_size: 10,
    }));
    setFilterDataState({
      id: "",
      asset_name: "",
      statuscode: "",
      category: "",
      subCategory: "",
      city: "",
      cityName: "",
      location: "",
    });
    localStorage.removeItem("filters");
    localStorage.removeItem("asset_name");
    setClearDateBoolean(true);
    setClearCityBoolean(true);
  };

  const handleAdvancedFilter = () => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: filterDataState.id,
      asset_name: filterDataState.asset_name,
      available_from: moment(rangeDates.startDate, "DD/MM/YYYY", true).isValid()
        ? rangeDates.startDate
        : "",
      available_to: moment(rangeDates.endDate, "DD/MM/YYYY", true).isValid
        ? rangeDates.endDate
        : "",
      category: filterDataState.category,
      subCategory: filterDataState.subCategory,
      city: filterDataState.city,
      cityName: filterDataState.cityName,
      location: filterDataState.location,
    }));
    console.log("filter data", filterFormData);
    localStorage.setItem("filters", JSON.stringify(filterDataState));
  };

  const handleNameSearch = (e) => {
    if (e.key === "Enter") {
      setFilterFormDate({ asset_name: e.target.value });
      console.log("filter form data", filterFormData);
      localStorage.setItem(
        "asset_name",
        JSON.stringify({ asset_name: e.target.value })
      );
      localStorage.removeItem("filters");
    }
  };

  const openModal = (modalId) => {
    setModalIsOpen(true);
    console.log("inputValue", inputValue);
    if (inputValue && inputValue.length > 0) {
      setFilterFormDate({ ...filterFormData, asset_name: "" });
      clearInput();
    }
    setActiveModal(modalId);
  };

  const handleInputChange = (e) => {
    setInputValue(e);
  };

  const clearInput = () => {
    setFilterFormDate({ ...filterFormData, asset_name: "" });
    handleClearClick();
    setInputValue("");
    localStorage.removeItem("asset_name");
  };

  const handleRefreshComponet = () => {
    // Increment refresh counter
    setRefreshData((prev) => prev + 1);
    setCurrentPageNumber(1);
    setFilterFormDate((prev) => ({
      ...prev,
      cursor_row_no: 0,
    }));
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
    console.log(city);
    setFilterDataState({
      ...filterDataState,
      city: city.value,
      cityName: city.label,
    });
    console.log("city data filteration", filterDataState);
    setClearCityBoolean(false);
  };
  const closeModal = () => setActiveModal(null);

  const handleRemoveFilter = (filterKeys) => {
    // If filterKeys is not an array, convert it into an array
    const keys = Array.isArray(filterKeys) ? filterKeys : [filterKeys];

    if (!Array.isArray(filterKeys) && filterKeys === "city") {
      setClearCityBoolean(true);
    }

    if (!Array.isArray(filterKeys) && filterKeys === "asset_name") {
      setInputValue("");
      localStorage.removeItem("asset_name");
    }

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

    // Update localStorage
    const savedFilters = JSON.parse(localStorage.getItem("filters")) || null;
    if (savedFilters) {
      keys.forEach((key) => {
        savedFilters[key] = ""; // Set the specific key to null instead of deleting
      });
      localStorage.setItem("filters", JSON.stringify(savedFilters)); // Save the updated filters back to localStorage
    }
  };

  const setDirection = (direction) => {
    console.log(direction);
    if (direction === "f") {
      setFilterFormDate((prev) => ({
        ...prev,
        cursor_row_no: cursorRowNo,
      }));
    } else {
      setFilterFormDate((prev) => ({
        ...prev,
        cursor_row_no: cursorRowNo - filterFormData.page_size * 2,
      }));
    }
  };

  const setPageSize = (pageSize) => {
    console.log();
    setFilterFormDate((prev) => ({
      ...prev,
      page_size: pageSize,
    }));
  };

  const setPageNumber = (pageNumber) => {
    console.log(pageNumber);
    if (pageNumber !== currentPageNumber) {
      setCurrentPageNumber(pageNumber);
      setFilterFormDate((prev) => ({
        ...prev,
        cursor_row_no:
          filterFormData.page_size * pageNumber - filterFormData.page_size,
      }));
    }
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
                          <span
                            className="input-group-text cursor-pointer"
                            id="basic-addon1"
                            onClick={() =>
                              setFilterFormDate({ asset_name: inputValue })
                            }
                          >
                            <IoSearchSharp size="1.5em" color="white" />
                          </span>
                          <input
                            type="text"
                            id="quickSearch"
                            onKeyPress={handleNameSearch}
                            onChange={(e) => {
                              const data = handleInputFilteration(
                                "alphaNumericDashDot"
                              )(e);
                              handleInputChange(data);
                            }}
                            maxLength={25}
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
                            title="Refresh & Clear Filters"
                          >
                            <RefreshComponetIcon
                              width="30"
                              height="30"
                              color="white"
                              size="2.4em"
                            />
                          </div>
                          <div
                            onClick={() => openModal("filter-modal")}
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
                            title="Request Item"
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
                <div className="applied-filters exchange-tags">
                  {appliedFilters &&
                    appliedFilters.length > 0 &&
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
                  key={refreshData}
                  data={dataState}
                  columns={TableColumn()}
                  isLoading={loader}
                  pageSizeParent={filterFormData.page_size}
                  totalRowCount={totalNumberOfRow}
                  pageNumberParent={currentPageNumber}
                  setPageSizeParent={setPageSize} // Updates parent state with new page size
                  setPageNumberParent={setPageNumber} // Updates parent with current page number
                  setDirection={setDirection} // Pass function to set direction
                  className="-striped -highlight primary-pagination mt-2"
                  manualPagination={true}
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
            <SvgSearchPlus width="25" height="25" className="me-2" />
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
                    maxLength={7}
                    onChange={(e) => {
                      const data = handleInputFilteration("numeric")(e);
                      setFilterDataState((previousState) => ({
                        ...previousState,
                        id: data,
                      }));
                    }}
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
                    maxLength={20}
                    onChange={(e) => {
                      const data =
                        handleInputFilteration("alphaNumericDash")(e);
                      setFilterDataState((previousState) => ({
                        ...previousState,
                        asset_name: data,
                      }));
                    }}
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
                    label="Location-City"
                    options={cities.map((city) => ({
                      value: city.code,
                      label: city.name,
                    }))}
                    onChange={handleCityChange}
                    clearSelection={clearCityBoolean}
                  />
                </FormGroup>
              </Col>

              <Col sm="6">
                <FormGroup floating>
                  <Input
                    id="location"
                    name="name"
                    value={filterDataState.location}
                    maxLength={40}
                    onChange={(e) => {
                      const data = handleInput("alphaNumericDashSlash")(e);
                      setFilterDataState((previousState) => ({
                        ...previousState,
                        location: data,
                      }));
                    }}
                    placeholder="location"
                    type="text"
                  />
                  <Label for="assetName">Location-Area</Label>
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
