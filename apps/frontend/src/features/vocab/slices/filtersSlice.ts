import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  q: string;
  tags: string[];
  from: string | null;
  to: string | null;
  page: number;
  limit: number;
}

const initialState: FiltersState = {
  q: "",
  tags: [],
  from: null,
  to: null,
  page: 1,
  limit: 20,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setQ: (state, action: PayloadAction<string>) => {
      state.q = action.payload;
      state.page = 1; // Reset page when search changes
    },
    setTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
      state.page = 1; // Reset page when tags change
    },
    setFrom: (state, action: PayloadAction<string | null>) => {
      state.from = action.payload;
      state.page = 1; // Reset page when date range changes
    },
    setTo: (state, action: PayloadAction<string | null>) => {
      state.to = action.payload;
      state.page = 1; // Reset page when date range changes
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset page when limit changes
    },
    resetFilters: (state) => {
      state.q = "";
      state.tags = [];
      state.from = null;
      state.to = null;
      state.page = 1;
      state.limit = 20;
    },
    hydrateFromUrl: (state, action: PayloadAction<Partial<FiltersState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const { setQ, setTags, setFrom, setTo, setPage, setLimit, resetFilters, hydrateFromUrl } =
  filtersSlice.actions;

export const selectFilters = (state: { filters: FiltersState }) => state.filters;

export default filtersSlice.reducer;
