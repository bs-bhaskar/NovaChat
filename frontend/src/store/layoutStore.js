import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useLayoutStore = create(
  persist(
    (set) => ({
      activeTab: "chats",
      selectedContact:null,
      setSelectedContact: (contact) => set({ selectedContact:contact }),
      setActiveTab:(tab)=>set({activeTab:tab})
    }),
    {
      name: "Layout-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useLayoutStore;