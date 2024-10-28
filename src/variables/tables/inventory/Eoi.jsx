import React, { useMemo } from "react";
import { Button } from "reactstrap";
import { Link } from "react-router-dom";
import { RxCrossCircled } from "react-icons/rx";
import AlertIcon from "components/svg/AlertIcon";
import { getBadgeClass } from "variables/common";

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
        width: "8%",
      },
      {
        Header: "Organization",
        isSortable: true,
        accessor: "organization",
        width: "5%",
      },
      {
        Header: "Approval",
        isSortable: true,
        accessor: "approval_status",
        width: "1%",
        Cell: ({ row }) => {
          const statusCode = row.original.approval_status;
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
                {statusCode === "PENDING" ? "Not-Requested" : statusCode}
              </span>
              {row.original.new_approver_status === true ? (
                <span
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="New Update From Approver"
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
        Header: "Buyer Status",
        accessor: "buyer_eoi_status",
        width: "2%",
        Cell: ({ row }) => {
          const statusCode = row.original.buyer_eoi_status;
          const style = getBadgeClass(statusCode);
          return (
            <span className="d-flex ">
              <span
                className={`badge position-relative ${style} px-2 py-1 fw-bold`}
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
              {row.original.new_buyer_status === true ? (
                <span
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="New Update From Buyer"
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
        Header: "Seller Status",
        accessor: "seller_eoi_status",
        width: "2%",
        Cell: ({ row }) => {
          const statusCode = row.original.seller_eoi_status;
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
              <Link
                to={`/admin/inventory/${row.original.asset_id}/eois/show/${row.original.id}`}
              >
                <Button
                  className="btn-icon btn-simple text-info"
                  color="info"
                  size="sm"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="View EOI"
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
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Edit EOI"
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
              data-bs-toggle="tooltip"
              data-bs-placement="top"
              title="Delete EOI"
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
