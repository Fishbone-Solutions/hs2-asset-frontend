export const endpoints = {
  inventories: (query_params) => `/assets?${query_params}`,
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
    `assets/${inventory_id}/eoi/${eoi_id}/status`,
  deleteEoi: (inventory_id, eoi_id) =>
    `/assets/${inventory_id}/eoi/${eoi_id}/-1`,
  myeoi: (username, query_params) => `/users/${username}/eoi?${query_params}`,
  exchanges: (query_params) => `register?${query_params}`,
  userProfile: (username) => `users/${username}`,
  getAttachmentByAssetId: (asset_id) => `assets/${asset_id}/attachments`,
  updateEoiBuyerDetials: (asset_id, eoi_id) =>
    `assets/${asset_id}/eoi/${eoi_id}`,
  getApprovalRequests: (query_params) =>
    `/approvals/eoiapprovals/requests?${query_params}`,
  approvalRequest: (requestId) => `approvals/approvalrequests/${requestId}`,
  organizatioinApproval: (organisationId) =>
    `approvals/organisations/${organisationId}/eoiapprovers`,
  createApprovalRequest: (eoi_id) => `/approvals/eoi/${eoi_id}/approvalrequest`,
  deleteApprovalRequest: (request_id) =>
    `approvals/approvalrequests/${request_id}/-1`,
};
