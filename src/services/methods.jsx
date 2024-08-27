import { Get, Put, Delete, Post } from "../common/axios/requests";
import { endpoints } from "./endpoints";

function getInventory(headers = null) {
  return Get(`${endpoints.inventories()}`, headers);
}

function getInventoryById(headers = null, id) {
  return Get(`${endpoints.getInventoryById(id)}`, headers);
}

function createInventory(params) {
  return Post(`${endpoints.createInventory()}`, params);
}

function updateInventory(id, params) {
  return Put(`${endpoints.updateInventory(id)}`, params);
}

function deleteInventoryById(id) {
  return Delete(`${endpoints.deleteInventoryById(id)}`);
}

export const EndPointService = {
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventoryById,
};
