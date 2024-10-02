import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

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
      return "badge bg-purple"; // Light Green
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
              <th className="py-2 rt-th rt-resizable-header">Date</th>
              <th className="py-2 rt-th rt-resizable-header">Time</th>
              <th className="py-2 rt-th rt-resizable-header">Activity</th>
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
                    {formatApprovalString(activity.activity)}
                  </span>
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
