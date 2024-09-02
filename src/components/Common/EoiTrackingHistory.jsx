import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const getBadgeClass = (activity) => {
  switch (activity) {
    case "EOI-SUBMITTED":
      return "badge bg-primary"; // Blue
    case "IN-NEGOTIATION":
      return "badge bg-info"; // Shade of Blue
    case "PAYMENT-SENT":
      return "badge bg-warning"; // Orange
    case "PAYMENT-RECEIVED":
      return "badge bg-warning"; // Shade of Orange
    case "GOODS-SENT":
      return "badge bg-success"; // Shade of Green
    case "GOOD-RECEIVED":
      return "badge bg-success"; // Shade of Green
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
                    {activity.activity}
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
