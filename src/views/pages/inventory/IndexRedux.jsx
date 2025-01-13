import React, { useContext, useEffect, useRef, useState } from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "@/services/methods";
import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  CardHeader,
  Label,
  FormGroup,
} from "reactstrap";
import { IoSearchSharp, IoAddCircleOutline } from "react-icons/io5";
import ReactTable from "components/ReactTable/ReactTable";
import { Form, NavLink } from "react-router-dom";
import DateRangePicker from "components/Common/DateRangePicker";
import { GlobalContext } from "@/GlobalState";
import TableColumn from "variables/tables/inventory/Index";
import FloatingLabelDropdown from "components/Common/FloatingLabelDropdown";
import { useAlert } from "components/Common/NotificationAlert"; // import the custom hook
import { inventoryStatusOptions } from "variables/common";
import { ImStatsBars } from "react-icons/im";
import PieChart from "components/Common/PieChart";
import { FullPageLoader } from "components/Common/ComponentLoader";
import moment from "moment";
import { Modal } from "bootstrap";
import ModalComponent from "components/Common/ModalComponent";
import RefreshComponetIcon from "components/svg/RefreshComponet";
import BeatingIcon from "components/svg/BeatingIcon";
import AttentionIcon from "components/svg/AttentionIcon";
import { handleInputFilteration } from "variables/common";
import { subCategory } from "variables/common";
import { categorycode1 } from "variables/common";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchInventory,
  getPieChartState,
  setFilterFormData,
  setAppliedFilters,
  setCurrentPageNumber,
} from "@/redux/inventory/slice";
import { useNavigationType } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash";

