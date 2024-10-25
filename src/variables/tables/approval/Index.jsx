import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { FaStamp } from "react-icons/fa";

const useColumns = (data, handleDelete) => {
  return useMemo(() => {
    const baseColumns = [
      {
        Header: "Requested On",
        isSortable: true,
        defaultSort: true,
        defaultSortDesc: true,
        accessor: "request_date_formatted",
        width: "4%",
        Cell: ({ row }) => (
          <span>
            {row.original.request_date_formatted} {row.original.request_time}
          </span>
        ),
      },
      {
        Header: "EOI Id",
        isSortable: true,
        accessor: "eoi_id",
        width: "2%",
      },
      {
        Header: "Item Name",
        isSortable: true,
        accessor: "asset_name",
        width: "16%",
      },
      {
        Header: "Buyer",
        accessor: "buyer_title",
        width: "10%",
      },
      {
        Header: "Seller",
        accessor: "seller_title",
        width: "10%",
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: "1%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Link
              to={`/admin/approval/request/show/${row.original.eoi_id}/${row.original.asset_id}/${row.original.request_id}?status=${row.original.request_status}`}
            >
              <Button
                className="btn-icon btn-simple"
                color="info"
                size="sm"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title={
                  row.original.request_status === "Pending"
                    ? "Process Request"
                    : "View Request"
                }
              >
                {row.original.request_status === "Pending" ? (
                  <FaStamp size="1.4em" />
                ) : (
                  <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
                )}
              </Button>
            </Link>
            {row.original.request_status !== "Pending" ? (
              <Button
                className="btn-icon btn-simple"
                color="danger"
                size="sm"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Delete Request"
                onClick={() => handleDelete(row.original.request_id)}
              >
                <i className="fa fa-times" style={{ fontSize: "0.9em" }}></i>
              </Button>
            ) : null}
          </div>
        ),
      },
    ];

    // Check if any rows have status "Approved" or "Rejected"
    const hasSpecialStatus = data.some(
      (row) => row.request_status === "Processed"
    );

    // Conditionally add the extra column if any row has the desired status
    if (hasSpecialStatus) {
      baseColumns.splice(5, 0, {
        Header: "Status",
        isSortable: true,
        accessor: "approval_status",
        width: "1%",
        Cell: ({ row }) => {
          const statusCode = row.original.approval_status;
          const statusStyles = {
            REJECTED: { bgColor: "bg-danger", textColor: "text-white" }, // Red for sold items
            APPROVED: {
              bgColor: "bg-success", // Green for live items
              textColor: "text-white",
            },
            PENDING: { bgColor: "bg-info", textColor: "text-white" }, // Blue for listings
          };
          const style = statusStyles[statusCode] || {
            bgColor: "bg-secondary",
            textColor: "text-white",
          };

          return (
            <span
              className={`badge ${style.bgColor} ${style.textColor} px-2 py-1 fw-bold`}
            >
              {style.icon && (
                <>
                  <img
                    src={style.icon}
                    width="15px"
                    alt="status icon"
                    className="me-1 align-middle"
                  />
                </>
              )}
              {statusCode === "PENDING" ? "Not-Requested" : statusCode}
            </span>
          );
        },
      });

      baseColumns.splice(6, 0, {
        Header: "Processed On", // New column header
        accessor: "extra",
        width: "5%",
        Cell: ({ row }) => {
          return (
            <span>
              {row.original.processing_date_formatted}{" "}
              {row.original.processing_time_formatted}
            </span>
          );
        },
      });
    }

    return baseColumns;
  }, [data, handleDelete]); // Add dependencies
};

export default useColumns;
