import React, { useState, useMemo } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useResizeColumns,
} from "react-table";
import classnames from "classnames";
import { Button } from "reactstrap";
import "./ReactTableMod.scss";

function Table({ columns, data }) {
  const [numberOfRows, setNumberOfRows] = React.useState({
    value: 10,
    label: "10 rows",
  });
  const [pageSelect, handlePageSelect] = React.useState({
    value: 0,
    label: "Page 1",
  });

  const defaultColumn = useMemo(
    () => ({
      width: 100,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    pageOptions,
    pageCount,
    gotoPage,
    state: { pageIndex, pageSize },
    prepareRow,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
    },
    useSortBy,
    usePagination,
    useResizeColumns
  );

  const rowsOptions = useMemo(
    () =>
      [5, 10, 20, 25, 50, 100].map((num) => ({
        value: num,
        label: `${num} rows`,
      })),
    []
  );

  let pageSelectData = Array.apply(null, Array(pageOptions.length)).map(
    function () {}
  );

  return (
    <>
      <br />
      <div className="-striped -highlight primary-pagination">
        <table className="table-responsive" {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, key) => (
                  <th
                    {...column.getHeaderProps(
                      column.isSortable ? column.getSortByToggleProps() : {}
                    )}
                    style={{
                      width: column.width,
                      backgroundColor: "#57524D",
                      color: "white",
                    }}
                    className={classnames("rt-th rt-resizable-header", {
                      "-cursor-pointer": column.isSortable,
                      "-sort-asc": column.isSorted && !column.isSortedDesc,
                      "-sort-desc": column.isSorted && column.isSortedDesc,
                    })}
                  >
                    <div className="rt-resizable-header-content d-flex align-items-center">
                      {column.render("Header")}
                      {column.isSortable && (
                        <span className="ml-2">
                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <i
                                className="fa fa-sort-down"
                                aria-hidden="true"
                              ></i>
                            ) : (
                              <i
                                className="fa fa-sort-up"
                                aria-hidden="true"
                              ></i>
                            )
                          ) : (
                            <i className="fa fa-sort" aria-hidden="true"></i>
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="rt-tbody">
            {page.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="no-data">
                  No data found
                </td>
              </tr>
            ) : (
              page.map((row, i) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={classnames("rt-tr", {
                      "-odd": i % 2 === 0,
                      "-even": i % 2 === 1,
                    })}
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        style={{ width: cell.column.width }}
                        className="rt-td"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        <div className="pagination-top mt-2">
          <div className="-pagination d-flex align-items-center justify-content-between">
            <Button
              type="button"
              onClick={previousPage}
              disabled={!canPreviousPage}
              className="-btn"
            >
              Previous
            </Button>

            {/* Page Selector */}
            <div className="d-flex align-items-center">
              <span className="mr-2 ml-2">Page</span>
              <select
                value={pageIndex}
                onChange={(e) => gotoPage(Number(e.target.value))}
                className="form-control mx-2"
                style={{ width: "auto", display: "inline-block" }}
              >
                {pageOptions.map((option, i) => (
                  <option key={option} value={i}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <span className="ml-2">of {pageOptions.length}</span>
            </div>

            {/* Rows per page selector */}
            <div className="ml-3 mr-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setNumberOfRows({
                    value: Number(e.target.value),
                    label: `${Number(e.target.value)} rows`,
                  });
                }}
                className="form-control"
                style={{ width: "auto", display: "inline-block" }}
              >
                {rowsOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              type="button"
              onClick={nextPage}
              disabled={!canNextPage}
              className="-btn"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;
