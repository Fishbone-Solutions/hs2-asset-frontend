import React from "react";
import { useState } from "react";
// reactstrap components
import {
  Badge,
  Card,
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
function W8() {
  const [dataState, setDataState] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    id: "",
    code: "",
    entrydate: "",
    categorycode1: "",
    categorycode2: "",
    asset_name: "",
    description: "",
    asset_condition: "",
    quantity: "",
    asset_location: "",
    value: "",
    additional_info: "",
    available_from: "",
    seller_title: "",
    seller_contactno: "",
    seller_email: "",
    seller_location: "",
    statuscode: "",
  });

  const camelCaseWithSpaces = (text) => {
    return text
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("token", "x8F!@p01,*MH");
      myHeaders.append("user_id", "tabish.hb");

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          `${BACKEND_ADDRESS}/assets/-1`,
          requestOptions,
        );
        const result = await response.json();
        setDataState(result.appRespData);
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

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const columns = React.useMemo(() => [
    {
      Header: ({ column }) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>EoI. No</span>
          <span>
            {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
          </span>
        </div>
      ),
      accessor: "asset_id",
      width: "3%",
    },
    {
      Header: ({ column }) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span> User ID</span>
          <span>
            {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
          </span>
        </div>
      ),
      accessor: "entrydate",
      width: "2.8%",
    },
    {
      Header: ({ column }) => (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span> Interested Buyers </span>
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
          <span>EoI Submission Date</span>
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
          <span>Status</span>
          <span>
            {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
          </span>
        </div>
      ),
      accessor: "asset_location",
      width: "8%",
    },
    {
      Header: "ACTIONS",
      accessor: "actions",
      sortable: false,
      width: "12.5%",
      Cell: ({ row }) => (
        <div className="action-buttons">
          <Button
            className="btn-icon btn-simple"
            color="info"
            size="sm"
            onClick={() => handleEdit(row.original.asset_id, "view")}
          >
            <i className="fa fa-eye" style={{ fontSize: "1.4em" }}></i>
          </Button>
          <Button
            className="btn-icon btn-simple"
            color="success"
            size="sm"
            onClick={() => handleEdit(row.original.asset_id, "edit")}
          >
            <i className="fa fa-edit" style={{ fontSize: "1.4em" }}></i>
          </Button>
          <Button className="btn-icon btn-simple" color="secondary" size="sm">
            <i className="fa fa-exchange" style={{ fontSize: "1.4em" }}></i>
          </Button>
          <Button
            className="btn-icon btn-simple"
            color="danger"
            size="sm"
            onClick={() => handleDelete(row.original.asset_id)}
          >
            <i className="fa fa-trash" style={{ fontSize: "1.4em" }}></i>
          </Button>
        </div>
      ),
    },
  ]);
  return (
    <>
      <div className="content">
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
                  >
                    {camelCaseWithSpaces("Seller Information")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                      <Label>Asset ID *</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_title"
                          value={formData.seller_title}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_contactno"
                          value={formData.seller_contactno}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Description</Label>
                      <FormGroup
                        className={`has-label ${formData.seller_email}`}
                      >
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                          onChange={(e) => {
                            const value = e.target.value;
                            if (!verifyEmail(value)) {
                              //          setRegisterEmailState("has-danger");
                            } else {
                              //                 setRegisterEmailState("has-success");
                            }
                            setFormData((prevState) => ({
                              ...prevState,
                              seller_email: value,
                            }));
                          }}
                          required
                        />
                        {/*   {registerEmailState === "has-danger" ? (
                          <label className="error">
                            Please enter a valid email address.
                          </label>
                        ) : null} */}
                      </FormGroup>
                    </Col>

                    <Col sm="6">
                      <Label style={{ color: "#36454F" }}>Status</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_location"
                          value={formData.seller_location}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            </Col>

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
                  >
                    Expression of Interests
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <ReactTable
                    data={dataState}
                    columns={columns}
                    className="-striped -highlight primary-pagination"
                  />
                  {errorMessage}
                </CardBody>
                <CardFooter></CardFooter>
              </Card>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
}

export default W8;
