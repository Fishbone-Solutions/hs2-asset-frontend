import React, { useState, useMemo } from "react";
import {
  useTable,
  useSortBy,
  usePagination,
  useResizeColumns,
} from "react-table";
import classnames from "classnames";
import { Button, Container, Col, Row } from "reactstrap";
import Select from "react-select";
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
            <div className="-previous">
              <button
                type="button"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="-btn"
              >
                Previous
              </button>
            </div>
            <div className="-center">
              <Container>
                <Row className="justify-content-center">
                  <Col md="4" sm="6" xs="12">
                    <Select
                      className="react-select primary pageSelect"
                      classNamePrefix="react-select"
                      name="pageSelect"
                      value={pageSelect}
                      onChange={(value) => {
                        gotoPage(value.value);
                        handlePageSelect(value);
                      }}
                      options={pageSelectData.map((prop, key) => {
                        return {
                          value: key,
                          label: "Page " + (key + 1),
                        };
                      })}
                      placeholder="Choose Page"
                    />
                  </Col>
                  <Col md="4" sm="6" xs="12">
                    <Select
                      className="react-select primary pageRow"
                      classNamePrefix="react-select"
                      name="numberOfRows"
                      value={numberOfRows}
                      onChange={(value) => {
                        setPageSize(value.value);
                        setNumberOfRows(value);
                      }}
                      options={rowsOptions}
                      placeholder="Choose Rows"
                    />
                  </Col>
                </Row>
              </Container>
            </div>

            <div className="-next">
              <button
                type="button"
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="-btn"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Table;
