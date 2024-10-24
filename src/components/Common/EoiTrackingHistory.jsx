import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { formatApprovalString } from "variables/common";
import AlertBellIcon from "components/svg/AlertBellIcon";

const getBadgeClass = (activity) => {
  switch (activity) {
    case "EOI-SUBMITTED":
      return "badge bg-primary-dark"; // Light Turquoise
    case "IN-NEGOTIATION":
      return "badge bg-info"; // Light Blue
    case "APPROVAL-REQUEST":
      return "badge bg-purple"; // Dark Purple
    case "PROCESSING":
      return "badge bg-processing";
    case "APPROVED":
      return "badge bg-lime"; // Light Green
    case "REJECTED":
      return "badge bg-danger"; // Light Green
    case "PAYMENT-REQUESTED":
      return "badge bg-warning-dark"; // Light Orange
    case "PAYMENT-SENT":
      return "badge bg-warning-dark"; // Darker Orange
    case "PAYMENT-RECEIVED":
      return "badge bg-warning-light"; // Yellow
    case "GOODS-SENT":
      return "badge bg-lime"; // Light Green
    case "GOODS-RECEIVED":
      return "badge bg-lime"; // Bright Lime Green
    case "AWAITING BUYER RESPONSE":
      return "badge badge-danger dark-awaiting";
    case "AWAITING SELLER RESPONSE":
      return "badge badge-danger dark-awaiting";
    case "AWAITING APPROVER RESPONSE":
      return "badge badge-danger dark-awaiting";
    default:
      return "badge bg-secondary"; // Default grey badge for unrecognized statuses
  }
};

const ActivityTable = ({ activities }) => {
  return (
    <div className="container-fluid p-0">
      {activities.length > 0 ? (
        <table className="table table-response table-bordered">
          <thead>
            <tr
              style={{
                backgroundColor: "#57524D",
                color: "white",
              }}
            >
              <th
                style={{ width: "100px" }}
                className="py-2 rt-th rt-resizable-header"
              >
                Date
              </th>
              <th
                style={{ width: "100px" }}
                className="py-2 rt-th rt-resizable-header"
              >
                Time
              </th>
              <th
                style={{ width: "300px" }}
                className="py-2 rt-th rt-resizable-header"
              >
                Activity
              </th>
              <th className="py-2 rt-th rt-resizable-header">Initiator</th>
            </tr>
          </thead>
          <tbody className="rt-tbody">
            {activities.map((activity, index) => (
              <tr key={index}>
                <td>{activity.activity_date}</td>
                <td>{activity.activity_time}</td>
                <td>
                  <span className={getBadgeClass(activity.activity)}>
                    <div
                      className={
                        activity.is_reverted
                          ? `strike-content flex text-start`
                          : `flex text-start`
                      }
                      dangerouslySetInnerHTML={{
                        __html: formatApprovalString(activity.activity),
                      }} // Render HTML
                    />
                  </span>
                  {activity.activity === "AWAITING BUYER RESPONSE" ||
                  activity.activity === "AWAITING SELLER RESPONSE" ||
                  activity.activity === "AWAITING APPROVER RESPONSE" ? (
                    <AlertBellIcon />
                  ) : (
                    ""
                  )}
                </td>
                <td>{activity.activity_by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info text-center" role="alert">
          No activities found.
        </div>
      )}
    </div>
  );
};

export default ActivityTable;
