import { configureStore } from "@reduxjs/toolkit";
import exchangeReducer from "./exchange/slice";
import inventoryReducer from "./inventory/slice";

export const store = configureStore({
  reducer: {
    exchange: exchangeReducer,
    inventory: inventoryReducer,
  },
});
