// Unused — kept as stub so any stale imports don't break the build.
export const useRealTimeUpdates = () => ({
  lastUpdate: new Date(),
  updateMessage: '',
  isRefreshing: false,
  refreshData: async () => {},
  showUpdateMessage: () => {},
});
