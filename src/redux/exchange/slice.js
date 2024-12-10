import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { EndPointService } from "@/services/methods";

export const fetchTableData = createAsyncThunk(
  "exchange/fetchExchange",
  async (filterFormData, { rejectWithValue }) => {
    try {
      const headers = { user_id: sessionStorage.getItem("username") };
      const response = await EndPointService.getExchange(
        headers,
        new URLSearchParams(filterFormData)
      );
      return response.appRespData;
    } catch (error) {
      return rejectWithValue(
        error.response ? error.response.data : error.message
      );
    }
  }
);

const initialState = {
  dataState: [],
  isLoading: false,
  toastType: null,
  toastMessage: "",
  cities: [],
  filterFormData: {
    fltr_id: -1,
    fltr_name: -1,
    fltr_category1: -1,
    fltr_category2: -1,
    fltr_from_availability: -1,
    fltr_to_availability: -1,
    statuscode: -1,
    fltr_city: -1,
    cityName: -1,
    fltr_location: -1,
    cursor_row_no: 0,
    page_size: 10,
  },
  appliedFilters: [],
  rangeDates: {
    startDate: "",
    endDate: "",
  },
  currentPageNumber: 1,
  totalRowCount: 0,
};

const exchangeSlice = createSlice({
  name: "exchange",
  initialState,
  reducers: {
    setLoader: (state, action) => {
      state.isLoading = action.payload;
    },
    setToast: (state, action) => {
      state.toastType = action.payload.type;
      state.toastMessage = action.payload.message;
    },
    setCities: (state, action) => {
      state.cities = action.payload;
    },
    setDataState: (state, action) => {
      state.dataState = action.payload;
    },
    setFilterFormData: (state, action) => {
      state.filterFormData = { ...state.filterFormData, ...action.payload };
    },
    setAppliedFilters: (state, action) => {
      state.appliedFilters = action.payload;
    },
    setRangeDates: (state, action) => {
      state.rangeDates = action.payload;
    },
    setPagination: (state, action) => {
      console.log("action pagination", action);
      state.currentPageNumber = action.payload.page;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTableData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTableData.fulfilled, (state, action) => {
        console.log("add class fulfilled", action.payload);
        state.isLoading = false;
        state.dataState = action.payload;
        if (action.payload.length > 0) {
          state.totalRowCount =
            action.payload[action.payload.length - 1].row_count;
        }
      })
      .addCase(fetchTableData.rejected, (state, action) => {
        state.isLoading = false;
        state.toastType = "error";
        state.toastMessage = action.payload || "Something went wrong";
      });
  },
});

export const {
  setLoader,
  setToast,
  setCities,
  setDataState,
  setFilterFormData,
  setAppliedFilters,
  setRangeDates,
  setPagination,
} = exchangeSlice.actions;

export default exchangeSlice.reducer;
