// breadcrumbConfig.js

const breadcrumbConfig = {
  inventory: [{ label: "Inventory", to: "/admin/inventory" }],
  inventoryCreate: [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "Create", to: "#" },
  ],
  inventoryShow: [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "Item Details", to: "#" },
  ],
  inventoryEdit: [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "Edit", to: "#" },
  ],
  inventoryEoi: [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "EOI", to: "#" },
  ],
  inventoryEoiDetails: (inventoryId) => [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "EOI", to: `/admin/eois/inventory/${inventoryId}` },
    { label: "Details", to: "#" },
  ],
  inventoryEoiEdit: (inventoryId) => [
    { label: "Inventory", to: "/admin/inventory" },
    { label: "EOI", to: `/admin/eois/inventory/${inventoryId}` },
    { label: "Edit", to: "#" },
  ],
  // Add more as needed
};

export default breadcrumbConfig;
