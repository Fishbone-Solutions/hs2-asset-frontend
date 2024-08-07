import React from "react";
import { useState,useContext} from "react";
import defaultLiveIconImage from "assets/img/live.png";
import defaultApplicationIconImage from "assets/img/layer-group-solid.svg";
import { GlobalContext } from '../../GlobalState';

// reactstrap components
import { Card, CardBody, Row, Col, Button,Input,CardHeader,CardTitle,Label,FormGroup,  } from "reactstrap";
import Select from "react-select";
import { Form, NavLink } from "react-router-dom";
import { IoSearchSharp, IoAddCircleOutline } from "react-icons/io5";
// core components
import ReactTable from "components/ReactTable/ReactTable.js";
import BACKEND_ADDRESS from "../components/serverAddress";
import ReactBSAlert from "react-bootstrap-sweetalert";
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useEffect } from "react";
import ReactDatetime from "react-datetime";
import "./Inventory.css";

function Inventory() {

  const { username, setUsername } = useContext(GlobalContext);
  const [alert, setAlert] = React.useState(null);
  const [liveIconImage, setliveIconImage] = React.useState(defaultLiveIconImage);
  const [applicationIconImage, setApplicationIconImage] = React.useState(defaultApplicationIconImage);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [dataState, setDataState] = React.useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [clearTrigger, setClearTrigger] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const[filterFormData, setFilterFormDate] = useState({
    id: '',
    asset_name: '',
    entry_date_from: null,
    entry_date_to: null,
    available_from: null,
    available_to: null,
    statuscode: null,

  });
  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  const navigate = useNavigate();
  
  const handleEdit = (assetId, mode) => {
    navigate(`/admin/exchangeregister/${assetId}?mode=${mode}`);
  };

  const handleEoI = (assetId) => {
    navigate(`/admin/eoi/${assetId}`);
  }

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // 20% opacity black background
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: '1000'

    },
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '50%',  // Increase the width
      height: '50%', // Increase the height
      padding: '0',  // Remove default padding
      backgroundColor:"#FFFFFF",
      overflow:"hidden"
    },
  };
  

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilterFormDate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };  


  const handleFilterFormDataSubmission = async (event) => {
    event.preventDefault();
    
    const getValueOrDefault = (value) => (value ? value : '-1');
  
    // Construct the query parameters
    const params = new URLSearchParams({
      fltr_id: getValueOrDefault(filterFormData.id),
      fltr_name: getValueOrDefault(filterFormData.asset_name),
      fltr_status: getValueOrDefault(filterFormData.statuscode),
      fltr_from_entry_date: getValueOrDefault(filterFormData.entry_date_from),
      fltr_to_entry_date: getValueOrDefault(filterFormData.entry_date_to),
      fltr_from_availability: getValueOrDefault(filterFormData.available_from),
      fltr_to_availability: getValueOrDefault(filterFormData.available_to),
    });
  
    const url = `${BACKEND_ADDRESS}/assets/-1?${params.toString()}`;
  
    const requestOptions = {
      method: 'GET', // Assuming the API expects a GET request
      headers: {
        'Content-Type': 'application/json',
        token: "x8F!@p01,*MH",
        user_id: username,
      },
    };
  
    try {
      const response = await fetch(url, requestOptions);
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Fetched Data:', data.appRespData); // Debugging log
      setDataState(data.appRespData); // Update your component state with fetched data
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  
    console.log('Filter Form Data:', filterFormData); // Log the form data for debugging
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

  const fetchData = async () => {
    const myHeaders = new Headers();
    myHeaders.append("accept", "application/json");
    myHeaders.append("token", "x8F!@p01,*MH");
    myHeaders.append("user_id", username);  // Add user_id to headers



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


  React.useEffect(() => {
    const fetchData = async () => {
      const myHeaders = new Headers();
      myHeaders.append("accept", "application/json");
      myHeaders.append("token", "x8F!@p01,*MH");
      myHeaders.append("user_id", username);  // Add user_id to headers



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

  const successDelete = (assetId) => {
    console.log(assetId);
    const deleteEndpoint = `${BACKEND_ADDRESS}/assets/${assetId}/-1`;

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
              Asset ID {assetId} has been deleted successfully
            </ReactBSAlert>
          );

          setDataState((prevState) => prevState.filter((row) => row.asset_id !== assetId));
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
        confirmBtnText="Yes"
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
  useEffect(() => {
    if (clearTrigger) {
      fetchData();
      setClearTrigger(false); // Reset the trigger
    }
  }, [clearTrigger]);

  const handleClearClick = () => {
    setFilterFormDate({});
    setClearTrigger(true);
  };

  const statusOptions  =[
    { value: "Listing", label: "Listing" },
    { value: "Live", label: "Live" },
    { value: "Sold", label: "Sold" },
  ]

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
        accessor: "entrydate_formatted",
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
        width: '3%',
        Cell: ({ row }) => (
          row.original.statuscode == 'Sold' ? 
          <span class='badge badge-danger badge-pill'>{row.original.statuscode}</span> :  
          (row.original.statuscode == 'Live') ?<span class='badge badge-success badge-pill'> 
            <img src={liveIconImage}  style={{
               width: '15px',
               height: '15px', // Add height if needed
               boxShadow: '0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.3), 0 0 30px rgba(255, 0, 0, 0.2)', // Red gradient glow
               borderRadius: '50%', // Optional: make it circular
            }} width={'15px'} alt="..." /> 
            &nbsp; {row.original.statuscode}  
          </span> : 
          (row.original.statuscode == 'Listing') ?
            <span class='badge badge-info badge-pill'> 
              &nbsp; {row.original.statuscode} 
            </span> : 
            row.original.statuscode
        ),
       
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
            <Button
              className="btn-icon btn-simple"
            color="secondary"
            onMouseEnter={() => setIsHovered(true)}  // Set hover state to true
            onMouseLeave={() => setIsHovered(false)} // Set hover state to false

              size="sm"
              onClick={() => handleEoI(row.original.asset_id)}

            >
              <img src={applicationIconImage}   width={'15px'} alt="..." />
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="danger"
              size="sm"
              onClick={() => handleDelete(row.original.asset_id)}
            >
              <i className="fa fa-times" style={{ fontSize: '0.9em' }} ></i>
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <>
    <Modal
    isOpen={modalIsOpen}
    onRequestClose={closeModal}
    style={customStyles}
    contentLabel="Filter Modal"
  >
<div className="content2" style={{ overflow: "hidden" }}>
<div className="placer">

      <Form onSubmit={handleFilterFormDataSubmission}>

        <Row>

          <Col md="12">
            <Card>

              <CardHeader style={{ background: '#52CBCE', height: '32px' }}>
                <h6
                  style={{
                    color: 'white',
                    fontSize: '1rem',
                    transform: 'translateY(-10px)',
                  }}
                >
                  <i
                    className="fa fa-filter"
                    style={{
                      fontSize: '0.9em',
                      backgroundColor: '#52CBCE',
                      border: '2px solid #52CBCE',
                      borderRadius: '15%',
                    }}
                  ></i>
                  Filter
                </h6>
              </CardHeader>

              <CardBody
            
              >
                  <Row >
                    <Col sm="6">
                      <Label>ID</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="id"
                          onChange={handleChange}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="6">
                      <Label>Name</Label>
                      <FormGroup>
                        <Input
                          type="text"
                          name="asset_name"
                          onChange={handleChange}
                          
                        />
                      </FormGroup>
                    </Col>

                    <Col sm="3">

                      <Label style={{ color: '#36454F' }}>Entry From</Label>
                      <div className="placer2">

                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: 'form-control',
                            placeholder: 'DD/MM/YYYY',
                          }}
                          dateFormat="DD/MM/YYYY" // Specify the date format

                          onChange={(momentDate) =>
                            setFilterFormDate((prevState) => ({
                              ...prevState,
                              entry_date_from: momentDate.format(
                                'DD/MM/YYYY'
                              ),
                            }))
                          }
                          timeFormat={false}
                        />

                      </FormGroup>
                      </div> 

                    </Col>
                    <Col sm="3">
                      <Label style={{ color: '#36454F' }}>Entry To</Label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: 'form-control',
                            placeholder: 'DD/MM/YYYY',
                          }}
                          onChange={(momentDate) =>
                            setFilterFormDate((prevState) => ({
                              ...prevState,
                              entry_date_to: momentDate.format('DD/MM/YYYY'),
                            }))
                          }
                          dateFormat="DD-MM-YYYY" // Specify the date format

                          timeFormat={false}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <Label style={{ color: '#36454F' }}>Available From</Label>
                      <FormGroup>
                        <ReactDatetime
                          inputProps={{
                            className: 'form-control',
                            placeholder: 'DD/MM/YYYY',
                          }}
                          dateFormat="DD/MM/YYYY" // Specify the date format

                          onChange={(momentDate) =>
                            setFilterFormDate((prevState) => ({
                              ...prevState,
                              available_from: momentDate.format('DD/MM/YYYY'),
                            }))
                          }
                          timeFormat={false}
                        />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <Label style={{ color: '#36454F' }}>Available To</Label>
                      <FormGroup>
                        <ReactDatetime
                        dateFormat="DD-MM-YYYY" 
                         inputProps={{
                            className: 'form-control',
                            placeholder: 'DD/MM/YYYY',
                          }}
                          onChange={(momentDate) =>
                            setFilterFormDate((prevState) => ({
                              ...prevState,
                              available_to: momentDate.format('DD/MM/YYYY'),
                            }))
                          }
                          timeFormat={false}
                        />

                      </FormGroup>
                    </Col>
                <Col sm="6">
                      <Label>Status</Label>
                      <FormGroup>
                        <div className="custom-select-container">
                      <Select
            className="react-select primary"
            classNamePrefix="react-select"
            name="statuscode"
            menuPlacement="top" // This makes the menu open above the input
            onChange={(selectedOption) =>
              setFilterFormDate((prevState) => ({
                ...prevState,
                statuscode: selectedOption.value,
              }))
            }
            options={statusOptions}
            placeholder="Select an option"
            styles={{
              control: (provided) => ({
                ...provided,
                minHeight: '40px', // Customize control height
              }),
              menu: (provided) => ({
                ...provided,
                zIndex: 9999, // Ensure the menu is on top of other elements
              }),
              valueContainer: (provided) => ({
                ...provided,
                padding: '0 8px', // Adjust padding
              }),
            }}
          />
                                </div>

                      </FormGroup>
                    </Col>
                    
                  </Row>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      padding: '1rem 2rem',
                      borderTop: '1px solid #ddd',
                    }}
                  >
                    <Button
                      className="buttonClose"
                      color="primary"
                      onClick={closeModal}
                      style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}
                    >
                      Close
                    </Button>
                    <Button
                      className="buttonClose"
                      color="primary"
                      onClick={handleClearClick}
                      type="clear"
                      style={{ marginRight: '0.5rem', padding: '0.5rem 1rem' }}
                    >
                      Clear
                    </Button>
                    <Button
                      className="buttonClose"
                      color="primary"
                      type="submit"
                      style={{ padding: '0.5rem 1rem' }}
                    >
                      Filter
                    </Button>
                  </div>
              </CardBody>

            </Card>
          </Col>

        </Row>
        </Form>

      </div>
</div>
  </Modal>

      <div className="content">
        <Row>
          {alert}
          <Col md="12">
            <Card>
              <CardBody>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <div onClick={openModal} style={{ marginRight: "10px"  ,cursor: 'pointer'}}>
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
