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
    { label: "Edit View", to: "#" },
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
    { label: "Edit View", to: "#" },
  ],
  exchange: [{ label: "Exchange", to: "#" }],
  exchangeShow: [
    { label: "Exchange", to: "/admin/exchange" },
    { label: "View Details", to: "#" },
  ],
  exchangeEoiSubmission: [
    { label: "Exchange", to: "/admin/exchange" },
    { label: "Eoi Submission", to: "#" },
  ],
  myEoi: [{ label: "My EoI", to: "#" }],
  myEoiShow: [
    { label: "My EoI", to: "/admin/myeoi" },
    { label: "View Item", to: "#" },
  ],
  myEoiEdit: [
    { label: "My EoI", to: "/admin/myeoi" },
    { label: "Edit Item", to: "#" },
  ],
  // Add more as needed
};

export default breadcrumbConfig;
