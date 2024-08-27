import { Button } from "reactstrap"; // Assuming you're using Reactstrap
import { IoListSharp } from "react-icons/io5"; // Assuming you're using react-icons
import LiveSvgComponent from "components/svg/LiveSvg"; // Assuming this is the correct import
import { Link } from "react-router-dom";

const columns = [
  {
    Header: "ID",
    accessor: "asset_id",
    width: "2%",
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
    width: "1%",
    isSortable: false,
  },
  {
    Header: "Actions",
    accessor: "actions",
    sortable: false,
    width: "1%",
    isSortable: false,
    Cell: ({ row }) => (
      <div className="action-buttons">
        <Link to={`/admin/inventory/show/${row.original.asset_id}`}>
          <Button className="btn-icon btn-simple" color="info" size="sm">
            <i className="fa fa-eye" style={{ fontSize: "0.9em" }}></i>
          </Button>
        </Link>

        <Link to={`/admin/inventory/show/${row.original.asset_id}`}>
          <Button
            className="btn-icon btn-simple"
            color="success"
            size="sm"
            onClick={() => handleEdit(row.original.asset_id, "edit")}
          >
            <i className="fa fa-edit" style={{ fontSize: "0.9em" }}></i>
          </Button>
        </Link>
        <Button
          className="btn-icon btn-simple"
          color="secondary"
          onMouseEnter={() => setIsHovered(true)} // Set hover state to true
          onMouseLeave={() => setIsHovered(false)} // Set hover state to false
          size="sm"
          onClick={() => handleEoI(row.original.asset_id)}
        >
          <IoListSharp />
        </Button>
        <Button
          className="btn-icon btn-simple"
          color="danger"
          size="sm"
          onClick={() => handleDelete(row.original.asset_id)}
        >
          <i className="fa fa-times" style={{ fontSize: "0.9em" }}></i>
        </Button>
      </div>
    ),
  },
];

export default columns;
