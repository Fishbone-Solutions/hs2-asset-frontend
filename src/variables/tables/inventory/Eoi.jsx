import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";
import AlertIcon from "components/svg/AlertIcon";

const useColumns = (handleDelete) => {
  return useMemo(
    () => [
      {
        Header: "Submission Date",
        isSortable: true,
        accessor: "submission_date_formatted",
        width: "2.3%",
      },
      {
        Header: "EoI. No",
        isSortable: true,
        defaultSort: true, // Indicates this column should be the default sort
        defaultSortDesc: true, // Indicates the sort direction (descending)
        accessor: "id",
        width: "1.4%",
      },
      {
        Header: "Contact Person",
        isSortable: true,
        accessor: "buyer_name",
        width: "10%",
      },
      {
        Header: "Organization",
        isSortable: true,
        accessor: "organization",
        width: "6%",
      },
      {
        Header: "Approval",
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
      },

      {
        Header: "Buyer Status",
        accessor: "buyer_eoi_status",
        width: "1%",
        Cell: ({ row }) => {
          const statusCode = row.original.buyer_eoi_status;
          const statusStyles = {
            SOLD: { bgColor: "bg-danger", textColor: "text-white" },
            LIVE: {
              bgColor: "bg-success",
              textColor: "text-white",
              icon: "path/to/live-icon.png",
            },
            LISTING: { bgColor: "bg-info", textColor: "text-white" },
            "EOI-SUBMITTED": { bgColor: "bg-primary", textColor: "text-white" },
            "IN-NEGOTIATION": {
              bgColor: "bg-info",
              textColor: "text-white",
            },
            "APPROVAL-REQUEST": {
              bgColor: "bg-purple",
              textColor: "text-white",
            },

            "PAYMENT-SENT": {
              bgColor: "bg-warning-dark",
              textColor: "text-white",
            },
            "PAYMENT-RECEIVED": {
              bgColor: "bg-warning-dark",
              textColor: "text-white",
            },
            "PAYMENT-REQUESTED": {
              bgColor: "bg-warning-dark",
              textColor: "text-white",
            },
            PROCESSING: {
              bgColor: "bg-processing",
              textColor: "text-white",
            },

            "GOODS-SENT": { bgColor: "bg-lime", textColor: "text-white" },
            "GOODS-RECEIVED": {
              bgColor: "bg-lime",
              textColor: "text-white",
            },
            "UNAVAILABLE-SOLD": {
              bgColor: "bg-danger",
              textColor: "text-white",
            },
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
              {statusCode}
            </span>
          );
        },
      },
      {
        Header: "Seller Status",
        accessor: "seller_eoi_status",
        width: "1%",
        Cell: ({ row }) => {
          const statusCode = row.original.seller_eoi_status;
          const statusStyles = {
            SOLD: { bgColor: "bg-danger", textColor: "text-white" },
            LIVE: {
              bgColor: "bg-success",
              textColor: "text-white",
              icon: "path/to/live-icon.png",
            },
            LISTING: { bgColor: "bg-info", textColor: "text-white" },
            "EOI-SUBMITTED": { bgColor: "bg-primary", textColor: "text-white" },
            "IN-NEGOTIATION": {
              bgColor: "bg-info",
              textColor: "text-white",
            },
            "APPROVAL-REQUEST": {
              bgColor: "bg-purple",
              textColor: "text-white",
            },

            "PAYMENT-SENT": {
              bgColor: "bg-warning-dark",
              textColor: "text-white",
            },
            "PAYMENT-RECEIVED": {
              bgColor: "bg-warning-dark",
              textColor: "text-white",
            },
            "PAYMENT-REQUESTED": {
              bgColor: "bg-warning-dark",
              textColor: "text-white",
            },
            PROCESSING: {
              bgColor: "bg-processing",
              textColor: "text-white",
            },

            "GOODS-SENT": { bgColor: "bg-lime", textColor: "text-white" },
            "GOODS-RECEIVED": {
              bgColor: "bg-lime",
              textColor: "text-white",
            },
            "UNAVAILABLE-SOLD": {
              bgColor: "bg-danger",
              textColor: "text-white",
            },
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
              {statusCode}
            </span>
          );
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: "0.3%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <div className="position-relative">
              <AlertIcon width="16" height="16" className="notify-icon" />
              <Link
                to={`/admin/inventory/${row.original.asset_id}/eois/show/${row.original.id}`}
              >
                <Button
                  className="btn-icon btn-simple text-info"
                  color="info"
                  size="sm"
                >
                  <i className="fa fa-eye fs-6"></i>
                </Button>
              </Link>
            </div>
            {row.original.eoi_status !== "WITHDRAWN" ? (
              <Link
                to={`/admin/inventory/${row.original.asset_id}/eois/edit/${row.original.id}`}
              >
                <Button
                  className="btn-icon btn-simple text-success"
                  color="success"
                  size="sm"
                >
                  <i className="fa fa-edit fs-6"></i>
                </Button>
              </Link>
            ) : (
              <div className="position-relative">
                <RxCrossCircled
                  size="1.4em"
                  color="white"
                  className="cross-icon"
                />
                <Button
                  className="btn-icon btn-simple text-success"
                  color="success"
                  size="sm"
                >
                  <i className="fa fa-edit fs-6"></i>
                </Button>
              </div>
            )}

            <Button
              className="btn-icon btn-simple text-danger"
              size="sm"
              color="danger"
              onClick={() =>
                handleDelete(row.original.asset_id, row.original.id)
              }
            >
              <i className="fa fa-times fs-6"></i>
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete] // Dependency array for useMemo
  );
};

export default useColumns;