const IndexRedux = () => {
  const dispatch = useDispatch();

  // Redux state selectors
  const {
    dataState,
    loader,
    fullLoader,
    filterFormData,
    totalNumberOfRow,
    currentPageNumber,
    appliedFilters,
    graphData,
  } = useSelector((state) => ({
    dataState: state.inventory.dataState,
    loader: state.inventory.isLoading,
    fullLoader: state.inventory.fullLoader,
    filterFormData: state.inventory.filterFormData,
    totalNumberOfRow: state.inventory.totalNumberOfRow,
    currentPageNumber: state.inventory.currentPageNumber,
    appliedFilters: state.inventory.appliedFilters,
    graphData: state.inventory.graphData,
  }));

  // Initial data fetch on component mount
  // Debounce API calls to prevent excessive requests
  const debouncedFetchTableData = debounce(() => {
    dispatch(fetchInventory(filterFormData));
  }, 300);

  // Initial data fetch on component mount
  useEffect(() => {
    debouncedFetchTableData();
  }, [filterFormData]);

  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [activeModal, setActiveModal] = useState(null);
  const [cursorRowNo, setCursorRowNo] = useState(0);
  const [clearCategoryBoolean, setClearCategoryBoolean] = useState(false);
  const [clearSubCategoryBoolean, setClearSubCategoryBoolean] = useState(false);
  const openModal = (modalId) => setActiveModal(modalId);
  const closeModal = () => {
    console.log("click");
    setActiveModal(null);
  };

  const { username } = useContext(GlobalContext);
  const [refreshData, setRefreshData] = useState(0);
  const [rangeDatesEntry, setRangeDatesEntry] = useState({
    startDate: "",
    endDate: "",
  });
  const [rangeDatesAvailablility, setRangeDatesAvailablility] = useState({
    startDate: "",
    endDate: "",
  });

  const [filterDataState, setFilterDataState] = useState({
    id: null,
    asset_name: null,
    statuscode: null,
    category: null,
    subCategory: null,
  });
  const [clearDateBoolean, setClearDateBoolean] = useState(false);
  const headers = {
    user_id: sessionStorage.getItem("username") ?? username,
  };

  const [clearStatusBoolean, setClearStatusBoolean] = useState(false);

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const location = useLocation();
  const navigationType = useNavigationType();
  const queryParams = new URLSearchParams(location.search);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const getValueOrDefault = (value) => (value ? value : -1);

  const handleDelete = (id) => {
    showAlert({
      title: (
        <div className="alert-content-padding">
          <p className="text-danger font-weight-bold sweet-title-size ">
            You will not be able to recover this item
          </p>
        </div>
      ),
      content: <h4 className="sweet-alert-sure">Are you sure?</h4>,
      type: "warning",
      onConfirm: () => successDelete(id),
      onCancel: hideAlert,
    });
  };

  const successDelete = async (id) => {
    try {
      setLoader(true);
      const res = await EndPointService.deleteInventoryById(id);
      if (res.appRespData[0].asset_delete === -2) {
        showAlert({
          title: (
            <div className="alert-content-padding">
              <p className="sweet-title-size sweet-title-padding text-danger">
                Can not delete this Item
              </p>
            </div>
          ),
          content: (
            <div className="alert-content-padding">
              <p class="sweet-title-size sweet-title-padding font-weight-bold">
                This Asset is being broadcasted Live
              </p>
            </div>
          ),
          type: "error",
          showCancelButton: false,
          confirmText: "ok",
          onConfirm: hideAlert,
        });
      } else {
        showAlert({
          title: "Deleted!",
          content: (
            <div className="alert-content-padding">
              <p class="sweet-title-size sweet-title-padding font-weight-bold">
                Item ID: {id} deleted successfully
              </p>
            </div>
          ),
          type: "success",
          showCancelButton: false,
          confirmText: "ok",
          onConfirm: hideAlert,
        });
        setRefreshData(refreshData + 1);
      }
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleClear = () => {
    const updateFilter = {
      fltr_id: -1,
      fltr_name: -1,
      fltr_category: -1,
      fltr_sub_Category: -1,
      fltr_from_entry_date: -1,
      fltr_to_entry_date: -1,
      fltr_from_availability: -1,
      fltr_to_availability: -1,
      fltr_status: -1,
      cursor_row_no: 0,
      page_size: 10,
      fltr_only_active_eois: -1,
      fltr_only_unattended_eois: -1,
    };
    dispatch(setFilterFormData(updateFilter));
    setFilterDataState({
      id: "",
      asset_name: "",
      statuscode: "",
      category: null,
      subCategory: null,
    });
    appliedFilter({});
    setClearDateBoolean(true);
    setClearCategoryBoolean(true);
    setClearSubCategoryBoolean(true);
    setClearStatusBoolean(true);
    setRefreshData(refreshData + 1);
    dispatch(setCurrentPageNumber(1));
  };

  const appliedFilter = (filterAttribute) => {
    console.log("inventroy", filterAttribute);
    const filters = [];
    if (filterAttribute.fltr_id && filterAttribute.fltr_id !== -1)
      filters.push({ label: ` ${filterAttribute.fltr_id}`, key: "fltr_id" });
    if (
      filterAttribute.fltr_only_active_eois &&
      filterAttribute.fltr_only_active_eois !== -1
    )
      filters.push({ label: "Active items", key: "fltr_only_active_eois" });
    if (filterAttribute.fltr_category && filterAttribute.fltr_category !== -1)
      filters.push({
        label: `${filterAttribute.fltr_category}`,
        key: "fltr_category",
      });
    if (filterAttribute.fltr_sub_category)
      filters.push({
        label: `${filterAttribute.fltr_sub_category}`,
        key: "fltr_sub_category",
      });
    if (
      filterAttribute.fltr_only_unattended_eois &&
      filterAttribute.fltr_only_unattended_eois !== -1
    )
      filters.push({
        label: "Items Requiring Attention",
        key: "fltr_only_unattended_eois",
      });
    if (filterAttribute.fltr_name && filterAttribute.fltr_name !== -1)
      filters.push({
        label: `${filterAttribute.fltr_name}`,
        key: "fltr_name",
      });
    if (
      filterAttribute.fltr_from_entry_date &&
      filterAttribute.fltr_from_entry_date !== -1 &&
      filterAttribute.fltr_to_entry_date &&
      filterAttribute.fltr_to_entry_date !== -1
    )
      filters.push({
        label: `Entry: ${filterAttribute.fltr_from_entry_date} - ${filterAttribute.fltr_to_entry_date}`,
        key: ["fltr_from_entry_date", "fltr_to_entry_date"],
      });
    if (
      filterAttribute.fltr_from_availability &&
      filterAttribute.fltr_from_availability !== -1 &&
      filterAttribute.fltr_to_availability &&
      filterAttribute.fltr_to_availability !== -1
    )
      filters.push({
        label: `Availablility: ${filterAttribute.fltr_from_availability} - ${filterAttribute.fltr_to_availability}`,
        key: ["fltr_from_availability", "fltr_to_availability"],
      });
    if (filterAttribute.fltr_status && filterAttribute.fltr_status !== -1)
      filters.push({
        label: `${filterAttribute.fltr_status}`,
        key: "fltr_status",
      });

    dispatch(setAppliedFilters(filters));
  };

  const handleFilter = () => {
    console.log("handleFilter", filterDataState);
    const updateFilter = {
      fltr_id: getValueOrDefault(filterDataState.id),
      fltr_name: getValueOrDefault(filterDataState.asset_name),
      fltr_from_availability: getValueOrDefault(
        moment(rangeDatesAvailablility.startDate, "DD/MM/YYYY", true).isValid()
          ? rangeDatesAvailablility.startDate
          : ""
      ),
      fltr_to_availability: getValueOrDefault(
        moment(rangeDatesAvailablility.endDate, "DD/MM/YYYY", true).isValid()
          ? rangeDatesAvailablility.endDate
          : ""
      ),
      fltr_from_entry_date: getValueOrDefault(
        moment(rangeDatesEntry.startDate, "DD/MM/YYYY", true).isValid()
          ? rangeDatesEntry.startDate
          : ""
      ),
      fltr_to_entry_date: getValueOrDefault(
        moment(rangeDatesEntry.endDate, "DD/MM/YYYY", true).isValid()
          ? rangeDatesEntry.endDate
          : ""
      ),
      fltr_status: getValueOrDefault(filterDataState.statuscode),
      category: getValueOrDefault(filterDataState.category),
      subCategory: getValueOrDefault(filterDataState.subCategory),
      cursor_row_no: 0,
    };
    dispatch(setFilterFormData(updateFilter));
    appliedFilter(updateFilter);
    dispatch(setCurrentPageNumber(1));
  };

  const showPieChartInventory = async () => {
    try {
      const params = new URLSearchParams({
        organisation_id: user.organization_id,
      });
      dispatch(getPieChartState(params));

      // Ensure graphData is set before rendering PieChart
      if (graphData && graphData?.length > 0) {
        showAlert({
          customHeader: (
            <header class="py-2 mb-4 border-bottom sweet-alert-header">
              <div class="container d-flex flex-wrap justify-content-left">
                <span class="fs-6 text-white">Inventory Stats</span>
              </div>
            </header>
          ),
          onCancel: hideAlert,
          confirmText: "Close",
          showCloseButton: true,
          onConfirm: () => {
            hideAlert();
          },
          showCancelButton: false,
          content: <PieChart data={graphData} />, // Pass the response data directly
        });
      } else {
        // Handle the case where the response data is null or empty
        console.error("No data available for the pie chart");
      }
    } catch (e) {
      console.log(e);
      setToastType("error");
      setToastMessage(e.appRespMessage || "Error fetching data");
    }
  };

  const handleEntryDate = (startDate, endDate) => {
    setRangeDatesEntry((prevState) => ({
      ...prevState,
      startDate: moment(startDate).format("DD/MM/YYYY"),
      endDate: moment(endDate).format("DD/MM/YYYY"),
    }));

    setClearDateBoolean(false);
  };

  const handleAvailablilityDate = (startDate, endDate) => {
    setRangeDatesAvailablility((prevState) => ({
      ...prevState,
      startDate: moment(startDate).format("DD/MM/YYYY"),
      endDate: moment(endDate).format("DD/MM/YYYY"),
    }));
    setClearDateBoolean(false);
  };

  const handleSelectChange = (selectedOption) => {
    setFilterDataState((prevState) => ({
      ...prevState,
      statuscode: selectedOption.value,
    }));
    setClearDateBoolean(false);
  };

  const handleRemoveFilter = (filterKeys) => {
    // If filterKeys is not an array, convert it into an array
    const keys = Array.isArray(filterKeys) ? filterKeys : [filterKeys];

    if (!Array.isArray(filterKeys) && filterKeys === "statuscode") {
      setClearStatusBoolean(true);
    }

    if (!Array.isArray(filterKeys) && filterKeys === "fltr_category") {
      setClearCategoryBoolean(true);
    }

    if (!Array.isArray(filterKeys) && filterKeys === "fltr_sub_category") {
      setClearSubCategoryBoolean(true);
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

    console.log("applided filter", finalAppliedFilters);

    // Remove the filter(s) from the applied filters array
    dispatch(setAppliedFilters(finalAppliedFilters));

    // Update filter data state
    setFilterDataState((prev) => {
      const updatedState = { ...prev };
      keys.forEach((key) => {
        updatedState[key] = ""; // Reset the field in filterDataState
      });
      return updatedState;
    });
  };

  const handleRefreshComponet = () => {
    handleClear();
  };

  const activeItems = () => {
    const activeIos = { ...filterFormData, fltr_only_active_eois: 1 };
    dispatch(setFilterFormData(activeIos));
    appliedFilter(activeIos);
  };

  const setPageSize = (size) => {
    dispatch(setFilterFormData({ page_size: size }));

    //debouncedFetchTableData();
  };

  const setPageNumber = (page) => {
    const cursorRowNo = (page - 1) * filterFormData.page_size;
    dispatch(setFilterFormData({ cursor_row_no: cursorRowNo }));
    dispatch(setCurrentPageNumber(page));
    //dispatch(setPagination({ page }));
    //debouncedFetchTableData();
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
          cursor_row_no:
            filterFormData.cursor_row_no - filterFormData.page_size,
        })
      );
    }
  };

  const itemsRequiringAttention = () => {
    const itemRequiring = {
      ...filterFormData,
      fltr_only_unattended_eois: 1,
    };
    dispatch(setFilterFormData(itemRequiring));
    appliedFilter(itemRequiring);
  };

  const handleCategoryChange = (category) => {
    console.log(category);
    setFilterDataState({ ...filterDataState, category: category.value });
    setClearCategoryBoolean(false);
  };

  const handleSubCategoryChange = (subCategory) => {
    console.log(subCategory);
    setFilterDataState({ ...filterDataState, subCategory: subCategory.value });
    setClearSubCategoryBoolean(false);
  };

  useEffect(() => {
    if (
      location.state?.from !== "inventory" &&
      !queryParams.get("state") &&
      navigationType !== "POP"
    ) {
      console.log("working handle clear");
      handleClear();
    }
    const params = new URLSearchParams({
      organisation_id: user.organization_id,
    });
    dispatch(getPieChartState(params));
  }, []);

  return (
    <>
      <div className="content">
        <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        />
        {fullLoader ? <FullPageLoader /> : ""}
        {alert}
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <div className="float-end d-inline-flex p-2 justify-content-end">
                  <div
                    onClick={handleRefreshComponet}
                    className="mr-2 cursor-pointer"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Refresh & Clear Filters"
                  >
                    <RefreshComponetIcon
                      width="34"
                      height="34"
                      color="white"
                      size="2.4em"
                      className="icon-btn"
                    />
                  </div>
                  <div
                    onClick={activeItems}
                    className="me-2"
                    style={{ cursor: "pointer" }}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Active Items"
                  >
                    <BeatingIcon
                      width="34"
                      height="34"
                      color="white"
                      size="2.4em"
                      className="icon-btn"
                    />
                  </div>

                  <div
                    onClick={itemsRequiringAttention}
                    className="me-2"
                    style={{ cursor: "pointer" }}
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Items requiring attention"
                  >
                    <AttentionIcon
                      width="34"
                      height="34"
                      color="white"
                      size="2.4em"
                      className="icon-btn"
                    />
                  </div>
                  <div
                    onClick={showPieChartInventory}
                    className="mr-2 cursor-pointer"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Inventory Stats"
                  >
                    <ImStatsBars
                      color="white"
                      size="2.4em"
                      className="icon-btn"
                    />
                  </div>
                  <div
                    onClick={() => openModal("filter-modal")}
                    className="mr-2 cursor-pointer"
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Inventory Search"
                  >
                    <IoSearchSharp
                      color="white"
                      size="2.4em"
                      className="icon-btn"
                    />
                  </div>
                  <NavLink to="/admin/inventory/create">
                    <div
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Add New Item"
                    >
                      <IoAddCircleOutline
                        color="white"
                        size="2.4em"
                        className="icon-btn"
                      />
                    </div>
                  </NavLink>
                </div>
                <div className="applied-filters">
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
                  columns={TableColumn(handleDelete)}
                  isLoading={loader}
                  pageSizeParent={filterFormData?.page_size}
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
            <IoSearchSharp
              width="30"
              height="30"
              size="1.4rem"
              className="me-2"
            />
            Filter
          </h6>
        }
        content={
          <Row>
            <Col sm="6">
              <FormGroup floating>
                <Input
                  type="text"
                  value={filterDataState.id}
                  onChange={(e) => {
                    const data = handleInputFilteration("numeric")(e);
                    setFilterDataState((previousState) => ({
                      ...previousState,
                      id: data,
                    }));
                  }}
                  name="id"
                  id="id"
                  placeholder="id"
                />
                <Label for="id">ID</Label>
              </FormGroup>
            </Col>
            <Col sm="6">
              <FormGroup floating>
                <Input
                  id="name"
                  value={filterDataState.asset_name}
                  onChange={(e) => {
                    const data = handleInputFilteration("alphaNumericDash")(e);
                    setFilterDataState((previousState) => ({
                      ...previousState,
                      asset_name: data,
                    }));
                  }}
                  type="text"
                  name="asset_name"
                  placeholder="name"
                />
                <Label for="name">Name</Label>
              </FormGroup>
            </Col>

            <Col sm="6">
              <FloatingLabelDropdown
                label="Category"
                options={categorycode1}
                onChange={handleCategoryChange}
                clearSelection={clearCategoryBoolean}
              />
            </Col>
            <Col sm="6">
              <FloatingLabelDropdown
                label="Sub-Category"
                options={subCategory}
                onChange={handleSubCategoryChange}
                clearSelection={clearSubCategoryBoolean}
              />
            </Col>

            <Col sm="6">
              <div className="placer2">
                <FormGroup>
                  <DateRangePicker
                    label="Entry Range"
                    clearDates={clearDateBoolean}
                    onChange={handleEntryDate}
                  />
                </FormGroup>
              </div>
            </Col>

            <Col sm="6">
              <FormGroup>
                <DateRangePicker
                  label="Availability Range"
                  clearDates={clearDateBoolean}
                  selectedRange={[
                    filterFormData.available_from, // Start date
                    filterFormData.available_to, // End date
                  ]}
                  onChange={handleAvailablilityDate}
                />
              </FormGroup>
            </Col>

            <Col sm="6">
              <FloatingLabelDropdown
                label="Status"
                options={inventoryStatusOptions}
                onChange={handleSelectChange}
                clearSelection={clearStatusBoolean}
              />
            </Col>
          </Row>
        }
        showModal={activeModal === "filter-modal"}
        onCloseCross={closeModal}
        onClose={handleClear}
        onSubmit={handleFilter}
        closeButtonText="Clear"
        submitButtonText="Filter"
        closeButtonColor="red" // Dynamic color for close button
        submitButtonColor="green" // Dynamic color for submit button
      />
    </>
  );
};

export default IndexRedux;
