import React, { useMemo } from "react";
import { Button } from "reactstrap";
import SvgFilePlus from "components/svg/FilePlus";
import { Link } from "react-router-dom";
const useColumns = () => {
  return useMemo(
    () => [
      {
        Header: "Requested Date",
        isSortable: true,
        defaultSort: true, // Indicates this column should be the default sort
        defaultSortDesc: true, // Indicates the sort direction (descending)
        accessor: "request_date_formatted",
        width: "8%",
      },
      {
        Header: "Requested Time",
        isSortable: true,
        accessor: "request_time",
        width: "8%",
      },

      {
        Header: "Eoi Id",
        isSortable: true,
        accessor: "eoi_id",
        width: "10%",
      },
      {
        Header: "Asset Name",
        isSortable: true,
        accessor: "asset_name",
        width: "10%",
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
          </div>
        ),
      },
    ],
    []
  );
};

export default useColumns;
