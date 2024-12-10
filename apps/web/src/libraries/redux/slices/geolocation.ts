import { IpData } from '@/types/bodies/response';
import { createSlice } from '@reduxjs/toolkit';

export const sliceGeoData = createSlice({
  name: 'geolocation',
  initialState: {
    value: null satisfies IpData | null as IpData | null,
  },
  reducers: {
    update: (state, action) => {
      state.value = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { update: updateGeoData } = sliceGeoData.actions;

const reducerGeoData = sliceGeoData.reducer;
export default reducerGeoData;
