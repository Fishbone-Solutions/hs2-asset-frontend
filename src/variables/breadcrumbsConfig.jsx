// breadcrumbConfig.js

import BulkImport from "views/pages/BulkImport";

const breadcrumbConfig = {
  profile: [{ label: "My Profile", to: "#" }],
  inventory: [{ label: "Inventory", to: "#" }],
  itemRequest: [{ label: "Item Request", to: "#" }],
  inventoryCreate: [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "Create", to: "#" },
  ],
  inventoryShow: [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "View Details", to: "#" },
  ],
  inventoryEdit: [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "Edit Details", to: "#" },
  ],
  inventoryEoi: [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "EOI List", to: "#" },
  ],
  inventoryEoiDetails: (inventoryId) => [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "EOI List", to: `/admin/inventory/eois/${inventoryId}` },
    { label: "View EOI Details", to: "#" },
  ],
  inventoryEoiEdit: (inventoryId) => [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "EOI List", to: `/admin/inventory/eois/${inventoryId}` },
    { label: "Edit EOI Details", to: "#" },
  ],
  exchange: [{ label: "Exchange", to: "#" }],
  exchangeRequestEquipment: [
    { label: "Exchange", to: "/admin/exchange" },
    { label: "Broadcast Item Request", to: "#" },
  ],
  exchangeShow: [
    { label: "Exchange", to: "/admin/exchange" },
    { label: "View Details", to: "#" },
  ],
  exchangeEoiSubmission: [
    { label: "Exchange", to: "/admin/exchange" },
    { label: "EOI Submission", to: "#" },
  ],
  approvalRequests: [{ label: "Approvals Requests", to: "#" }],
  showApprovalRequestsInventory: (eoiId, id, requestId) => [
    { label: "Approvals Requests", to: "/admin/approval-requests" },
    {
      label: "View Details",
      to: `/admin/approval/request/show/${eoiId}/${id}/${requestId}`,
    },
    { label: "Item Details" },
  ],
  showApprovalRequests: [
    { label: "Approvals Requests", to: "/admin/approval-requests" },
    { label: "View Details" },
  ],
  myEoi: [{ label: "My EOI", to: "#" }],
  myEoiShow: (inventoryId, eoiId) => [
    { label: "My EOI", to: "/admin/myeoi" },
    {
      label: "Edit Details",
      to: `/admin/myeoi/${inventoryId}/eois/edit/${eoiId}`,
    },
    { label: "View Item Details", to: "#" },
  ],
  myEoiEdit: [
    { label: "My EOI", to: "/admin/myeoi" },
    { label: "Edit Details", to: "#" },
  ],
  bulkImport: [{ label: "Bulk Import", to: "#" }],

  // Add more as needed
};

export default breadcrumbConfig;
