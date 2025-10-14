import { configureStore } from "@reduxjs/toolkit";
import filtersReducer from "../features/vocab/slices/filtersSlice";
import deckFiltersReducer from "../features/decks/slices/deckFiltersSlice";
import deckDetailReducer from "../features/decks/slices/deckDetailSlice";
import captureModeReducer from "../features/vocab/slices/captureModeSlice";

export const store = configureStore({
  reducer: {
    filters: filtersReducer,
    deckFilters: deckFiltersReducer,
    deckDetail: deckDetailReducer,
    captureMode: captureModeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
