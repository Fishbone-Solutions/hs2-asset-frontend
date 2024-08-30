export const endpoints = {
  inventories: () => "/assets/-1",
  createInventory: () => `/assets`,
  getInventoryById: (id) => `/assets/${id}`,
  updateInventory: (id) => `/assets/${id}`,
  deleteInventory: (id) => `/assets/del/${id}`,
  eoiOnbehaveInventory: (inventory_id) => `/assets/${inventory_id}/eoi/-1`,
  inventoryBaseEoiDetails: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}`,
  eoiActivityTrackingHistory: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}/history`,
  eoiUpdateStatus: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}`,
  myeoi: (username) => `/users/${username}/eoi`,
  getEoiById: (id) => ``,
};
