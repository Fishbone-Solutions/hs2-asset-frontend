import React, {
  PropTypes,
  useContext,
  useEffect,
  useMemo,
  useRef,
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
import { useSelector, useDispatch } from "react-redux";
import { debounce } from "lodash"; // To optimize API calls
import {
  fetchTableData,
  setFilterFormData,
  setPagination,
  setAppliedFilters,
} from "@/redux/exchange/slice";
import { useLocation } from "react-router-dom";
import { useNavigationType } from "react-router-dom";

const IndexRedux = () => {
  const dispatch = useDispatch();

  // Redux state selectors
  const {
    dataState,
    loader,
    filterFormData,
    totalNumberOfRow,
    currentPageNumber,
    appliedFilters,
  } = useSelector((state) => ({
    dataState: state.exchange.dataState,
    loader: state.exchange.isLoading,
    filterFormData: state.exchange.filterFormData,
    totalNumberOfRow: state.exchange.totalRowCount,
    currentPageNumber: state.exchange.currentPageNumber,
    appliedFilters: state.exchange.appliedFilters,
  }));

  const [refreshData, setRefreshData] = useState(0); // To force re-render if needed

  const [inputValue, setInputValue] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [filterDataState, setFilterDataState] = useState({
    fltr_id: null,
    fltr_name: null,
    fltr_statuscode: null,
    fltr_category1: null,
    fltr_category2: null,
    fltr_city: null,
    cityName: null,
    fltr_location: null,
  });
  const [clearDateBoolean, setClearDateBoolean] = useState(false);
  const [clearCityBoolean, setClearCityBoolean] = useState(false);
  const [rangeDates, setRangeDates] = useState({
    startDate: "",
    endDate: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const navigationType = useNavigationType();
  const queryParams = new URLSearchParams(location.search);
  const [cities, setCities] = useState([]);

  // Debounce API calls to prevent excessive requests
  const debouncedFetchTableData = debounce(() => {
    dispatch(fetchTableData(filterFormData));
  }, 300);

  const fetchCityData = async () => {
    try {
      const res = await EndPointService.getCityData();
      //console.log("city", res);
      setCities(res.appRespData);
    } catch (e) {
      console.log(e);
    }
  };
  // Initial data fetch on component mount
  useEffect(() => {
    debouncedFetchTableData();
  }, [filterFormData]);

  useEffect(() => {
    if (
      location.state?.from !== "exchange" &&
      !queryParams.get("state") &&
      navigationType !== "POP"
    ) {
      handleClearClick();
    }
    fetchCityData();
  }, []);

  // Handlers for table interactions
  const setPageSize = (size) => {
    dispatch(setFilterFormData({ page_size: size }));
  };

  const setPageNumber = (page) => {
    const cursorRowNo = (page - 1) * filterFormData.page_size;
    dispatch(setFilterFormData({ cursor_row_no: cursorRowNo }));
    dispatch(setPagination({ page }));
  };

  const setDirection = (direction) => {
    if (direction === "f") {
      dispatch(
        setFilterFormData({
          ...filterFormData,
          cursor_row_no:
            filterFormData.cursor_row_no + filterFormData.page_size,
        })
      );
    } else {
      dispatch(
        setFilterFormData({
          ...filterFormData,
          cursor_row_no: totalNumberOfRow - filterFormData.page_size * 2,
        })
      );
    }
  };

  // Apply filters and update the state
  const applyFilters = (newFilters) => {
    const filters = [];

    if (newFilters.fltr_id && newFilters.fltr_id !== -1)
      filters.push({ label: ` ${newFilters.fltr_id}`, key: "fltr_id" });
    if (newFilters.fltr_name && newFilters.fltr_name !== -1)
      filters.push({
        label: `${newFilters.fltr_name}`,
        key: "fltr_name",
      });
    if (newFilters.fltr_location_city && newFilters.fltr_location_city !== -1)
      filters.push({
        label: `${newFilters.cityName}`,
        key: "fltr_location_city",
      });
    if (newFilters.fltr_location && newFilters.fltr_location !== -1)
      filters.push({ label: `${newFilters.fltr_location}`, key: "location" });
    if (newFilters.fltr_category1 && newFilters.fltr_category1 !== -1)
      filters.push({
        label: `${newFilters.fltr_category1}`,
        key: "fltr_category1",
      });
    if (newFilters.fltr_category2 && newFilters.fltr_category2 !== -1)
      filters.push({
        label: `${newFilters.fltr_category2}`,
        key: "fltr_category2",
      });
    if (
      newFilters.fltr_from_availability &&
      newFilters.fltr_to_availability &&
      newFilters.fltr_from_availability !== -1 &&
      newFilters.fltr_to_availability !== -1
    ) {
      filters.push({
        label: `${newFilters.fltr_from_availability} - ${newFilters.fltr_from_availability}`,
        key: ["fltr_from_availability", "fltr_to_availability"],
      });
    }
    if (newFilters.status)
      filters.push({ label: `${newFilters.status.label}`, key: "status" });

    // Update Redux state
    dispatch(setAppliedFilters(filters));
  };

  const handleNameSearch = (e) => {
    if (e.key === "Enter") {
      dispatch(
        setFilterFormData({
          fltr_name: e.target.value,
        })
      );
      applyFilters({
        fltr_name: e.target.value,
      });
    }
  };

  const openModal = (modalId) => {
    //setModalIsOpen(true);
    if (inputValue && inputValue.length > 0) {
      dispatch(setFilterFormData({ fltr_asset_name: -1 }));
      clearInput();
    }
    setActiveModal(modalId);
  };

  const handleInputChange = (e) => {
    setInputValue(e);
  };

  const clearInput = () => {
    dispatch(setFilterFormData({ fltr_name: "" }));
    //handleClearClick();
    setInputValue("");
  };

  const handleRefreshComponet = () => {
    // Increment refresh counter
    const page = 1;
    dispatch(setPagination({ page }));
    dispatch(
      setFilterFormData({
        cursor_row_no: 0,
      })
    );
    clearInput();
  };

  const handleCategoryChange = (category) => {
    console.log(category);
    setFilterDataState({ ...filterDataState, fltr_category1: category.value });
    setClearDateBoolean(false);
  };

  const handleSubCategoryChange = (subCategory) => {
    console.log(subCategory);
    setFilterDataState({
      ...filterDataState,
      fltr_category2: subCategory.value,
    });
    setClearDateBoolean(false);
  };

  const handleDate = (startDate, endDate) => {
    setRangeDates((prevState) => ({
      ...prevState,
      startDate: moment(startDate).format("DD/MM/YYYY"),
      endDate: moment(endDate).format("DD/MM/YYYY"),
    }));

    setClearDateBoolean(false);
  };

  const handleCityChange = (city) => {
    console.log(city);
    setFilterDataState({
      ...filterDataState,
      fltr_city: city.value,
      cityName: city.label,
    });
    console.log("city data filteration", filterDataState);
    setClearCityBoolean(false);
  };
  const closeModal = () => setActiveModal(null);

  const handleClearClick = () => {
    dispatch(
      setFilterFormData({
        fltr_id: -1,
        fltr_name: -1,
        fltr_category1: -1,
        fltr_category2: -1,
        fltr_from_availability: -1,
        fltr_to_availability: -1,
        statuscode: -1,
        fltr_city: -1,
        cityName: -1,
        fltr_location: -1,
        fltr_location_city: -1,
        cursor_row_no: 0,
        page_size: 10,
      })
    );
    setFilterDataState({
      fltr_id: "",
      fltr_name: "",
      fltr_statuscode: "",
      fltr_category1: "",
      fltr_category2: "",
      fltr_city: "",
      cityName: "",
      fltr_location: "",
    });
    applyFilters({});
    setClearDateBoolean(true);
    setClearCityBoolean(true);
    setRefreshData(refreshData + 1);
  };

  const getValueOrDefault = (value) => (value ? value : -1);

  const handleAdvancedFilter = () => {
    console.log("filterDataState", filterDataState);
    const searchFilter = {
      fltr_id: getValueOrDefault(filterDataState.fltr_id),
      fltr_name: getValueOrDefault(filterDataState.fltr_name),
      fltr_from_availability: getValueOrDefault(
        moment(rangeDates.startDate, "DD/MM/YYYY", true).isValid()
          ? rangeDates.startDate
          : -1
      ),
      fltr_to_availability: getValueOrDefault(
        moment(rangeDates.endDate, "DD/MM/YYYY", true).isValid
          ? rangeDates.endDate
          : -1
      ),
      fltr_category1: getValueOrDefault(filterDataState.fltr_category1),
      fltr_category2: getValueOrDefault(filterDataState.fltr_category2),
      fltr_location_city: getValueOrDefault(filterDataState.fltr_city),
      cityName: filterDataState.cityName,
      fltr_location: getValueOrDefault(filterDataState.fltr_location),
    };
    dispatch(setFilterFormData(searchFilter));

    applyFilters(searchFilter);
    closeModal();
    const modalElement = document.getElementById("filter-modal");
    modalElement.classList.remove("show");
    modalElement.style.display = "none"; // Hides the modal
    const backdropElement = document.querySelector(".modal-backdrop");
    if (backdropElement) {
      backdropElement.remove();
    }
  };

  const handleRemoveFilter = (filterKeys) => {
    console.log();
    // If filterKeys is not an array, convert it into an array
    const keys = Array.isArray(filterKeys) ? filterKeys : [filterKeys];
    console.log("filterKeys", keys);

    if (!Array.isArray(filterKeys) && filterKeys === "fltr_city") {
      setClearCityBoolean(true);
    }

    if (!Array.isArray(filterKeys) && filterKeys === "fltr_name") {
      setInputValue("");
    }
    const updatedStateApp = { ...filterFormData };
    keys.forEach((key) => {
      updatedStateApp[key] = key === "status" ? null : -1; // Handle special cases like 'status'
    });

    // Update the filter form state
    dispatch(setFilterFormData(updatedStateApp));

    const finalAppliedFilters = appliedFilters.filter((filter) => {
      // Check if filter.key is an array
      if (Array.isArray(filter.key)) {
        // Return true if none of the keys in filter.key are included in keys
        return !filter.key.some((key) => keys.includes(key));
      } else {
        // Return true if filter.key is not included in keys
        return !keys.includes(filter.key);
      }
    });

    // Remove the filter(s) from the applied filters array
    applyFilters(finalAppliedFilters);

    // Update filter data state
    setFilterDataState((prev) => {
      const updatedState = { ...prev };
      keys.forEach((key) => {
        updatedState[key] = ""; // Reset the field in filterDataState
      });

      console.log("okay", updatedState);
      return updatedState;
    });
  };

  return (
    <>
      <div className="content">
        {/* <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        /> */}
        {/* {alert} */}
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
                              setFilterFormData({ fltr_name: inputValue })
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
                            onClick={handleClearClick}
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
                    value={filterDataState.fltr_id}
                    maxLength={7}
                    onChange={(e) => {
                      const data = handleInputFilteration("numeric")(e);
                      setFilterDataState((previousState) => ({
                        ...previousState,
                        fltr_id: data,
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
                    value={filterDataState.fltr_name}
                    maxLength={20}
                    onChange={(e) => {
                      const data =
                        handleInputFilteration("alphaNumericDash")(e);
                      setFilterDataState((previousState) => ({
                        ...previousState,
                        fltr_name: data,
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
                        fltr_location: data,
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
    </>
  );
};

export default IndexRedux;
