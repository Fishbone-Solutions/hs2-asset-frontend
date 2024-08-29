import { Button } from "reactstrap"; // Assuming you're using Reactstrap
import { IoListSharp } from "react-icons/io5"; // Assuming you're using react-icons
import LiveSvgComponent from "components/svg/LiveSvg"; // Assuming this is the correct import
import { Link } from "react-router-dom";
import { useMemo } from "react";
const columns = useMemo(
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
        accessor: "asset_id",
        width: "2%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span> Submission Date</span>
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
            <span>Item</span>
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
            <span>Seller</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "seller_title",
        width: "4%",
      },
      {
        Header: ({ column }) => (
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>Status</span>
            <span>
              {column.isSorted ? (column.isSortedDesc ? "▼" : "▲") : ""}
            </span>
          </div>
        ),
        accessor: "eoi_status",
        width: "0.4%",
        Cell: ({ row }) => {
          const statusCode = row.original.eoi_status;
          const statusStyles = {
            "SOLD": { backgroundColor: "#dc3545", color: "white" },
            "LIVE": {
              backgroundColor: "#28a745",
              color: "white",
              icon: liveIconImage,
            },
            "LISTING": { backgroundColor: "#17a2b8", color: "white" },
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
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: "1%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Button
              className="btn-icon btn-simple"
              color="info"
              size="sm"
              onClick={() => handleView(row.original.asset_id, "exchange")}
            >
              <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
            </Button>
            <Button
              className="btn-icon btn-simple"
              color="success"
              size="sm"
              onClick={() => handleSubmissionEoi(row.original.asset_id, "exchange_edit", row.original.id )}
            >
              <SvgFilePlus />
            </Button>
          </div>
        ),
      },
    ],
    [],
  );

export default columns;
