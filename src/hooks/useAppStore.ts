import { create } from "zustand/react";

const useAppStore = create<{
  isScrollEnabled: boolean;
  setIsScrollEnabled: (value: boolean) => void;
}>(set => ({
  isScrollEnabled: true,
  setIsScrollEnabled: (value: boolean) => set({ isScrollEnabled: value })
}));

const useIsScrollEnabled = () => useAppStore(state => state.isScrollEnabled);
const useSetIsScrollEnabled = () => useAppStore(state => state.setIsScrollEnabled);

export { useIsScrollEnabled, useSetIsScrollEnabled };
export default useAppStore;