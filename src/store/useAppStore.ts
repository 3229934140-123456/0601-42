import { create } from 'zustand';
import type { LiveRoom, Comment, Product, RiskAlert, OralBroadcast, FrequentComment } from '@/types';
import { channels } from '@/data/channels';
import { comments, frequentComments } from '@/data/comments';
import { products, oralBroadcasts } from '@/data/products';
import { riskAlerts } from '@/data/risks';

interface AppState {
  theme: 'light' | 'dark';
  currentRoomId: string;
  channels: LiveRoom[];
  comments: Comment[];
  frequentComments: FrequentComment[];
  products: Product[];
  oralBroadcasts: OralBroadcast[];
  riskAlerts: RiskAlert[];
  sidebarCollapsed: boolean;
  
  toggleTheme: () => void;
  setCurrentRoomId: (id: string) => void;
  toggleStar: (roomId: string) => void;
  toggleSidebar: () => void;
  pinComment: (commentId: string) => void;
  unpinComment: (commentId: string) => void;
  addRiskNote: (riskId: string, content: string, author: string) => void;
  updateRiskStatus: (riskId: string, status: string, handler: string) => void;
  addOralBroadcast: (oral: Omit<OralBroadcast, 'id' | 'timestamp'>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  theme: 'dark',
  currentRoomId: 'room-001',
  channels,
  comments,
  frequentComments,
  products,
  oralBroadcasts,
  riskAlerts,
  sidebarCollapsed: false,

  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),

  setCurrentRoomId: (id: string) => set({ currentRoomId: id }),

  toggleStar: (roomId: string) =>
    set((state) => ({
      channels: state.channels.map((room) =>
        room.id === roomId ? { ...room, isStarred: !room.isStarred } : room
      ),
    })),

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  pinComment: (commentId: string) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId ? { ...c, isPinned: true } : c
      ),
    })),

  unpinComment: (commentId: string) =>
    set((state) => ({
      comments: state.comments.map((c) =>
        c.id === commentId ? { ...c, isPinned: false } : c
      ),
    })),

  addRiskNote: (riskId: string, content: string, author: string) =>
    set((state) => ({
      riskAlerts: state.riskAlerts.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              notes: [
                ...risk.notes,
                {
                  id: `note-${Date.now()}`,
                  content,
                  author,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : risk
      ),
    })),

  updateRiskStatus: (riskId: string, status: string, handler: string) =>
    set((state) => ({
      riskAlerts: state.riskAlerts.map((risk) =>
        risk.id === riskId
          ? {
              ...risk,
              status: status as RiskAlert['status'],
              handler,
              handleTime: new Date().toISOString(),
            }
          : risk
      ),
    })),

  addOralBroadcast: (oral) =>
    set((state) => ({
      oralBroadcasts: [
        {
          ...oral,
          id: `ob-${Date.now()}`,
          timestamp: new Date().toISOString(),
        },
        ...state.oralBroadcasts,
      ],
    })),
}));
