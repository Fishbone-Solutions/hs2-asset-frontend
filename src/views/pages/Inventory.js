import React from "react";
import DataTable from "react-data-table-component";

// reactstrap components
import { Card, CardBody, Row, Col, Button, InputGroup, Input, Label, FormGroup, CardFooter, CardHeader, CardTitle } from "reactstrap";
import { NavLink } from "react-router-dom";
import { IoSearchSharp, IoAddCircleOutline } from "react-icons/io5";
// core components
import ReactTable from "components/ReactTable/ReactTable.js";
import BACKEND_ADDRESS from "../components/serverAddress";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { useNavigate } from 'react-router-dom';

function Inventory() {
  const [dataTable, setDataTable] = React.useState([]);
  const [alert, setAlert] = React.useState(null);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [dataState, setDataState] = React.useState([]);

  const navigate = useNavigate();

  const handleEdit = (assetId, mode) => {
    navigate(`/admin/exchangeregister/${assetId}?mode=${mode}`);
  };

  const cancelDelete = () => {
    setAlert(
      <ReactBSAlert
        danger
        style={{ display: "block", marginTop: "-100px" }}
        title="Cancelled"
        onConfirm={hideAlert}
        onCancel={hideAlert}
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
        .catch((error) => {
          setErrorMessage("Unable to load data. Please refresh the page or load after time");
          console.error(error);
        });
    };

    fetchData();
  }, [dataState]);

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
         
          setAlert(
            <ReactBSAlert
              success
              style={{ display: "block", marginTop: "-100px" }}
              title="Deleted!"
              onConfirm={hideAlert}
              onCancel={hideAlert}
              confirmBtnBsStyle="info"
              btnSize=""
            >
              Asset ID {assetId} has been deleted successfully
            </ReactBSAlert>
          );
          const updatedData = dataState.filter((row) => row.asset_id !== asset_id);
          setDataState(updatedData);
          console.log("Updated Data",dataState)
        } else {
          // Handle error response
          setAlert(
            <ReactBSAlert
              danger
              style={{ display: "block", marginTop: "-100px" }}
              title="Deletion Failed"
              onConfirm={hideAlert}
              onCancel={hideAlert}
              confirmBtnBsStyle="danger"
              btnSize=""
            >
              Error deleting asset
            </ReactBSAlert>
          );
          console.log("Error deleting asset");
        }
      })
      .catch((error) => {
        // Handle network errors or exceptions
        console.error("Network error or exception occurred:", error);
      });
  };

  const handleDelete = (assetId) => {
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(assetId)}
        onCancel={cancelDelete}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, delete it!"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this item.
      </ReactBSAlert>
    );
  };

  const searchMode = (e) => {
    setAlert(
      <ReactBSAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={inputConfirmAlert}
        onCancel={hideAlert}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        btnSize=""
      />
    );
  };

  const inputConfirmAlert = (e) => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px" }}
        onConfirm={hideAlert}
        onCancel={hideAlert}
        confirmBtnBsStyle="info"
        btnSize=""
        title={
          <p>
            You entered: <b>{e}</b>
          </p>
        }
      />
    );
  };

  const handleSearch = () => {
    setAlert(
      <ReactBSAlert
        style={{ display: "block", marginTop: "-100px", width: "80%", maxWidth: "800px", margin: "0 auto" }}
        showConfirm={false}
        onCancel={hideAlert}
      >
        <Card>
          <CardHeader>
            <CardTitle>Filter</CardTitle>
          </CardHeader>
          <div style={{ backgroundColor: '#4dc0b5', padding: '1rem', borderTopLeftRadius: '0.5rem', borderTopRightRadius: '0.5rem' }}></div>
          <div style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ flex: '1 1 45%', marginBottom: '1rem' }}>
              <label htmlFor="email1" style={{  display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568' }}>
                Email address
              </label>
              <input
                type="email"
                id="email1"
                placeholder="Enter email"
                style={{ display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #cbd5e0', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ flex: '1 1 45%', marginBottom: '1rem' }}>
              <label htmlFor="email2" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568' }}>
                Email address
              </label>
              <input
                type="email"
                id="email2"
                placeholder="Enter email"
                style={{ display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #cbd5e0', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ flex: '1 1 45%', marginBottom: '1rem' }}>
              <label htmlFor="email3" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568' }}>
                Email address
              </label>
              <input
                type="email"
                id="email3"
                placeholder="Enter email"
                style={{ display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #cbd5e0', borderRadius: '0.375rem' }}
              />
            </div>
            <div style={{ flex: '1 1 45%', marginBottom: '1rem' }}>
              <label htmlFor="email4" style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#4a5568' }}>
                Email address
              </label>
              <input
                type="email"
                id="email4"
                placeholder="Enter email"
                style={{ display: 'block', width: '100%', padding: '0.5rem', border: '1px solid #cbd5e0', borderRadius: '0.375rem' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '1rem', gap: '1rem', backgroundColor: '#f7fafc', borderBottomLeftRadius: '0.5rem', borderBottomRightRadius: '0.5rem' }}>
            <button style={{ padding: '0.5rem 1rem', fontWeight: '600', color: 'white', backgroundColor: '#4dc0b5', borderRadius: '0.375rem' }}>CLOSE</button>
            <button style={{ padding: '0.5rem 1rem', fontWeight: '600', color: 'white', backgroundColor: '#4dc0b5', borderRadius: '0.375rem' }}>CLEAR</button>
            <button style={{ padding: '0.5rem 1rem', fontWeight: '600', color: 'white', backgroundColor: '#4dc0b5', borderRadius: '0.375rem' }}>FILTER</button>
          </div>
        </Card>
      </ReactBSAlert>
    );
  };

  const columns = React.useMemo(
    () => [
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>ID</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "asset_id",
        width: '2%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>ENTRY</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "entrydate",
        width: '2%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>NAME</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "asset_name",
        width: '10%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>DESCRIPTION</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "description",
        width: '16%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>LOCATION</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "asset_location",
        width: '8%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>AVAILABILITY</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "available_from",
        width: '2%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>STATUS</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "statuscode",
        width: '5%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>EOI</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "total_eoi",
        width: '2%',
      },
      {
        Header: "ACTIONS",
        accessor: "actions",
        sortable: false,
        width: '12.5%',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              className="btn-icon btn-simple"
              color="info"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, 'view')}
            >
              <i className="fa fa-eye" style={{ fontSize: '1.4em' }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="success"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, 'edit')}
            >
              <i className="fa fa-edit" style={{ fontSize: '1.4em' }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="secondary"
              size="sm"
            >
              <i className="fa fa-exchange" style={{ fontSize: '1.4em' }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original.asset_id)}
            >
              <i className="fa fa-trash" style={{ fontSize: '1.4em' }}></i>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
      <div className="content">
        <Row>
          {alert}
          <Col md="12">
            <Card>
              <CardBody>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div onClick={handleSearch} style={{ marginRight: "10px" }}>
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
                  <NavLink to="/admin/exchangeregister?mode=add">
                    <div>
                      <IoAddCircleOutline
                        color="white"
                        size="2.4em"
                        style={{
                          backgroundColor: "#52CBCE",
                          border: "2px solid #52CBCE",
                          borderRadius: "15%",
                        }}
                        onClick={searchMode}
                      />
                    </div>
                  </NavLink>
                </div>

                <ReactTable
                  data={dataState}
                  columns={columns}
                  className="-striped -highlight primary-pagination"
                />
                {errorMessage}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Inventory;
