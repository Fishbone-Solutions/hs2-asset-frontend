import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EndPointService } from "@/services/methods";

const initialState = {
  dataState: [],
  isLoading: false,
  fullLoader: false,
  toastType: null,
  toastMessage: "",
  activeModal: null,
  cursorRowNo: 0,
  currentPageNumber: 1,
  totalNumberOfRow: 10,

  totalRowCount: 0,
  clearCategoryBoolean: false,
  clearSubCategoryBoolean: false,
  rangeDatesEntry: { startDate: "", endDate: "" },
  rangeDatesAvailablility: { startDate: "", endDate: "" },
  filterFormData: {
    fltr_id: -1,
    fltr_name: -1,
    fltr_category: -1,
    fltr_sub_Category: -1,
    fltr_from_entry_date: -1,
    fltr_to_entry_date: -1,
    fltr_from_availability: -1,
    fltr_to_availability: -1,
    fltr_status: -1,
    cursor_row_no: 0,
    page_size: 10,
    fltr_only_active_eois: -1,
    fltr_only_unattended_eois: -1,
  },
  clearDateBoolean: false,
  headers: {
    user_id: sessionStorage.getItem("username"),
  },
  clearStatusBoolean: false,
  graphData: [],
  appliedFilters: [],
  directionPagination: "",
  refreshData: 0,
};

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (filterFormData, { rejectWithValue }) => {
    console.log("its working reducer inventory");
    const searchParams = new URLSearchParams(filterFormData);

    try {
      const headers = { user_id: sessionStorage.getItem("username") };
      const res = await EndPointService.getInventory(headers, searchParams);
      return res.appRespData;
    } catch (e) {
      return rejectWithValue(e.appRespMessage || "Error fetching inventory");
    }
  }
);

export const getPieChartState = createAsyncThunk(
  "inventory/graphState",
  async (params, { rejectWithValue }) => {
    console.log("getpic chect", params);
    try {
      const headers = { user_id: sessionStorage.getItem("username") };
      const res = await EndPointService.inventoryStatsAgainOrgainsation(
        headers,
        params
      );
      return res.appRespData;
    } catch (e) {
      return rejectWithValue(
        e.appRespMessage || "Error Fetching inventory state"
      );
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setDataState: (state, action) => {
      state.dataState = action.payload;
    },
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    setFullLoader: (state, action) => {
      state.fullLoader = action.payload;
    },
    setToastType: (state, action) => {
      state.toastType = action.payload;
    },
    setToastMessage: (state, action) => {
      state.toastMessage = action.payload;
    },
    setActiveModal: (state, action) => {
      state.activeModal = action.payload;
    },
    setCursorRowNo: (state, action) => {
      state.cursorRowNo = action.payload;
    },
    setCurrentPageNumber: (state, action) => {
      state.currentPageNumber = action.payload;
    },
    setTotalNumberOfRow: (state, action) => {
      state.totalNumberOfRow = action.payload;
    },
    setClearCategoryBoolean: (state, action) => {
      state.clearCategoryBoolean = action.payload;
    },
    setClearSubCategoryBoolean: (state, action) => {
      state.clearSubCategoryBoolean = action.payload;
    },
    setRangeDatesEntry: (state, action) => {
      state.rangeDatesEntry = action.payload;
    },
    setRangeDatesAvailablility: (state, action) => {
      state.rangeDatesAvailablility = action.payload;
    },
    setFilterFormData: (state, action) => {
      state.filterFormData = { ...state.filterFormData, ...action.payload };
    },
    setClearDateBoolean: (state, action) => {
      state.clearDateBoolean = action.payload;
    },
    setClearStatusBoolean: (state, action) => {
      state.clearStatusBoolean = action.payload;
    },
    setGraphData: (state, action) => {
      state.graphData = action.payload;
    },
    setAppliedFilters: (state, action) => {
      state.appliedFilters = action.payload;
    },
    setDirectionPagination: (state, action) => {
      state.directionPagination = action.payload;
    },
    setRefreshData: (state, action) => {
      state.refreshData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dataState = action.payload;
        if (action.payload.length > 0) {
          state.cursorRowNo = action.payload[action.payload.length - 1].row_no;
          state.totalNumberOfRow =
            action.payload[action.payload.length - 1].row_count;
        }
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.toastType = "error";
        state.toastMessage = action.payload;
      })
      .addCase(getPieChartState.pending, (state) => {
        state.fullLoader = true;
      })
      .addCase(getPieChartState.fulfilled, (state, action) => {
        state.graphData = action.payload;
        state.fullLoader = false;
      })
      .addCase(getPieChartState.rejected, (state, action) => {
        console.log(action);
        state.fullLoader = false;
        state.toastType = "error";
        state.toastMessage = action.payload;
      });
  },
});

export const {
  setDataState,
  setLoader,
  setFullLoader,
  setToastType,
  setToastMessage,
  setActiveModal,
  setCursorRowNo,
  setCurrentPageNumber,
  setTotalNumberOfRow,
  setClearCategoryBoolean,
  setClearSubCategoryBoolean,
  setRangeDatesEntry,
  setRangeDatesAvailablility,
  setFilterFormData,
  setClearDateBoolean,
  setClearStatusBoolean,
  setGraphData,
  setAppliedFilters,
  setDirectionPagination,
  setRefreshData,
} = inventorySlice.actions;

export default inventorySlice.reducer;
