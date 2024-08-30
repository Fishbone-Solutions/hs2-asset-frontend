export const endpoints = {
  inventories: (query_params) => `/assets/-1?${query_params}`,
  createInventory: () => `/assets`,
  getInventoryById: (id) => `/assets/${id}`,
  updateInventory: (id) => `/assets/${id}`,
  deleteInventory: (id) => `/assets/del/${id}`,
  eoiOnbehaveInventory: (inventory_id) => `/assets/${inventory_id}/eoi/-1`,
  createEoi: (inventory_id) => `/assets/${inventory_id}/eoi`,
  inventoryBaseEoiDetails: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}`,
  eoiActivityTrackingHistory: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}/history`,
  eoiUpdateStatus: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}`,
  myeoi: (username) => `/users/${username}/eoi`,
  getEoiById: (id) => ``,
  exchanges: (query_params) => `register?${query_params}`,
};
