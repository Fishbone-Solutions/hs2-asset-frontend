import React, { useContext, useEffect, useState } from "react";
import DynamicToast from "components/Common/Toast";
import { EndPointService } from "../../../services/methods";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  Row,
  Col,
  Input,
  CardHeader,
  Label,
  FormGroup,
  Modal,
  Container,
} from "reactstrap";
import { IoSearchSharp } from "react-icons/io5";
import ReactTable from "../../../components/ReactTable/ReactTable";
import { Form } from "react-router-dom";
import DateRangePicker from "components/Common/DateRangePicker";
import { GlobalContext } from "@/GlobalState";
import TableColumn from "variables/tables/myeoi/Index";
import ModalComponent from "components/Common/ModalComponent";
import { useAlert } from "components/Common/NotificationAlert";
import { handleInput } from "variables/common";
import { handleInputFilteration } from "variables/common";

const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const openModal = (modalId) => setActiveModal(modalId);
  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here
  const [refreshData, setRefreshData] = useState(0);
  const headers = { user_id: sessionStorage.getItem("username") };
  const closeModal = () => {
    console.log("click");
    setActiveModal(null);
  };
  const [searchFilter, setSearchFilter] = useState(0);

  const [clearDateBoolean, setClearDateBoolean] = useState(false);

  const { username } = useContext(GlobalContext);
  const [isHovered, setIsHovered] = useState(false);

  const [rangeDatesEntry, setRangeDatesEntry] = useState({
    startDate: null,
    endDate: null,
  });

  const [filterFormData, setFilterFormData] = useState({
    id: "",
    asset_id: "",
    asset_name: "",
    entry_date_from: null,
    entry_date_to: null,
  });

  const getValueOrDefault = (value) => (value ? value : "-1");

  const fetchMyEoI = async () => {
    try {
      setLoader(true);

      const params = new URLSearchParams({
        fltr_eoi_id: getValueOrDefault(filterFormData.id),
        fltr_item_id: getValueOrDefault(filterFormData.asset_id),
        fltr_item_name: getValueOrDefault(filterFormData.asset_name),
        fItr_from_subDate: getValueOrDefault(filterFormData.entry_date_from),
        fItr_to_subDate: getValueOrDefault(filterFormData.entry_date_to),
      });

      const res = await EndPointService.getMyEoI(
        headers,
        sessionStorage.getItem("username"),
        params
      );
      setDataState(res.appRespData);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage || "Error fetching data");
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchMyEoI();
    const filters = [];
    if (filterFormData.id)
      filters.push({ label: `EOI Id: ${filterFormData.id}`, key: "id" });
    if (filterFormData.asset_id)
      filters.push({
        label: `Item Id: ${filterFormData.asset_id}`,
        key: "asset_id",
      });
    if (filterFormData.asset_name)
      filters.push({
        label: `${filterFormData.asset_name}`,
        key: "asset_name",
      });
    if (
      filterFormData.entry_date_from !== "" &&
      filterFormData.entry_date_from !== null &&
      filterFormData.entry_date_to !== "" &&
      filterFormData.entry_date_to !== null
    )
      filters.push({
        label: `${filterFormData.entry_date_from}- ${filterFormData.entry_date_to}`,
        key: ["entry_date_from", "entry_date_to"],
      });

    setAppliedFilters(filters);
    console.log("applied filter", appliedFilters, filterFormData);
  }, [searchFilter, refreshData]);

  const handleFilter = () => {
    const updateSearchFilter = searchFilter + 1;
    setFilterFormData((prevState) => ({
      ...prevState,
      entry_date_from: rangeDatesEntry.startDate,
      entry_date_to: rangeDatesEntry.endDate,
    }));
    setSearchFilter(updateSearchFilter);
  };

  const handleClear = () => {
    setFilterFormData({
      id: "",
      asset_id: "",
      asset_name: "",
      entry_date_from: null,
      entry_date_to: null,
    });
    setSearchFilter(searchFilter + 1);
    setClearDateBoolean(true);
  };

  const handleEntryDate = (startDate, endDate) => {
    setRangeDatesEntry((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
    }));
    setClearDateBoolean(false);
  };

  const handleRemoveFilter = (filterKeys) => {
    // If filterKeys is not an array, convert it into an array
    const keys = Array.isArray(filterKeys) ? filterKeys : [filterKeys];
    console.log(keys);
    // Update the filter form state
    setFilterFormData((prev) => {
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
    setClearDateBoolean(true);
    handleFilter();
  };

  const handleDelete = (assetId, eoino) => {
    console.log("handleDelete", assetId, eoino);
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
      onConfirm: () => successDelete(assetId, eoino),
      onCancel: hideAlert,
    });
  };

  const successDelete = async (assetId, eoiNo) => {
    try {
      setLoader(true);
      const res = await EndPointService.deleteEoiById(headers, assetId, eoiNo, {
        user_type: "BUYER",
      });
      showAlert({
        title: res.appRespData[0].eoi_delete === -2 ? "" : "Deleted!",
        content: (
          <div className="alert-content-padding">
            <h6 className="sweet-title-size sweet-title-padding">
              {res.appRespData[0].eoi_delete === -2
                ? "EOI can not be deleted at this stage"
                : `EOI: ${eoiNo} deleted successfully`}
            </h6>
          </div>
        ),
        type: res.appRespData[0].eoi_delete === -2 ? "error" : "success",
        showCancelButton: false,
        confirmText: "ok",
        onConfirm: hideAlert,
      });
      setRefreshData(refreshData + 1);
      setLoader(false);
    } catch (e) {
      console.log(e);
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  return (
    <>
      <div className="content">
        {toastType && <DynamicToast type={toastType} message={toastMessage} />}
        {alert}
        <Row>
          <Col md="12">
            <Card>
              <CardBody>
                <div className="float-end d-inline-flex p-2 justify-content-end">
                  <div
                    onClick={() => openModal("filter-modal")}
                    className="cursor-pointer"
                    data-bs-placement="top"
                    title="Inventory Search"
                  >
                    <IoSearchSharp
                      color="white"
                      size="2.4em"
                      className="icon-btn"
                    />
                  </div>
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
          <>
            <Row>
              <Col sm="6">
                <FormGroup floating>
                  <Input
                    type="text"
                    value={filterFormData.id}
                    onChange={(e) => {
                      const data = handleInputFilteration("numeric")(e);
                      setFilterFormData((previousState) => ({
                        ...previousState,
                        id: data,
                      }));
                    }}
                    name="id"
                    id="id"
                    placeholder="id"
                  />
                  <Label for="id">EOI ID</Label>
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup floating>
                  <Input
                    id="asset_id"
                    value={filterFormData.asset_id}
                    onChange={(e) => {
                      const data = handleInputFilteration("numeric")(e);
                      setFilterFormData((previousState) => ({
                        ...previousState,
                        asset_id: data,
                      }));
                    }}
                    type="text"
                    name="asset_id"
                    placeholder="Item ID"
                  />
                  <Label for="name">Item ID</Label>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="6">
                <div className="placer2">
                  <FormGroup>
                    <DateRangePicker
                      label="Submission Date Range"
                      onChange={handleEntryDate}
                      clearDates={clearDateBoolean}
                    />
                  </FormGroup>
                </div>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Input
                    id="itemname"
                    type="text"
                    value={filterFormData.asset_name}
                    onChange={(e) => {
                      const data =
                        handleInputFilteration("alphaNumericDash")(e);
                      setFilterFormData((previousState) => ({
                        ...previousState,
                        asset_name: data,
                      }));
                    }}
                    name="itemname"
                    placeholder="Item Name"
                  />
                </FormGroup>
              </Col>
            </Row>
          </>
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
