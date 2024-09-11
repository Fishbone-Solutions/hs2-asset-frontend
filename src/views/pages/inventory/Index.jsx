import React, { useContext, useEffect, useState } from "react";
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
  Modal,
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

const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
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

  const { alert, showAlert, hideAlert } = useAlert(); // use the hook here

  const getValueOrDefault = (value) => (value ? value : "-1");

  const fetchInventory = async () => {
    try {
      setLoader(true);

      const headers = {
        user_id: sessionStorage.getItem("username") ?? username,
      };
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
      message: "You will not be able to recover this item.",
      type: "warning",
      onConfirm: () => successDelete(id),
      onCancel: hideAlert,
    });
  };

  const successDelete = async (id) => {
    try {
      setLoader(true);
      const res = await EndPointService.deleteInventoryById(id);
      showAlert({
        title: "Deleted!",
        message: `Asset ID ${id} has been deleted successfully`,
        type: "success",
        showCancelButton: false,
        confirmText: "ok",
        onConfirm: hideAlert,
      });
      setRefreshData(refreshData + 1);
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
  }, [filterFormData, refreshData]);

  const handleFilter = () => {
    console.log("handleFilter", filterDataState.id);
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: filterDataState.id,
      asset_name: filterDataState.asset_name,
      available_from: rangeDatesAvailablility.startDate,
      available_to: rangeDatesAvailablility.endDate,
      entry_date_from: rangeDatesEntry.startDate,
      entry_date_to: rangeDatesEntry.endDate,
      statuscode: filterDataState.statuscode,
    }));
  };

  const handleEntryDate = (startDate, endDate) => {
    setRangeDatesEntry((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
    }));

    setClearDateBoolean(false);
  };

  const handleAvailablilityDate = (startDate, endDate) => {
    setRangeDatesAvailablility((prevState) => ({
      ...prevState,
      startDate: startDate,
      endDate: endDate,
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
              <CardBody>
                <div className="float-end d-inline-flex p-2 justify-content-end">
                  <div onClick={openModal} className="mr-2 cursor-pointer">
                    <IoSearchSharp
                      color="white"
                      size="2.4em"
                      className="icon-btn"
                    />
                  </div>
                  <NavLink to="/admin/inventory/create">
                    <div>
                      <IoAddCircleOutline
                        color="white"
                        size="2.4em"
                        className="icon-btn"
                      />
                    </div>
                  </NavLink>
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

      {/* { filter modal } */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Filter Modal"
      >
        <div className="content2" style={{ overflow: "hidden" }}>
          <div className="placer">
            <Form>
              <Row>
                <Col md="12">
                  <Card>
                    <CardHeader
                      className="d-flex justify-content-between align-items-center bg-info p-2 card-header-custom"
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
                          className="fa fa-times text-red"
                          style={{ fontSize: "1em" }}
                        ></i>
                      </button>
                    </CardHeader>
                    <CardBody>
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
                              label="Availablility Range"
                              clearDates={clearDateBoolean}
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
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-primary px-2 py-2"
                          type="button"
                          onClick={handleClear}
                        >
                          Clear
                        </button>
                        <button
                          className="btn btn-success submission px-2 py-2"
                          type="button"
                          onClick={handleFilter}
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
};

export default Index;
