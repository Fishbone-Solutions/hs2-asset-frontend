export const endpoints = {
  inventories: () => "/assets/-1",
  createInventory: (asset_id) => `/assets/${asset_id}`,
  getInventoryById: (id) => `/assets/${id}`,
  updateInventory: (id) => `/assets/upd/${id}`,
  deleteInventory: (id) => `/assets/del/${id}`,
  
  myeoi: (username,)=> `/users/${username}/eoi`,
  getEoiById:(id) => ``
 
};
