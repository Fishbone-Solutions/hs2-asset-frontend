import React from "react";
import { useState, useContext } from "react";
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
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  NavLink,
  Modal,
  Container,
} from "reactstrap";
import ReactTable from "components/ReactTable/ReactTable.js";
import { GlobalContext } from "GlobalState";
import { useParams, useNavigate } from "react-router-dom";
import BACKEND_ADDRESS from "views/components/serverAddress";
import DateRangePicker from "views/components/DateRangePicker";
import defaultLiveIconImage from "assets/img/live.png";

import SvgFilePlus from "../../components/svg/FilePlus";

import FloatingLabelDropdown from "../components/FloatingLabelDropdown";
import { IoSearchSharp, IoMegaphoneOutline } from "react-icons/io5";
import SvgSearchPlus from "../../components/svg/SearchPlus";

function W10() {
  const [formData, setFormData] = useState([]);
  const [filterFormData, setFilterFormDate] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [alert, setAlert] = React.useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const { username } = useContext(GlobalContext);
  const [open, setOpen] = useState();
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const [liveIconImage, setliveIconImage] =
    React.useState(defaultLiveIconImage);

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
        const response = await fetch(
          `${BACKEND_ADDRESS}/users/${username}/eoi`,
          requestOptions,
        );
        const result = await response.json();
        setFormData(result.appRespData);
        console.log(result);
      } catch (error) {
        setErrorMessage(
          "Unable to load data. Please refresh the page or load after time",
        );
        console.error(error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to ensure this effect runs only once when the component mounts

  const handleView = (asset_id, mode) => {
    navigate(`/admin/assetregister/${asset_id}?mode=${mode}`);
  };

  const handleSubmissionEoi = (assetId, mode) => {
    navigate(`/admin/exchange/eoisubmission/${assetId}?mode=${mode}`);
  };

  const handleDate = (startDate, endDate) => {
    set;
  };

  const handleNameSearch = (e) => {
    if (e.key === "Enter") {
      setFilterFormDate({ asset_name: e.target.value });
    }
  };

  const handleInputChange = (e) => {
    // Update the state with the new input value
    setFilterFormDate({ ...filterFormData, asset_name: e.target.value });
  };

  const handleAdvancedFilter = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    setFilterFormDate((prevState) => ({
      ...prevState,
      id: formData.get("id"),
      asset_name: formData.get("name"),
      available_from: rangeDates.startDate,
      available_to: rangeDates.endDate,
    }));
  };
  const handleCategoryChange = (category) => {
    console.log(category);
  };

  const handleSubCategoryChange = (subCategory) => {
    console.log(subCategory);
  };

  const handleClearClick = () => {
    setFilterFormDate((prevState) => ({
      ...prevState,
      id: "",
      asset_name: "",
      available_from: "",
      available_to: "",
    }));
  };

  const statusOptions = [
    { value: "New", label: "New" },
    { value: "Used-Working", label: "Used - Working" },
    { value: "Used-Not-Working", label: "Used - Not Working" },
    { value: "Refurbished", label: "Refurbished" },
    { value: "Expired", label: "Expired" },
  ];
  const optionsCategory1 = [
    { value: "construction-office", label: "Construction Office" },
    {
      value: "storage-logistics-facilities",
      label: "Storage/Logistics Facilities",
    },
    { value: "processing-facilities", label: "Processing Facilities" },
    { value: "fixed-services", label: "Fixed Services" },
    { value: "temporary-services", label: "Temporary Services" },
    { value: "security", label: "Security" },
    {
      value: "compound-security-safety-infrastructure",
      label: "Compound Security/Safety Infrastructure",
    },
    {
      value: "site-roads-and-infrastructure",
      label: "Site Roads and Infrastructure",
    },
    { value: "temporary-siding", label: "Temporary Siding" },
    { value: "consolidation-yards", label: "Consolidation Yards" },
    { value: "concrete-production", label: "Concrete Production" },
    { value: "diversions", label: "Diversions" },
    { value: "earthworks", label: "Earthworks" },
    { value: "static-plant", label: "Static Plant" },
    { value: "piling", label: "Piling" },
    { value: "pipework", label: "Pipework" },
    {
      value: "public-highway-traffic-management",
      label: "Public Highway Traffic Management",
    },
    { value: "other-assets", label: "Other Assets" },
  ];

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);
  // EoI.No, Submission Date, Item, Seller, Status
  const columns = React.useMemo(
    () => [
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>EoI. No</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "id",
        width: "2%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Item ID</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "",
        width: "2%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span> SUBMISSION DATE</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "submission_date_formatted",
        width: "2%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>ITEM</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "asset_name",
        width: "8%",
      },

      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>SELLER</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "seller_title",
        width: "10%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>STATUS</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "eoi_status",
        width: "16%",
        Cell: ({ row }) => {
          const statusCode = row.original.eoi_status;
          const statusStyles = {
            SOLD: { backgroundColor: "#dc3545", color: "white" },
            LIVE: {
              backgroundColor: "#28a745",
              color: "white",
              icon: liveIconImage,
            },
            LISTING: { backgroundColor: "#17a2b8", color: "white" },
            "EOI-SUBMITTED": { backgroundColor: "#02A8F3", color: "white" },
            "IN-NEGOTIATION": { backgroundColor: "#22B04C", color: "white" },
            "PAYMENT-SENT": { backgroundColor: "#8a0000", color: "white" },
            "PAYMENT-RECEIVED": { backgroundColor: "#ff2a00", color: "white" },
            "GOODS-SENT": { backgroundColor: "#ffba4d", color: "white" },
            "GOODS-RECEIVED": { backgroundColor: "#c66e00", color: "white" },
            "UNAVAILABLE-SOLD": { backgroundColor: "#FB301B", color: "white" },
          };

          const style = statusStyles[statusCode] || {
            backgroundColor: "grey",
            color: "white",
          };

          return (
            <span
              style={{
                ...style,
                padding: "4px 8px", // Updated padding here
                fontSize: "90%",
                fontWeight: 700,
                lineHeight: 1,
                textAlign: "center",
                whiteSpace: "nowrap",
                verticalAlign: "baseline",
                borderRadius: "10rem",
                display: "inline-block",
              }}
            >
              {style.icon && (
                <>
                  <img
                    src={style.icon}
                    width="15px"
                    alt="..."
                    style={{ marginRight: "3px", verticalAlign: "middle" }}
                  />
                </>
              )}
              {statusCode}
            </span>
          );
        },
      },
      {
        Header: "ACTIONS",
        accessor: "actions",
        sortable: false,
        width: "1%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              className="btn-icon btn-simple"
              color="info"
              size="sm"
              onClick={() => handleView(row.original.asset_id, "view")}
            >
              <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="success"
              size="sm"
              onClick={() => handleSubmissionEoi(row.original.asset_id, "edit")}
            >
              <SvgFilePlus />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );
  return (
    <>
     <p>.</p>
    </>
  );
}

export default W10;
