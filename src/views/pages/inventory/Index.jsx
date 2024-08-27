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
  IoAddCircleOutline,
  IoListSharp,
} from "react-icons/io5";
import ReactTable from "../../../components/ReactTable/ReactTable";
import { Form, NavLink, useNavigate } from "react-router-dom";
import DateRangePicker from "components/Common/DateRangePicker";
import { GlobalContext } from "@/GlobalState";
import TableColumn from "variables/tables/inventory";
import LiveSvgComponent from "components/svg/LiveSvg";

const Index = () => {
  const [dataState, setDataState] = useState([]);
  const [loader, setLoader] = useState(false);
  const [toastType, setToastType] = useState(null);
  const [toastMessage, setToastMessage] = useState();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const { username } = useContext(GlobalContext);

  const fetchInventory = async () => {
    try {
      setLoader(true);
      const headers = { user_id: username };
      const res = await EndPointService.getInventory(headers);
      setDataState(res.appRespData);
      setToastType("success");
      setToastMessage(res.appRespMessage);
      setLoader(false);
    } catch (e) {
      setToastType("error");
      setToastMessage(e.appRespMessage);
      setLoader(false);
    }
  };

  React.useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <>
      <div className="content">
        <DynamicToast
          v-if={toastType}
          type={toastType}
          message={toastMessage}
        />
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
                  <NavLink to="/admin/assetregister?mode=add">
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
                  columns={TableColumn}
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
            <Form onSubmit="">
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
                              type="text"
                              name="id"
                              id="id"
                              placeholder="id"
                              onChange=""
                            />

                            <Label for="id">ID</Label>
                          </FormGroup>
                        </Col>
                        <Col sm="6">
                          <FormGroup floating>
                            <Input
                              id="name"
                              type="text"
                              name="asset_name"
                              placeholder="name"
                              onChange=""
                            />

                            <Label for="name">Name</Label>
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          <div className="placer2">
                            <FormGroup>
                              <DateRangePicker
                                label="Entry Range"
                                onChange=""
                              />
                            </FormGroup>
                          </div>
                        </Col>

                        <Col sm="6">
                          <FormGroup>
                            <DateRangePicker
                              label="Availablility Range"
                              onChange=""
                            />
                          </FormGroup>
                        </Col>

                        <Col sm="6">
                          {/* <FloatingLabelDropdown
                            label="Status"
                            options={statusOptions}
                            onChange=""
                          /> */}
                        </Col>
                      </Row>
                      <div className="d-flex justify-content-end gap-1">
                        <button
                          className="btn btn-primary px-2 py-2"
                          onClick=""
                          type="clear"
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
  );
};

export default Index;
