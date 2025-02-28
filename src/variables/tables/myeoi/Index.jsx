import React, { useMemo } from "react";
import { Button } from "reactstrap";
import SvgFilePlus from "components/svg/FilePlus";
import { Link } from "react-router-dom";
import AlertIcon from "components/svg/AlertIcon";
import { getBadgeClass } from "variables/common";
import { formatStringWithDash } from "variables/common";
const useColumns = (handleDelete) => {
  return useMemo(
    () => [
      {
        Header: "Submitted On",
        isSortable: true,
        accessor: "submission_date_formatted",
        width: "1%",
      },

      {
        Header: "EOI No.",
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
        width: "6%",
      },
      {
        Header: "Seller",
        accessor: "seller_title",
        width: "4%",
      },
      {
        Header: "Buyer Status",
        isSortable: false,
        accessor: "buyer_eoi_status",
        width: "2%",
        Cell: ({ row }) => {
          const statusCode = row.original.buyer_eoi_status;
          const style = getBadgeClass(statusCode);

          return (
            <span className={`badge ${style} px-2 py-1 fw-bold`}>
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
              {formatStringWithDash(statusCode)}
            </span>
          );
        },
      },
      {
        Header: "Seller Status",
        isSortable: false,
        accessor: "seller_eoi_status",
        width: "2%",
        Cell: ({ row }) => {
          const statusCode = row.original.seller_eoi_status;
          const style = getBadgeClass(statusCode);

          return (
            <span className="d-flex ">
              <span className={`badge ${style} px-2 py-1 fw-bold`}>
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

                {formatStringWithDash(statusCode)}
              </span>
              {row.original.new_seller_status === true ? (
                <span
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="New Update From Seller"
                >
                  <AlertIcon
                    width="22"
                    height="22"
                    className="cursor-pointer"
                  />
                </span>
              ) : (
                ""
              )}
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
              <Button
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Manage EOI"
                className="btn-icon btn-simple"
                color="success"
                size="sm"
              >
                <i className="fa fa-edit" style={{ fontSize: "0.9em" }}></i>
              </Button>
            </Link>
            <Button
              type="button"
              className="btn-icon btn-simple"
              color="danger"
              size="sm"
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Delete EOI"
              onClick={() =>
                handleDelete(row.original.asset_id, row.original.id)
              }
            >
              <i className="fa fa-times" style={{ fontSize: "0.9em" }}></i>
            </Button>
          </div>
        ),
      },
    ],
    [handleDelete]
  );
};

export default useColumns;
