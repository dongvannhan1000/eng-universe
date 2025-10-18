import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CaptureModeState {
  enabled: boolean;
  defaultTags: string[];
}

const initialState: CaptureModeState = {
  enabled: false,
  defaultTags: [],
};

const captureModeSlice = createSlice({
  name: "captureMode",
  initialState,
  reducers: {
    toggleCaptureMode: (state) => {
      state.enabled = !state.enabled;
    },
    setCaptureModeEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
    setDefaultTags: (state, action: PayloadAction<string[]>) => {
      state.defaultTags = action.payload;
    },
    addDefaultTag: (state, action: PayloadAction<string>) => {
      if (!state.defaultTags.includes(action.payload)) {
        state.defaultTags.push(action.payload);
      }
    },
    removeDefaultTag: (state, action: PayloadAction<string>) => {
      state.defaultTags = state.defaultTags.filter((tag) => tag !== action.payload);
    },
    resetCaptureMode: (state) => {
      state.enabled = false;
      state.defaultTags = [];
    },
  },
});

export const {
  toggleCaptureMode,
  setCaptureModeEnabled,
  setDefaultTags,
  addDefaultTag,
  removeDefaultTag,
  resetCaptureMode,
} = captureModeSlice.actions;

export const selectCaptureMode = (state: { captureMode: CaptureModeState }) => state.captureMode;

export default captureModeSlice.reducer;
