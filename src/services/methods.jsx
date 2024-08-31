import {
  Get,
  Put,
  UpdateWithPost,
  PostWithMultiPart,
  Delete,
  Post,
} from "../common/axios/requests";
import { endpoints } from "./endpoints";

function getInventory(headers = null, params = null) {
  return Get(`${endpoints.inventories(params)}`, headers);
}

function getInventoryById(headers = null, id) {
  return Get(`${endpoints.getInventoryById(id)}`, headers);
}

function createInventory(headers = null, params) {
  return Post(`${endpoints.createInventory()}`, params, headers);
}

function updateInventory(headers = null, id, params) {
  return UpdateWithPost(`${endpoints.updateInventory(id)}`, params, headers);
}

function deleteInventoryById(id) {
  return Delete(`${endpoints.deleteInventoryById(id)}`);
}

function eoiOnbehaveInventory(headers = null, inventory_id) {
  return Get(`${endpoints.eoiOnbehaveInventory(inventory_id)}`, headers);
}

function inventoryBaseEoiDetails(headers = null, inventory_id, eoi_id) {
  return Get(
    `${endpoints.inventoryBaseEoiDetails(inventory_id, eoi_id)}`,
    headers
  );
}

function eoiActivityTrackingHistory(headers = null, inventory_id, eoi_id) {
  return Get(
    `${endpoints.eoiActivityTrackingHistory(inventory_id, eoi_id)}`,
    headers
  );
}

function eoiUpdateStatus(headers = null, inventory_id, eoi_id, params) {
  return UpdateWithPost(
    `${endpoints.eoiUpdateStatus(inventory_id, eoi_id)}`,
    params,
    headers
  );
}

function createEoi(headers = null, inventory_id, params) {
  return PostWithMultiPart(
    `${endpoints.createEoi(inventory_id)}`,
    params,
    headers
  );
}

function getExchange(headers = null, params = null) {
  return Get(`${endpoints.exchanges(params)}`, headers);
}

function getMyEoI(headers = null,params = null) {
  return Get(`${endpoints.myeoi(params)}`, headers);
}




export const EndPointService = {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventoryById,
  eoiOnbehaveInventory,
  inventoryBaseEoiDetails,
  eoiActivityTrackingHistory,
  eoiUpdateStatus,
  createEoi,
  getExchange,
  getMyEoI
};
