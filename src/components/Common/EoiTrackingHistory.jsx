import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { formatApprovalString } from "variables/common";
import AlertBellIcon from "components/svg/AlertBellIcon";
import { formatApprovalStringStatus } from "variables/common";
import { getBadgeClass } from "variables/common";

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
                  <span
                    className={getBadgeClass(
                      formatApprovalStringStatus(activity.activity)
                    )}
                  >
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
