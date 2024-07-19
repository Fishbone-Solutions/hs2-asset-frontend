import React from "react";

// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
  Button
} from "reactstrap";
import { NavLink } from "react-router-dom";
import { IoSearchSharp } from "react-icons/io5";

import { MdDelete } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { IoAddCircleOutline } from "react-icons/io5";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";
import BACKEND_ADDRESS from "../components/serverAddress"
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import ReactBSAlert from "react-bootstrap-sweetalert";

function Inventory() {
  const [dataTable, setDataTable] = React.useState([]);
  const [alert, setAlert] = React.useState(null);


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
      myHeaders.append("user_id","tabish.hb")
      const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow"
      };

      fetch(`${BACKEND_ADDRESS}/assets/-1`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setDataState(result.appRespData)
          console.log(result)
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
   

const  successDelete = (assetId) => {
  console.log(assetId);
  // Construct the URL for the delete endpoint
  const deleteEndpoint = `${BACKEND_ADDRESS}/assets/${assetId}/-1`;
   
  const myHeaders = new Headers();
  myHeaders.append("accept", "application/json");
  myHeaders.append("token", "x8F!@p01,*MH");
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    redirect: "follow"
  };

  // Make the POST request to delete the asset
  fetch(deleteEndpoint, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.appRequestStatus === "SUCCESS") {
        // Asset deleted successfully
        console.log("Asset deleted successfully");
        const updatedData = dataState.filter((row) => row.asset_id !== assetId);
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
    Asset ID {assetId } has been deleted successfully
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
}

  const [dataState, setDataState] = React.useState(
    dataTable.map((prop, key) => {
      return {
        id: key,
      };
    })
  );
  return (
    <>

      <div className="content">
        <Row>
          {alert}
          <Col md="12">
            <Card>
              <CardBody>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
  <div style={{ marginRight: '10px' }}>
    <IoSearchSharp color="white" size="2.4em" style={{ backgroundColor: '#52CBCE', border: '2px solid #52CBCE', borderRadius: '15%'}} />
  </div>
  <NavLink to="/admin/assetregister" >
  <div>
    <IoAddCircleOutline color="white" size="2.4em" style={{ backgroundColor: '#52CBCE', border: '2px solid #52CBCE', borderRadius: '15%' }} />
  </div>
  </NavLink>
  </div>

                <ReactTable
                  data={dataState}
                  columns={[
                    {
                      Header: "Asset ID",
                      accessor: "asset_id",
                    },
                    {
                      Header: "Entry Date",
                      accessor: "entrydate",
                    },
                    {
                      Header: "Name",
                      accessor: "asset_name",
                    },
                    {
                      Header: "DESCRIPTION",
                      accessor: "description",
                    },
                    {
                      Header: "LOCATION",
                      accessor: "asset_location",
                    },
                    {
                      Header: "AVAILABILITY",
                      accessor: "available_from",
                    },
                    {
                      Header: "STATUS",
                      accessor: "statuscode",
                    },
                    {
                      Header: "EOI",
                      accessor: "total_eoi",
                    },
                    

                    
                    {
                      Header: "Actions",
                      accessor: "actions",
                      sortable: false,
                      filterable: false,
                      Cell: ( { row }) => (
                        <div>

                          <button style={{ fontSize: '16px', backgroundColor: "transparent", border: 'none', outline: 'none', color: 'green' }} className="-btn" onClick={() => handleAction1()}><FaEye></FaEye></button>
                          <button style={{ fontSize: '16px', backgroundColor: "transparent", border: 'none', outline: 'none', color: "purple" }} onClick={() => handleAction2()}><GrDocumentUpdate></GrDocumentUpdate></button>
                          <button style={{ fontSize: '16px', backgroundColor: "transparent", border: 'none', outline: 'none', color: "blue" }} className="-btn" onClick={() => handleAction1()}><FaEdit /></button>
                          <button style={{ fontSize: '16px', backgroundColor: "transparent", border: 'none', outline: 'none', color: "red" }}  className="-btn" onClick={() =>handleDelete(row.original.asset_id)}><MdDelete /></button>
                        </div>
                      ),
                    },
                  ]}
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
