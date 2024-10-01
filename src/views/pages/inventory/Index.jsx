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

const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [fullLoader, setFullLoader] = useState(false);

  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [activeModal, setActiveModal] = useState(null);
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
    entry_date_from: null,
    entry_date_to: null,
    available_from: null,
    available_to: null,
    statuscode: null,
  });

  const [filterDataState, setFilterDataState] = useState({
    id: null,
    asset_name: null,
    statuscode: null,
  });
  const [clearDateBoolean, setClearDateBoolean] = useState(false);
  const headers = {
    user_id: sessionStorage.getItem("username") ?? username,
  };

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here

  const user = JSON.parse(sessionStorage.getItem("user"));
  const [graphData, setGraphData] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const getValueOrDefault = (value) => (value ? value : "-1");

  const fetchInventory = async () => {
    try {
      setLoader(true);

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
      const res = await EndPointService.getInventory(headers, params);
      setDataState(res.appRespData);
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
      content: "You will not be able to recover this item",
      type: "warning",
      onConfirm: () => successDelete(id),
      onCancel: hideAlert,
    });
  };

  const successDelete = async (id) => {
    try {
      setLoader(true);
      const res = await EndPointService.deleteInventoryById(id);
      if(res.appRespData[0].asset_delete === -2) {
        showAlert({
          title: "Can not delete this Asset",
          content: `This Asset is being broadcasted Live`,
          type: "error",
          showCancelButton: false,
          confirmText: "ok",
          onConfirm: hideAlert,
        });
      } else {
      showAlert({
        title: "Deleted!",
        content: `Asset ID ${id} has been deleted successfully`,
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
      entry_date_from: null,
      entry_date_to: null,
      available_from: null,
      available_to: null,
      statuscode: null,
    }));
    setFilterDataState({
      id: "",
      asset_name: "",
      statuscode: "",
    });
    setClearDateBoolean(true);
  };

  useEffect(() => {
    fetchInventory();
    const filters = [];
    if (filterFormData.id)
      filters.push({ label: ` ${filterFormData.id}`, key: "id" });
    if (filterFormData.asset_name)
      filters.push({
        label: `${filterFormData.asset_name}`,
        key: "asset_name",
      });
    if ((filterFormData.entry_date_from !== '' && filterFormData.entry_date_from !== null) && (filterFormData.entry_date_from !== '' && filterFormData.entry_date_from !== null))
      filters.push({
        label: `Entry: ${filterFormData.entry_date_from}- ${filterFormData.entry_date_to}`,
        key: ["entry_date_from", "entry_date_to"],
      });
      if ((filterFormData.available_from !== '' && filterFormData.available_from !== null ) && (filterFormData.available_to !== '' && filterFormData.available_to !== null) && (filterFormData.available_to !== undefined && filterFormData.available_from !== undefined))
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
  }, [filterFormData, refreshData]);

  const handleFilter = () => {
    console.log("handleFilter", filterDataState.id);
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: filterDataState.id,
      asset_name: filterDataState.asset_name,
      available_from: moment(rangeDatesAvailablility.startDate, "DD/MM/YYYY", true).isValid() ? rangeDatesAvailablility.startDate : '',
      available_to: moment(rangeDatesAvailablility.endDate, "DD/MM/YYYY", true).isValid() ? rangeDatesAvailablility.endDate : '',
      entry_date_from: moment(rangeDatesEntry.startDate, "DD/MM/YYYY", true).isValid() ? rangeDatesEntry.startDate  : '',
      entry_date_to:  moment(rangeDatesEntry.endDate, "DD/MM/YYYY", true).isValid() ? rangeDatesEntry.endDate  : '',
      statuscode: filterDataState.statuscode,
    }));
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
        {fullLoader ? <FullPageLoader /> : ""}
        {alert}
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <div className="float-end d-inline-flex p-2 justify-content-end">
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
                      title="Create Inventory"
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
                  columns={TableColumn(handleDelete)}
                  isLoading={loader}
                  className="-striped -highlight primary-pagination mt-2"
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
                  onChange={(e) =>
                    setFilterDataState((previousState) => ({
                      ...previousState,
                      id: e.target.value,
                    }))
                  }
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
                  onChange={(e) =>
                    setFilterDataState((previousState) => ({
                      ...previousState,
                      asset_name: e.target.value,
                    }))
                  }
                  type="text"
                  name="asset_name"
                  placeholder="name"
                />
                <Label for="name">Name</Label>
              </FormGroup>
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
                clearSelection={clearDateBoolean}
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
