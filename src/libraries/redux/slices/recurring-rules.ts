import { INDEXED_DB } from '@/data/constants';
import { RecurringRuleGet } from '@/types/models/recurring-rule';
import { createSlice } from '@reduxjs/toolkit';

export const sliceRecurringRules = createSlice({
  name: INDEXED_DB.RECURRING_RULES,
  initialState: {
    value: [] satisfies RecurringRuleGet[] as RecurringRuleGet[],
    deleted: [] as string[],
  },
  reducers: {
    updateRecurringRules: (state, action) => {
      state.value = action.payload;
    },
    updateDeletedRecurringRules: (state, action) => {
      state.deleted = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateRecurringRules, updateDeletedRecurringRules } =
  sliceRecurringRules.actions;

const reducerRecurringRules = sliceRecurringRules.reducer;
export default reducerRecurringRules;
