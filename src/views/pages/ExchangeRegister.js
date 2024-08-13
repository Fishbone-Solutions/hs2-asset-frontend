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
  CardTitle,
  CardFooter,
  Row,
  Col,
} from "reactstrap";
import ReactTable from "components/ReactTable/ReactTable.js";
import { GlobalContext } from "GlobalState";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_ADDRESS from "views/components/serverAddress";
import ReactDatetime from "react-datetime";

function ExchangeRegister() {
  const [formData, setFormData] = useState({
    id: "",
    asset_name: "",
    available_from: "",
    available_to: "",
  });
  const [filterFormData, setFilterFormDate] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [alert, setAlert] = React.useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { username } = useContext(GlobalContext);

  const handleEdit = (assetId, mode) => {
    navigate(`/admin/exchangeregister/${assetId}?mode=${mode}`);
  };

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
          `${BACKEND_ADDRESS}/register?fltr_id=-1&fltr_name=-1&fltr_from_availability=-1&fltr_to_availability=-1`,
          requestOptions,
        );
        const result = await response.json();
        setFilterFormDate(result.appRespData);
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

  const handleChange = async (event) => {
    const { name, value } = event.target;
    event.preventDefault();

    const getValueOrDefault = (value) => (value ? value : "-1");

    // Construct the query parameters
    const params = new URLSearchParams({
      fltr_id: getValueOrDefault(filterFormData.id),
      fltr_name: getValueOrDefault(filterFormData.asset_name),
      fltr_from_availability: getValueOrDefault(filterFormData.available_from),
      fltr_to_availability: getValueOrDefault(filterFormData.available_to),
    });

    const url = `${BACKEND_ADDRESS}/assets/-1?${params.toString()}`;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: "x8F!@p01,*MH",
        user_id: username,
      },
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched Data:", data.appRespData); // Debugging log
      setFilterFormDate(data.appRespData); // Update your component state with fetched data
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleView = (asset_id, mode) => {
    console.log("asset_idi", asset_id);
    navigate(`/admin/assetregister/${asset_id}?mode=${mode}`);
    console.log("location odi ", location);
  };
  const columns = React.useMemo(
    () => [
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>ID</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "asset_id",
        width: "2%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>CATEGORY</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "categorycode1",
        width: "2%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>SUB CATEGORY</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "categorycode2",
        width: "2%",
      },

      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>NAME</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "asset_name",
        width: "10%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>DESCRIPTION</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "description",
        width: "16%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>SELLER</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "seller_title",
        width: "8%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>AVAILABILITY</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "available_from",
        width: "2%",
      },
      {
        Header: "ACTIONS",
        accessor: "actions",
        sortable: false,
        width: "1%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              className="btn-icon btn-simple"
              color="info"
              size="sm"
              onClick={() => handleView(row.original.asset_id, "exchange")}
            >
              <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="success"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, "view")}
            >
              <i className="fa fa-edit" style={{ fontSize: "0.9em" }}></i>
            </Button>
          </div>
        ),
      },
    ],
    [],
  );
  return (
    <>
      <div className="content">
        {alert}
        <Form>
          <Row>
            <Col md="12">
              <Card>
                <CardHeader>
                  <CardTitle
                    tag="h6"
                    style={{
                      color: "rgb(82,203,206)",
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      WebkitTextTransform: "capitalize",
                    }}
                  ></CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Category</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="id"
                          value={formData.id}
                          required
                          onChange={(event) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              id: event.target.value, // Update 'id' based on the text input's value
                            }))
                          }
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Asset Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_name"
                          value={formData.asset_name}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Item Location</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="description"
                          //   value={formData.description}
                          onChange={(e) => {
                            const value = e.target.value;
                          }}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Availability</Label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: "form-control",
                            placeholder: "DD/MM/YYYY",
                          }}
                          onChange={(momentDate) =>
                            setFormData((prevState) => ({
                              ...prevState,
                              available_from: momentDate.format("DD/MM/YYYY"),
                            }))
                          }
                          timeFormat={false}
                          dateFormat="DD/MM/YYYY"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            </Col>
          </Row>
        </Form>

        <Row>
          <Col md="12">
            <Card>
              <CardHeader
                style={{
                  paddingTop: 0,
                  translate: "4.8px 20px",
                }}
              >
                <CardTitle
                  tag="h6"
                  style={{
                    color: "rgb(82,203,206)",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    WebkitTextTransform: "capitalize",
                  }}
                ></CardTitle>
              </CardHeader>
              <CardBody
                style={{
                  paddingTop: 0,
                }}
              >
                <ReactTable
                  data={filterFormData}
                  columns={columns}
                  className="-striped -highlight primary-pagination "
                />
                {errorMessage}
              </CardBody>
              <CardFooter/>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default ExchangeRegister;
