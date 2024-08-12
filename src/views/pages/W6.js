import React from "react";
import { useState,useContext } from "react";
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
import { useParams,useNavigate } from "react-router-dom";
import BACKEND_ADDRESS from "views/components/serverAddress";
import ReactBSAlert from "react-bootstrap-sweetalert";
import ReactDatetime from "react-datetime";
import defaultLiveIconImage from "assets/img/live.png";
import "./EoiPages.css"

function W6() {
  const [dataState,setDataState] = useState([])
  const[errorMessage,setErrorMessage] = useState("")
  const [alert, setAlert] = React.useState(null);
  const [formData, setFormData] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const {username} = useContext(GlobalContext);
  const [liveIconImage, setliveIconImage] = React.useState(defaultLiveIconImage);

  const camelCaseWithSpaces = (text) => {
    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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
        const response = await fetch(`${BACKEND_ADDRESS}/assets/-1`, requestOptions);
        const result = await response.json();
        setFormData(result.appRespData);
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
            <span>CATEGORY</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "categorycode1",
        width: '2%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>SUB CATEGORY</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "categorycode2",
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
            <span>SELLER</span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "seller_title",
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
        Header: "ACTIONS",
        accessor: "actions",
        sortable: false,
        width: '1%',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              className="btn-icon btn-simple"
              color="info"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, 'view')}
            >
               <i className="fa fa-eye" style={{ fontSize: '0.9em' }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="success"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, 'edit')}
            >
              <i className="fa fa-edit" style={{ fontSize: '0.9em' }}></i>
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
          {alert}
        <Form >
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
                    {camelCaseWithSpaces("Exchange Register")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                    <Label >
                    Category
                    </Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="code"
                       //   value={formData}
                          onChange={handleChange}
                          required
                        />
                      </FormGroup>
                    </Col>
                    
                    <Col sm="6">
                    <Label  style={{ color: "#36454F" }}>
                      Asset Name
                    </Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_name"
                     //     value={formData.asset_name}
                          onChange={handleChange}
                          required

                        />
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Row>
                   
                  <Col sm="6">
                    <Label style={{ color: "#36454F" }}>
                      Item Location
                    </Label>
                      <FormGroup >
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
                    <Label style={{ color: "#36454F" }}>
                    Availability
                    </Label>
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
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>
       
</Row>
</Form>

<Row>
            <Col md="12">
              <Card>
                <CardHeader   style={{
                  paddingTop: 0,
                  translate: '4.8px 20px', 

                }}>
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
                <CardBody
                style={{
                  paddingTop: 0
                }}
                >   

                <ReactTable 
                  data={formData}
                  columns={columns}
                  className="-striped -highlight primary-pagination "

                />
                {errorMessage}
                </CardBody>
                <CardFooter>
                </CardFooter>
              </Card>
            </Col>
            </Row>
          </div>
    </>
  );
}

export default W6;
