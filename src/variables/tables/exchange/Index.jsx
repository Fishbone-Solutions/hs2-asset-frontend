import React, { useMemo } from "react";
import { Button } from "reactstrap";
import SvgFilePlus from "components/svg/FilePlus";
import { Link } from "react-router-dom";
import { formatLocation } from "variables/common";
const useColumns = () => {
  return useMemo(
    () => [
      // {
      //   Header: "Category",
      //   isSortable: true,
      //   accessor: "categorycode1",
      //   width: "8%",
      // },
      // {
      //   Header: "Sub Category",
      //   isSortable: true,
      //   accessor: "categorycode2",
      //   width: "8%",
      // },

      {
        Header: "Name",
        isSortable: true,
        defaultSort: true, // Indicates this column should be the default sort
        defaultSortDesc: false, // Indicates the sort direction (descending)
        accessor: "asset_name",
        width: "10%",
      },
      {
        Header: "Description",
        accessor: "description",
        width: "18%",
      },
      {
        Header: "Condition",
        accessor: "asset_condition",
        isSortable: true,
        width: "4%",
      },
      {
        Header: "Seller",
        isSortable: true,
        accessor: "seller_title",
        width: "8%",
      },
      {
        Header: "Availability",
        isSortable: true,
        accessor: "available_from",
        width: "1%",
      },
      {
        Header: "Location",
        isSortable: true,
        accessor: "asset_location",
        width: "6%",
        Cell: ({ row }) => (
          <span
            className="d-inline-block text-truncate"
            style={{ maxWidth: "130px", cursor: "pointer" }}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={formatLocation(row.original.asset_location)}
          >
            {formatLocation(row.original.asset_location)}
          </span>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: "1%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Link to={`/admin/exchange/show/${row.original.asset_id}`}>
              <Button
                className="btn-icon btn-simple"
                color="info"
                size="sm"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="View Detail"
              >
                <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
              </Button>
            </Link>
            <Link
              to={`/admin/exchange/eoi-submission/${row.original.asset_id}`}
            >
              <Button
                className="btn-icon btn-simple"
                color="success"
                size="sm"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Submit EOI"
              >
                <SvgFilePlus />
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
