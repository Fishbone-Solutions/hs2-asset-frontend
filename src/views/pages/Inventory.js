import React from "react";

// reactstrap components
import { Card, CardBody, Row, Col, Button } from "reactstrap";
import { NavLink } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";
// core components
import ReactTable from "components/ReactTable/ReactTable.js";
import BACKEND_ADDRESS from "../components/serverAddress";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const [dataTable, setDataTable] = React.useState([]);
  const [alert, setAlert] = React.useState(null);


  const navigate = useNavigate();

  const handleEdit = (assetId, mode) => {
    navigate(`/admin/exchangeregister/${assetId}?mode=${mode}`);
  };

  const cancelDetele = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
        confirmBtnBsStyle="info"
        btnSize=""
      >
        No Changes made
      </ReactBSAlert>
    );
  };

  const hideAlert = () => {
    setAlert(null);
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

      fetch(`${BACKEND_ADDRESS}/assets/-1`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setDataState(result.appRespData);
          console.log(result);
        })
        .catch((error) => console.error(error));
    };

    fetchData();
  }, [dataTable]);



  const handleDelete = (assetId) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(assetId)}
        onCancel={() => cancelDetele()}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this asset's listing.
      </ReactBSAlert>
    );

    const successDelete = (assetId) => {
      console.log(assetId);
      // Construct the URL for the delete endpoint
      const deleteEndpoint = `${BACKEND_ADDRESS}/assets/${assetId}/-1`;

      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("token", "x8F!@p01,*MH");
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        redirect: "follow",
      };

      // Make the POST request to delete the asset
      fetch(deleteEndpoint, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          if (result.appRequestStatus === "SUCCESS") {
            // Asset deleted successfully
            console.log("Asset deleted successfully");
            const updatedData = dataState.filter(
              (row) => row.asset_id !== assetId
            );
            setDataState(updatedData);
            setAlert(
              <ReactBSAlert
                success
                style={{ display: "block", marginTop: "-100px" }}
                title="Deleted!"
                onConfirm={() => hideAlert()}
                onCancel={() => hideAlert()}
                confirmBtnBsStyle="info"
                btnSize=""
              >
                Asset ID {assetId} has been deleted successfully
              </ReactBSAlert>
            );

            // Perform any additional actions or update state as needed
          } else {
            // Handle error response
            setAlert(
              <ReactBSAlert
                success
                style={{ display: "block", marginTop: "-100px" }}
                title="Deleted Operation Failed"
                onConfirm={() => hideAlert()}
                onCancel={() => hideAlert()}
                confirmBtnBsStyle="danger"
                btnSize=""
              >
                Error deleting asset
              </ReactBSAlert>
            );
            console.log("Error deleting asset");
            // Perform error handling or display error message
          }
        })
        .catch((error) => {
          // Handle network errors or exceptions
          console.error("Network error or exception occurred:", error);
        });
    };
  };

  const [dataState, setDataState] = React.useState(
    dataTable.map((prop, key) => {
      return {
        id: key,
      };
    })
  );
  const columns = React.useMemo(
    () => [

    {
      Header: "ID",
      accessor: "asset_id",
      width: 40, // Set column width
      minWidth: 40, // Set minimum column width
      maxWidth: 40, // Set maximum column width
    },
    {
      Header: "Entry Date",
      accessor: "entrydate",
      width: "150px", // Set a manual width


    },
    {
      Header: "Name",
      accessor: "asset_name",
      width: 100, // Set column width
      minWidth: 100, // Set minimum column width
      maxWidth: 100, // Set maximum column width

    },
    {
      Header: "DESCRIPTION",
      accessor: "description",
      width: 300, // Set column width
      minWidth: 300, // Set minimum column width
      maxWidth: 300, // Set maximum column width

    },
    {
      Header: "LOCATION",
      accessor: "asset_location",
      width: "100px", // Set a manual width

    },
    {
      Header: "AVAILABILITY",
      accessor: "available_from",
      width: "100px", // Set a manual width

    },
    {
      Header: "STATUS",
      accessor: "statuscode",
      width: "100px", // Set a manual width

    },
    {
      Header: "EOI",
      accessor: "total_eoi",
      width: "100px", // Set a manual width

    },

    {
      Header: "Actions",
      accessor: "actions",
      width: "200px", // Set a manual width

      Cell: ({ row }) => (
        <div>
          <Button
            className="btn-icon btn-simple"
            color="info"
            size="sm"
          >
            <i
              className="fa fa-eye"
              onClick={() => handleEdit(row.original.asset_id,'view')}
            ></i>
          </Button>
          {` `}
          <Button
            className="btn-icon btn-simple"
            color="success"
            size="sm"
          >
            <i className="fa fa-edit"
            onClick={() => handleEdit(row.original.asset_id, 'edit')}
            ></i>
          </Button>

          <Button
            className="btn-icon btn-simple"
            color="secondary"
            size="sm"
          >
            <i className="fa fa-files-o	"></i>
          </Button>
          {` `}

          <Button
            className="btn-icon btn-simple"
            color="danger"
            size="sm"
            outline={true}
            onClick={() => handleDelete(row.original.asset_id)}
          >
            <i
              className="fa fa-trash"
              style={{
                color: "#EE8257",
                transition: "color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.target.style.color = "white")
              }
              onMouseOut={(e) =>
                (e.target.style.color = "#EE8257")
              }
            ></i>
          </Button>
        </div>
      ),
    },
  ],
)



  return (
    <>
      <div className="content">
        <Row>
          {alert}
          <Col md="12">
            <Card>
              <CardBody>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div style={{ marginRight: "10px" }}>
                    <IoSearchSharp
                      color="white"
                      size="2.4em"
                      style={{
                        backgroundColor: "#52CBCE",
                        border: "2px solid #52CBCE",
                        borderRadius: "15%",
                      }}
                    />
                  </div>
                  <NavLink to="/admin/exchangeregister">
                    <div>
                      <IoAddCircleOutline
                        color="white"
                        size="2.4em"
                        style={{
                          backgroundColor: "#52CBCE",
                          border: "2px solid #52CBCE",
                          borderRadius: "15%",
                        }}
                      />
                    </div>
                  </NavLink>
                </div>

                <ReactTable
                  data={dataState}
                columns={columns}
                  className="-striped -highlight primary-pagination"
                />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Inventory;
