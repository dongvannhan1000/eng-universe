import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DeckFiltersState {
  q: string;
  tags: string[];
}

const initialState: DeckFiltersState = {
  q: "",
  tags: [],
};

const deckFiltersSlice = createSlice({
  name: "deckFilters",
  initialState,
  reducers: {
    setDeckQ: (state, action: PayloadAction<string>) => {
      state.q = action.payload;
    },
    setDeckTags: (state, action: PayloadAction<string[]>) => {
      state.tags = action.payload;
    },
    resetDeckFilters: (state) => {
      state.q = "";
      state.tags = [];
    },
  },
});

export const { setDeckQ, setDeckTags, resetDeckFilters } = deckFiltersSlice.actions;

export const selectDeckFilters = (state: { deckFilters: DeckFiltersState }) => state.deckFilters;

export default deckFiltersSlice.reducer;
