export const endpoints = {
  inventories: (query_params) => `/assets/-1?${query_params}`,
  createInventory: () => `/assets`,
  getInventoryById: (id) => `/assets/${id}`,
  updateInventory: (id) => `/assets/${id}`,
  deleteInventory: (id) => `/assets/${id}/-1`,
  eoiOnbehaveInventory: (inventory_id) => `/assets/${inventory_id}/eoi/-1`,
  createEoi: (inventory_id) => `/assets/${inventory_id}/eoi`,
  inventoryBaseEoiDetails: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}`,
  eoiActivityTrackingHistory: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}/history`,
  eoiUpdateStatus: (inventory_id, eoi_id) =>
    `assets/${inventory_id}/eoi/${eoi_id}`,
  deleteEoi: (inventory_id, eoi_id) =>
    `/assets/${inventory_id}/eoi/${eoi_id}/-1`,
  myeoi: (username,query_params) => `/users/${username}/eoi?${query_params}`,
  exchanges: (query_params) => `register?${query_params}`,
};
