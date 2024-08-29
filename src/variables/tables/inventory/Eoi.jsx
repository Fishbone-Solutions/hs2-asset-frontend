import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";

const useColumns = (handleDelete) => {
  return useMemo(
    () => [
      {
        Header: "EoI. No",
        isSortable: true,
        accessor: "id",
        width: "0.9%",
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
        Header: "Submission Date",
        isSortable: true,
        accessor: "submission_date_formatted",
        width: "1.5%",
      },
      {
        Header: "Status",
        accessor: "eoi_status",
        width: "0.5%",
        Cell: ({ row }) => {
          const statusCode = row.original.eoi_status;
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
              bgColor: "bg-success",
              textColor: "text-white",
            },
            "PAYMENT-SENT": { bgColor: "bg-dark", textColor: "text-white" },
            "PAYMENT-RECEIVED": {
              bgColor: "bg-danger",
              textColor: "text-white",
            },
            "GOODS-SENT": { bgColor: "bg-warning", textColor: "text-white" },
            "GOODS-RECEIVED": {
              bgColor: "bg-warning",
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
        width: "0.7%",
        Cell: ({ row }) => (
          <div className="action-buttons">
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
            <Link to={"#"}>
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
            </Link>
          </div>
        ),
      },
    ],
    [handleDelete] // Dependency array for useMemo
  );
};

export default useColumns;
