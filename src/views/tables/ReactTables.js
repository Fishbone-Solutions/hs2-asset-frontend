import React from "react";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

// core components
import ReactTable from "components/ReactTable/ReactTable.js";
import BACKEND_ADDRESS from "../components/serverAddress"


function ReactTables() {
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
    console.log(BACKEND_ADDRESS)

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow"
    };
    
    fetch(`${BACKEND_ADDRESS}/inventory`, requestOptions)

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
                <ReactTable
                  data={dataState}
                  columns={[
                    {
                      Header: "Asset ID",
                      accessor: "asset_id",
                      width: 10, 
                    },
                    {
                      Header: "Date",
                      accessor: "date",
                      Cell: ({ value }) => <span>{formatDate(value)}</span>,

                    },
                    {
                      Header: "Added By",
                      accessor: "added_by",
                    },
                    {
                      Header: "Name",
                      accessor: "name",
                    },
                    {
                      Header: "Description",
                      accessor: "description",
                    },
                    {
                      Header: "Status",
                      accessor: "status",
                    },
                    {
                      Header: "Total EOI ",
                      accessor: "total_eoi",
                      sortable: false,
                      filterable: false,
                    },
                    {
                      Header: "Actions",
                      accessor: "actions",
                      sortable: false,
                      filterable: false,
                      Cell: () => (
                        <div>
                          <button  className="-btn"  onClick={() => handleAction1()}>View EOI</button>
                          <button onClick={() => handleAction2()}>Update </button>
                          <button onClick={() => handleAction3()}> Delete</button>
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

export default ReactTables;
