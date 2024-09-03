// breadcrumbConfig.js

const breadcrumbConfig = {
  inventory: [{ label: "Inventory", to: "#" }],
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
    { label: "EOI", to: `/admin/eois/inventory/${inventoryId}` },
    { label: "View Details", to: "#" },
  ],
  inventoryEoiEdit: (inventoryId) => [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "EOI", to: `/admin/eois/inventory/${inventoryId}` },
    { label: "Edit Details", to: "#" },
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
    { label: "EoI Submission", to: "#" },
  ],
  myEoi: [{ label: "My EoI", to: "#" }],
  myEoiShow: (inventoryId, eoiId) => [
    { label: "My EoI", to: "/admin/myeoi" },
    {
      label: "Edit Details",
      to: `/admin/myeoi/${inventoryId}/eois/edit/${eoiId}`,
    },
    { label: "View Item Details", to: "#" },
  ],
  myEoiEdit: [
    { label: "My EoI", to: "/admin/myeoi" },
    { label: "Edit Details", to: "#" },
  ],
  // Add more as needed
};

export default breadcrumbConfig;
