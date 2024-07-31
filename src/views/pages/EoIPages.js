import React from "react";
import { useState,useContext } from "react";
import { GlobalContext } from "GlobalState";
// reactstrap components
import {
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

function EoIPages() {
  const [dataState,setDataState] = useState([])
  const { username } = useContext(GlobalContext)
  const[errorMessage,setErrorMessage] = useState("")
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
        const response = await fetch(`${BACKEND_ADDRESS}/assets/-1`, requestOptions);
        const result = await response.json();
        setDataState(result.appRespData);
        console.log(result);
      } catch (error) {
        setErrorMessage("Unable to load data. Please refresh the page or load after time");
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
  const columns = React.useMemo(
    () => [
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>EoI. No</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "asset_id",
        width: '2%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span></span>
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
   
    ],
    []
  );
  return (
    <>
         <div className="content">
        <Form >
          <Row>
            {/* Asset Seller Detail*/}
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
                    
                    
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Asset ID
                    </Label>
                    <Col sm="4">
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
                    <Label sm="2" style={{ color: "#36454F" }}>
                      Name
                    </Label>
                    <Col sm="4">
                      <FormGroup>
                        <Input
                          type="text"
                          name="seller_contactno"
                          value={formData.seller_contactno}
                          required
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Label sm="2" style={{ color: "#36454F" }}>
                     Description
                    </Label>
                    <Col sm="4">
                      <FormGroup >
                        <Input
                          type="text"
                          name="seller_email"
                          value={formData.seller_email}
                          onChange={(e) => {
                          
                            setFormData((prevState) => ({
                              ...prevState,
                              seller_email: value,
                            }));
                          }}
                          required
                        />
                       
                         
                      </FormGroup>
                    </Col>
                    <Label sm="2" style={{ color: "#36454F" }}>
Status
                    </Label>
                    <Col sm="4">
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
                <CardFooter>
                </CardFooter>
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
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>
            </Row>
            </Form>
            </div>
    </>
  );
}

export default EoIPages;
