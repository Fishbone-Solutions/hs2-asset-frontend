import React from "react";
import DataTable from "react-data-table-component";

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


  const searchMode = (e) => {
    console.log("hi")
    setAlert(
      <ReactBSAlert
        input
        showCancel
        style={{ display: "block", marginTop: "-100px" }}
        title="Input something"
        onConfirm={(e) => inputConfirmAlert(e)}
        onCancel={() => hideAlert()}
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
        onConfirm={() => hideAlert()}
        onCancel={() => hideAlert()}
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
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>ID</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "asset_id",
        width: '2%', // Set column width
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>ENTRY </span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "entrydate",
        width: '2%', // Set column width
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>NAME</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "asset_name",
        width: '10%', // Set column width
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>DESCRIPTION</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "description",
        width: '16%', // Set column width
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>LOCATION</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "asset_location",
        width: '8%', // Set column width
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>AVAILABILITY</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "available_from",
        width: '2%', // Set column width
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>STATUS</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "statuscode",
        width: '5%', // Set column width
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>EOI</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "total_eoi",
        width: '2%', // Set column width
      },
      {
        Header: "ACTIONS",
        accessor: "actions",
        sortable: false,
        width: '12.5%', // Set column width
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              className="btn-icon btn-simple"
              color="info"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, 'view')}
            >
              <i className="fa fa-eye"
               style={{ fontSize: '1.4em' }}
              ></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="success"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, 'edit')}
            >
              <i className="fa fa-edit"  style={{ fontSize: '1.4em' }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="secondary"
              size="sm"
            >
    <i className="fa fa-handshake-o" style={{ fontSize: '1.4em' }}></i>


            </Button>
            <Button
              className="btn-icon btn-simple"
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original.asset_id)}
            >
              <i
                className="fa fa-trash"
                style={{
                  fontSize: '1.4em' 
                }}
      
              ></i>
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
      onClick={(e) => searchMode(e)}
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
