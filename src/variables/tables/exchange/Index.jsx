import React, { useMemo } from "react";
import { Button } from "reactstrap";
import SvgFilePlus from "components/svg/FilePlus";
import { Link } from "react-router-dom";
const useColumns = () => {
  return useMemo(
    () => [
      {
        Header: "ID",
        isSortable: true,
        defaultSort: true, // Indicates this column should be the default sort
        defaultSortDesc: true, // Indicates the sort direction (descending)
        accessor: "asset_id",
        width: "2%",
      },
      {
        Header: "Category",
        isSortable: true,
        accessor: "categorycode1",
        width: "8%",
      },
      {
        Header: "Sub Category",
        isSortable: true,
        accessor: "categorycode2",
        width: "8%",
      },

      {
        Header: "Name",
        isSortable: true,
        accessor: "asset_name",
        width: "10%",
      },
      {
        Header: "Description",
        accessor: "description",
        width: "16%",
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
        Header: "Actions",
        accessor: "actions",
        sortable: false,
        width: "1%",
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Link to={`/admin/exchange/show/${row.original.asset_id}`}>
              <Button className="btn-icon btn-simple" color="info" size="sm">
                <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
              </Button>
            </Link>
            <Link
              to={`/admin/exchange/eoi-submission/${row.original.asset_id}`}
            >
              <Button className="btn-icon btn-simple" color="success" size="sm">
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
