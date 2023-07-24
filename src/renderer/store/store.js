import { create } from 'zustand';
import { createOverviewSlice } from './overview_slice.js';

export const useStore = create((...a) => ({
  ...createOverviewSlice(...a),
}));
