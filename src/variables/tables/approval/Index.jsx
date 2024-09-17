import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
const useColumns = (handleDelete) => {
  return useMemo(
    () => [
      {
        Header: "Requested Date",
        isSortable: true,
        defaultSort: true, // Indicates this column should be the default sort
        defaultSortDesc: true, // Indicates the sort direction (descending)
        accessor: "request_date_formatted",
        width: "2%",
      },
      {
        Header: "Requested Time",
        isSortable: true,
        accessor: "request_time",
        width: "2%",
      },

      {
        Header: "Eoi Id",
        isSortable: true,
        accessor: "eoi_id",
        width: "2%",
      },
      {
        Header: "Asset Name",
        isSortable: true,
        accessor: "asset_name",
        width: "16%",
      },
      {
        Header: "Buyer Title",
        accessor: "buyer_title",
        width: "16%",
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: "1%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Link
              to={`/admin/approval/request/show/${row.original.eoi_id}/${row.original.asset_id}/${row.original.request_id}`}
            >
              <Button className="btn-icon btn-simple" color="info" size="sm">
                <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
              </Button>
            </Link>
            {row.original.request_status !== "Pending" ? (
              <Button
                className="btn-icon btn-simple"
                color="danger"
                size="sm"
                onClick={() => handleDelete(row.original.request_id)}
              >
                <i className="fa fa-trash" style={{ fontSize: "0.9em" }}></i>
              </Button>
            ) : (
              ""
            )}
          </div>
        ),
      },
    ],
    []
  );
};

export default useColumns;
