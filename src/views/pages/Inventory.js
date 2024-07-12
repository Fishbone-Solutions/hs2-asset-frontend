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
  const [dataTable2, setDataTable2] = React.useState([]);


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
    console.log(BACKEND_ADDRESS)

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`http://localhost/assets/-1`, requestOptions)

      .then((response) => response.json())
      .then((result) => setDataState(result))
      .catch((error) => console.error(error));
  };

  fetchData();
}, []);

const handleAction3= () => {

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
          <Col md="12">
            <Card>
           

              <CardBody>
              <NavLink to="/admin/assetregister" className="nav-link">

              <Button color="primary"style={{display: 'flex', justifyContent: 'flex-end'}}>

 <IoAddCircleOutline color="white" size="2em" />
</Button>
</NavLink>

                <ReactTable
                  data={dataState}
                  columns={[
                    {
                      Header: "Asset ID",
                      accessor: "id",
                    },
                    {
                      Header: "Name",
                      accessor: "asset_name",
                    },
                    {
                      Header: "Description",
                      accessor: "description",
                    },
                  /*   {
                      Header: "Location",
                      accessor: "location",
                    },  */
                    {

                      Header: "Available From",
                      accessor:"available_from",
                      Cell: ({ value }) => <span>{formatDate(value)}</span>,
                    },
                    {
                      Header: "Status",
                      accessor: "statuscode",
                    },
                 /*    {
                      Header: "Total EOI ",
                      accessor: "total_eoi",
                      sortable: false,
                      filterable: false,
                    }, */
/*                     {
                      Header: "Date",
                      accessor: "date",
                      Cell: ({ value }) => <span>{formatDate(value)}</span>,
                    }, */
/*                     {
                      Header: "Added By",
                      accessor: "added_by",
                    }, */
                    {
                      Header: "Actions",
                      accessor: "actions",
                      sortable: false,
                      filterable: false,
                      Cell: () => (
                        <div>

                        <button style={{ fontSize: '16px', backgroundColor:"transparent", border: 'none', outline: 'none'  , color: 'green'}} className="-btn" onClick={() => handleAction1()}><FaEye></FaEye></button>
                        <button style={{ fontSize: '16px',backgroundColor:"transparent", border: 'none', outline: 'none', color:"purple" }} onClick={() => handleAction2()}><GrDocumentUpdate></GrDocumentUpdate></button>
                        <button style={{ fontSize: '16px',  backgroundColor:"transparent", border: 'none', outline: 'none', color:"blue" }}  className="-btn" onClick={() => handleAction1()}><FaEdit /></button>
                        <button style={{  fontSize: '16px',  backgroundColor: 'transparent',  border: 'none',  outline: 'none', color: 'red', }} onClick={() => handleAction3()}><MdDelete /></button>
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
