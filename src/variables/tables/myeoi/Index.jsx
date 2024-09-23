import React, { useMemo } from "react";
import { Button } from "reactstrap";
import SvgFilePlus from "components/svg/FilePlus";
import { Link } from "react-router-dom";
const useColumns = () => {
  return useMemo(
    () => [
      {
        Header: "Submitted On",
        isSortable: true,
        accessor: "submission_date_formatted",
        width: "1%",
      },

      {
        Header: "EoI. No",
        isSortable: true,
        defaultSort: true, // Indicates this column should be the default sort
        defaultSortDesc: true, // Indicates the sort direction (descending)
        accessor: "id",
        width: "1%",
      },
      {
        Header: "Item ID",
        isSortable: true,
        accessor: "asset_id",
        width: "1%",
      },

      {
        Header: "Item Name",
        isSortable: true,
        accessor: "asset_name",
        width: "8%",
      },
      {
        Header: "Seller",
        accessor: "seller_title",
        width: "4%",
      },
      {
        Header: "Status",
        isSortable: true,
        accessor: "eoi_status",
        width: "0.3%",
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
        width: "0.02%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Link
              to={`/admin/myeoi/${row.original.asset_id}/eois/edit/${row.original.id}`}
            >
              <Button className="btn-icon btn-simple" color="success" size="sm">
                <i className="fa fa-edit" style={{ fontSize: "0.9em" }}></i>
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    []
  );
};

export default useColumns;
