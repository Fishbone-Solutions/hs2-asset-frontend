import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { IoListSharp } from "react-icons/io5";
import LiveSvgComponent from "components/svg/LiveSvg";
import { Link } from "react-router-dom";
import AlertIcon from "components/svg/AlertIcon";

const useColumns = (handleDelete) => {
  return useMemo(
    () => [
      {
        Header: "ID",
        accessor: "asset_id",
        width: "2%",
        defaultSort: true, // Indicates this column should be the default sort
        defaultSortDesc: true, // Indicates the sort direction (descending)
        isSortable: true,
      },
      {
        Header: "Entry",
        accessor: "entrydate_formatted",
        width: "2%",
        isSortable: true,
      },
      {
        Header: "Category",
        accessor: "categorycode1",
        width: "8%",
        isSortable: true,
      },
      {
        Header: "Sub Category",
        accessor: "categorycode2",
        width: "8%",
        isSortable: true,
      },
      {
        Header: "Name",
        accessor: "asset_name",
        width: "10%",
        isSortable: true,
      },
      {
        Header: "Description",
        accessor: "description",
        width: "16%",
        isSortable: false,
      },
      {
        Header: "Availability",
        accessor: "available_from",
        width: "1%",
        isSortable: false,
      },
      {
        Header: "Status",
        accessor: "statuscode",
        width: "1%",
        isSortable: true,
        Cell: ({ row }) => {
          const status = row.original.statuscode;
          const badgeClass = {
            Sold: "badge-success",
            Live: "badge-danger liveIcon",
            Listing: "badge-info",
          }[status];

          return (
            <span className={`badge ${badgeClass}`}>
              {status === "Live" ? (
                <>
                  <span className="mt-1">{status} </span>
                  <LiveSvgComponent />
                </>
              ) : (
                status
              )}
            </span>
          );
        },
      },
      {
        Header: "EOI",
        accessor: "total_eoi",
        width: "2%",
        isSortable: false,
        Cell: ({ row }) => {
          return (
            <div className="position-relative">
              <span className="badge badge-warning badge-blue-dark font-weight-bold text-black fs-6">
                {row.original.total_eoi}
              </span>

              {row.original.un_attended_items === true ? (
                <span
                  className="d-inline-flex align-items-center cursor-pointer p-1"
                  style={{
                    display: "inline-flex",
                    padding: "4px",
                    alignItems: "center",
                  }}
                >
                  <AlertIcon
                    className="notify-icon"
                    width="20"
                    height="20"
                    title="Some unattended EOIs"
                  />
                </span>
              ) : (
                ""
              )}
            </div>
          );
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        width: "1%",
        isSortable: false,
        Cell: ({ row }) => (
          <div className="action-buttons">
            <Link to={`/admin/inventory/show/${row.original.asset_id}`}>
              <Button
                type="button"
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

            <Link to={`/admin/inventory/edit/${row.original.asset_id}`}>
              <Button
                type="button"
                className="btn-icon btn-simple"
                color="success"
                size="sm"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Edit Detail"
              >
                <i className="fa fa-edit" style={{ fontSize: "0.9em" }}></i>
              </Button>
            </Link>
            <Link to={`/admin/inventory/eois/${row.original.asset_id}`}>
              <Button
                type="button"
                className="btn-icon btn-simple"
                color="secondary"
                size="sm"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="View EOI"
              >
                <IoListSharp />
              </Button>
            </Link>
            <Button
              type="button"
              className="btn-icon btn-simple"
              color="danger"
              size="sm"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Delete Inventory"
              onClick={() => handleDelete(row.original.asset_id)}
            >
              <i className="fa fa-times" style={{ fontSize: "0.9em" }}></i>
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete] // Dependencies
  );
};

export default useColumns;
