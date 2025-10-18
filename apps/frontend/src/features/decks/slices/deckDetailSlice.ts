import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface DeckDetailState {
  page: number;
  limit: number;
}

const initialState: DeckDetailState = {
  page: 1,
  limit: 20,
};

const deckDetailSlice = createSlice({
  name: "deckDetail",
  initialState,
  reducers: {
    setDeckPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setDeckLimit: (state, action: PayloadAction<number>) => {
      state.limit = action.payload;
      state.page = 1; // Reset page when limit changes
    },
    resetDeckDetail: (state) => {
      state.page = 1;
      state.limit = 20;
    },
  },
});

export const { setDeckPage, setDeckLimit, resetDeckDetail } = deckDetailSlice.actions;

export const selectDeckDetail = (state: { deckDetail: DeckDetailState }) => state.deckDetail;

export default deckDetailSlice.reducer;
