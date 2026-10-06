import { create } from 'zustand'

type AppState = {
  workspaceName: string
  setWorkspaceName: (workspaceName: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  workspaceName: 'Northstar Commerce',
  setWorkspaceName: (workspaceName) => set({ workspaceName }),
}))
