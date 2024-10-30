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

const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fullLoader, setFullLoader] = useState(false);

  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [activeModal, setActiveModal] = useState(null);
  const [cursorRowNo, setCursorRowNo] = useState(0);
  const [currentPageNumber, setCurrentPageNumber] = useState(1);
  const [totalNumberOfRow, setTotalNumberOfRow] = useState(10);
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
  const [filterFormData, setFilterFormDate] = useState({
    id: "",
    asset_name: "",
    category: null,
    subCategory: null,
    entry_date_from: null,
    entry_date_to: null,
    available_from: null,
    available_to: null,
    statuscode: null,
    cursor_row_no: 0,
    page_size: 10,
    fltr_only_active_eois: null,
    fltr_only_unattended_eois: null,
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

  const user = JSON.parse(sessionStorage.getItem("user"));
  const [graphData, setGraphData] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [directionPagination, setDirectionPagination] = useState("");
  const getValueOrDefault = (value) => (value ? value : "-1");

  const fetchInventory = async () => {
    try {
      setLoader(true);

      const params = new URLSearchParams({
        fltr_id: getValueOrDefault(filterFormData.id),
        fltr_name: getValueOrDefault(filterFormData.asset_name),
        fltr_status: getValueOrDefault(filterFormData.statuscode),
        fltr_category: getValueOrDefault(filterFormData.category),
        fltr_sub_category: getValueOrDefault(filterFormData.subCategory),
        fltr_from_entry_date: getValueOrDefault(filterFormData.entry_date_from),
        fltr_to_entry_date: getValueOrDefault(filterFormData.entry_date_to),
        fltr_from_availability: getValueOrDefault(
          filterFormData.available_from
        ),
        fltr_to_availability: getValueOrDefault(filterFormData.available_to),
        fltr_only_active_eois: getValueOrDefault(
          filterFormData.fltr_only_active_eois
        ),
        fltr_only_unattended_eois: getValueOrDefault(
          filterFormData.fltr_only_unattended_eois
        ),
        cursor_row_no: filterFormData.cursor_row_no,
        page_size: filterFormData.page_size,
      });
      const res = await EndPointService.getInventory(headers, params);

      setDataState(res.appRespData);
      if (res.appRespData.length > 0) {
        console.log(
          res.appRespData,
          res.appRespData.length,
          res.appRespData[res.appRespData.length - 1].row_no
        );
        setCursorRowNo(res.appRespData[res.appRespData.length - 1].row_no);
        setTotalNumberOfRow(
          res.appRespData[res.appRespData.length - 1].row_count
        );
      }
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  const handleDelete = (id) => {
    showAlert({
      title: "Are you sure?",
      content: (
        <p className="text-danger font-weight-bold">
          You will not be able to recover this item
        </p>
      ),
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
            <p className="sweet-title-size sweet-title-padding text-start">
              Can not delete this Asset
            </p>
          ),
          content: `This Asset is being broadcasted Live`,
          type: "error",
          showCancelButton: false,
          confirmText: "ok",
          onConfirm: hideAlert,
        });
      } else {
        showAlert({
          title: "Deleted!",
          content: `Item ID: ${id}  deleted successfully`,
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
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: "",
      asset_name: "",
      category: null,
      subCategory: null,
      entry_date_from: null,
      entry_date_to: null,
      available_from: null,
      available_to: null,
      statuscode: null,
      fltr_only_active_eois: null,
      fltr_only_unattended_eois: null,
    }));
    setFilterDataState({
      id: "",
      asset_name: "",
      statuscode: "",
      category: null,
      subCategory: null,
    });
    setClearDateBoolean(true);
    setClearCategoryBoolean(true);
    setClearSubCategoryBoolean(true);
  };

  useEffect(() => {
    fetchInventory();
    const filters = [];
    if (filterFormData.id)
      filters.push({ label: ` ${filterFormData.id}`, key: "id" });
    if (filterFormData.fltr_only_active_eois)
      filters.push({ label: "Active items", key: "fltr_only_active_eois" });
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
    if (filterFormData.fltr_only_unattended_eois)
      filters.push({
        label: "Items Requiring Attention",
        key: "fltr_only_unattended_eois",
      });
    if (filterFormData.asset_name)
      filters.push({
        label: `${filterFormData.asset_name}`,
        key: "asset_name",
      });
    if (
      filterFormData.entry_date_from !== "" &&
      filterFormData.entry_date_from !== null &&
      filterFormData.entry_date_from !== "" &&
      filterFormData.entry_date_from !== null
    )
      filters.push({
        label: `Entry: ${filterFormData.entry_date_from} - ${filterFormData.entry_date_to}`,
        key: ["entry_date_from", "entry_date_to"],
      });
    if (
      filterFormData.available_from !== "" &&
      filterFormData.available_from !== null &&
      filterFormData.available_to !== "" &&
      filterFormData.available_to !== null &&
      filterFormData.available_to !== undefined &&
      filterFormData.available_from !== undefined
    )
      filters.push({
        label: `Availablility: ${filterFormData.available_from} - ${filterFormData.available_to}`,
        key: ["available_from", "available_to"],
      });
    if (filterFormData.statuscode)
      filters.push({
        label: `${filterFormData.statuscode}`,
        key: "statuscode",
      });

    setAppliedFilters(filters);
    console.log("applied filter", appliedFilters, filterFormData);
  }, [filterFormData, refreshData]);

  const handleFilter = () => {
    console.log("handleFilter", filterDataState.id);
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: filterDataState.id,
      asset_name: filterDataState.asset_name,
      available_from: moment(
        rangeDatesAvailablility.startDate,
        "DD/MM/YYYY",
        true
      ).isValid()
        ? rangeDatesAvailablility.startDate
        : "",
      available_to: moment(
        rangeDatesAvailablility.endDate,
        "DD/MM/YYYY",
        true
      ).isValid()
        ? rangeDatesAvailablility.endDate
        : "",
      entry_date_from: moment(
        rangeDatesEntry.startDate,
        "DD/MM/YYYY",
        true
      ).isValid()
        ? rangeDatesEntry.startDate
        : "",
      entry_date_to: moment(
        rangeDatesEntry.endDate,
        "DD/MM/YYYY",
        true
      ).isValid()
        ? rangeDatesEntry.endDate
        : "",
      statuscode: filterDataState.statuscode,
      category: filterDataState.category,
      subCategory: filterDataState.subCategory,
      cursor_row_no: 0,
    }));
    setCurrentPageNumber(1);
  };

  const showPieChartInventory = async () => {
    setFullLoader(true);
    try {
      const params = new URLSearchParams({
        organisation_id: user.organization_id,
      });
      const res = await EndPointService.inventoryStatsAgainOrgainsation(
        headers,
        params
      );

      setGraphData(res.appRespData); // Set the data from the response

      // Ensure graphData is set before rendering PieChart
      if (res.appRespData && res.appRespData.length > 0) {
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
          content: <PieChart data={res.appRespData} />, // Pass the response data directly
        });
      } else {
        // Handle the case where the response data is null or empty
        console.error("No data available for the pie chart");
      }
    } catch (e) {
      console.log(e);
      setToastType("error");
      setToastMessage(e.appRespMessage || "Error fetching data");
      setLoader(false);
    } finally {
      setFullLoader(false);
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

    if (!Array.isArray(filterKeys) && filterKeys === "category") {
      setClearCategoryBoolean(true);
    }

    if (!Array.isArray(filterKeys) && filterKeys === "subCategory") {
      setClearSubCategoryBoolean(true);
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
    setFilterFormDate((prev) => ({
      ...prev,
      page_size: pageSize,
    }));
  };

  const setPageNumber = (pageNumber) => {
    console.log(
      "change page",
      currentPageNumber,
      pageNumber,
      directionPagination
    );
    if (pageNumber !== currentPageNumber) {
      setCurrentPageNumber(pageNumber);
      setFilterFormDate((prev) => ({
        ...prev,
        cursor_row_no:
          filterFormData.page_size * pageNumber - filterFormData.page_size,
      }));
    } else {
      setDirectionPagination(null);
    }
  };

  const handleRefreshComponet = () => {
    setRefreshData(refreshData + 1);
    setCurrentPageNumber(1);
    setFilterFormDate((prev) => ({
      ...prev,
      cursor_row_no: 0,
      page_size: 10,
    }));
    handleClear();
  };

  const activeItems = () => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      fltr_only_active_eois: 1,
    }));
  };

  const itemsRequiringAttention = () => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      fltr_only_unattended_eois: 1,
    }));
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

export default Index;
