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

import { MdDelete } from "react-icons/md";
import { GrDocumentUpdate } from "react-icons/gr";
import { IoAddCircleOutline } from "react-icons/io5";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";
import BACKEND_ADDRESS from "../components/serverAddress"
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";

function Inventory() {
  const [dataTable, setDataTable] = React.useState([]);
  const formatDate = (date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return formattedDate;
  };

  React.useEffect(() => {
    const fetchData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("token", "x8F!@p01,*MH");
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
  }, []);

  const  handleDelete = (assetId) => {
  

    console.log(assetId)
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
      .then((response) => {
        console.log(response)
        if (response.appRequestStatus === 'SUCCESS') {
          // Asset deleted successfully
          console.log('Asset deleted successfully');
          
          // Perform any additional actions or update state as needed
        } else {
          // Handle error response
          console.log('Error deleting asset');
          // Perform error handling or display error message
        }
      })
      .catch((error) => {
        // Handle network errors or exceptions
        console.log('Network error or exception occurred:', error);
      });
  };

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
          <Col md="12">
            <Card>


              <CardBody>
                <NavLink to="/admin/assetregister" className="nav-link">

                  <Button color="primary" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <IoAddCircleOutline color="white" size="2em" />
                  </Button>
                </NavLink>
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
                          <button style={{ fontSize: '16px', backgroundColor: 'transparent', border: 'none', outline: 'none', color: 'red', }} onClick={() => handleDelete(row.original.asset_id)}><MdDelete /></button>
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
