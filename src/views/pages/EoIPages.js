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
import { useParams,useLocation,useNavigate } from "react-router-dom";
import BACKEND_ADDRESS from "views/components/serverAddress";
import ReactBSAlert from "react-bootstrap-sweetalert";
import defaultLiveIconImage from "assets/img/live.png";
import defaultApplicationIconImage from "assets/img/layer-group-solid.svg";
import "./EoiPages.css"

function EoIPages() {
  const [dataState,setDataState] = useState([])
  const[errorMessage,setErrorMessage] = useState("")
  const [alert, setAlert] = React.useState(null);

  const [formData, setFormData] = useState({
    asset_id: "",
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

  const handleDelete = (assetId,eoino) => {

    console.log("hd delete",eoino);
    setAlert(
      <ReactBSAlert
        warning
        style={{ display: "block", marginTop: "-100px" }}
        title="Are you sure?"
        onConfirm={() => successDelete(assetId,eoino)}
        onCancel={cancelDelete}
        confirmBtnBsStyle="info"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes"
        cancelBtnText="Cancel"
        showCancel
        btnSize=""
      >
        You will not be able to recover this item.
      </ReactBSAlert>
    );
  };

  const successDelete = (assetId,eoino) => {
    const deleteEndpoint = `${BACKEND_ADDRESS}/assets/${assetId}/eoi/${eoino}/-1`;

    console.log("sd delete",eoino);

    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("token", "x8F!@p01,*MH");
    myHeaders.append("user_id", username);  // Add user_id to headers


    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(deleteEndpoint, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
        if (result.appRequestStatus === "SUCCESS") {
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
             EoI {eoino} has been deleted successfully
            </ReactBSAlert>
          );

          setDataState((prevState) => prevState.filter((row) => row.id !== eoino));
          console.log("Updated Data", dataState);
        } else {
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
        console.error("Network error or exception occurred:", error);
      });
  };

  const hideAlert = () => {
    setAlert(null);
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








  const navigate = useNavigate();

  const { id } = useParams();
  const {username} = useContext(GlobalContext);
  const [liveIconImage, setliveIconImage] = React.useState(defaultLiveIconImage);
  const [applicationIconImage, setApplicationIconImage] = React.useState(defaultApplicationIconImage);

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
        const response = await fetch(`${BACKEND_ADDRESS}/assets/${id}`, requestOptions);
        const result = await response.json();
        setFormData(result.appRespData[0]);
        console.log(result);
  
        const responseTable = await fetch(`${BACKEND_ADDRESS}/assets/${id}/eoi/-1`, requestOptions);
        const resultTable = await responseTable.json();
       setDataState (resultTable.appRespData);
        console.log(resultTable.appRespData);

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

  const handleEdit = (assetId, mode,eoino) => {
    console.log("mode from edit",mode)
    navigate(`/admin/eoi/details/${assetId}?mode=${mode}&eoino=${eoino}`);

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
        accessor: "id",
        width: '0.9%',

      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span> INTERESTED BUYER </span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "buyer_name",
        width: '10%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>SUBMISSION  DATE </span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "submission_date",
        width: '1.5%',
      },
      {
        Header: ({ column }) => (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>STATUS </span>
            <span>{column.isSorted ? (column.isSortedDesc ? '▼' : '▲') : ''}</span>
          </div>
        ),
        accessor: "eoi_status",
        width: '0.5%',
        Cell: ({ row }) => {
          const statusCode = row.original.eoi_status;
          const statusStyles = {
            'SOLD': { backgroundColor: '#dc3545', color: 'white' },
            'LIVE': { backgroundColor: '#28a745', color: 'white', icon: liveIconImage },
            'LISTING': { backgroundColor: '#17a2b8', color: 'white' },
            'EOI_SUBMITTED': { backgroundColor: '#4049CC', color: 'white' },
            'IN_NEGOTIATION': { backgroundColor: '#22B04C', color: 'white' },
            'PAYMENT_SENT': { backgroundColor: '#02A8F3', color: 'white' },
            'PAYMENT_RECEIVED': { backgroundColor: '#10F13F', color: 'white' },
            'GOODS_SENT': { backgroundColor: '#58F6F5', color: 'black' },
            'GOODS_RECEIVED': { backgroundColor: '#779519', color: 'white' },
            'UNAVAILABLE_SOLD': { backgroundColor: '#FB301B', color: 'white' }
          };
      
          const style = statusStyles[statusCode] || { backgroundColor: 'grey', color: 'white' };

      
          return (
            <span style={{
              ...style,
              padding: '4px 8px',  // Updated padding here
              fontSize: '90%',
              fontWeight: 700,
              lineHeight: 1,
              textAlign: 'center',
              whiteSpace: 'nowrap',
              verticalAlign: 'baseline',
              borderRadius: '10rem',
              display: 'inline-block'
            }}>
              {style.icon && (
                <>
                  <img src={style.icon} width='15px' alt="..." style={{marginRight: '3px', verticalAlign: 'middle'}} />
                </>
              )}
              {statusCode}
            </span>
          );
        },
      }
,
      {
        Header: "ACTIONS",
        accessor: "actions",
        sortable: false,
        width: '0.7%',
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button

className="btn-icon btn-simple"
color="info"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, 'view',row.original.id)}
            >
              <i className="fa fa-eye" style={{ fontSize: '0.9em' }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="success"
              size="sm"
              onClick={() => handleEdit(row.original.asset_id, 'edit',row.original.id)}
            >
              <i className="fa fa-edit" style={{ fontSize: '0.9em' }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original.asset_id,row.original.id)}
            >
              <i className="fa fa-times" style={{ fontSize: '0.9em' }} ></i>
            </Button>
          </div>
        ),
      },
    ]
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
                    {camelCaseWithSpaces("Item Information")}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col sm="6">
                    <Label >
                       ID 
                    </Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="code"
                          value={formData.asset_id}
                          onChange={handleChange}
                          required
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    
                    <Col sm="6">
                    <Label  style={{ color: "#36454F" }}>
                      Name
                    </Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_name"
                          value={formData.asset_name}
                          onChange={handleChange}
                          required
                          disabled={true}

                        />
                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <Row>
                   
                  <Col sm="6">
                    <Label style={{ color: "#36454F" }}>
                    Description
                    </Label>
                      <FormGroup className={`has-label ${formData.seller_email}`}>
                        <Input
                          type="text"
                          name="description"
                          value={formData.description}
                          onChange={(e) => {
                            const value = e.target.value;

                          
                          }}
                          required
                          disabled={true}

                        />
                     
                      </FormGroup>
                    </Col>
                    
                    <Col sm="6">
                    <Label style={{ color: "#36454F" }}>
                    Status
                    </Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="statuscode"
                          value={formData.statuscode}
                          onChange={handleChange}
                          required
                          disabled={true}

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
                  data={dataState}
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

export default EoIPages;
