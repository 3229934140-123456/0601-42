import { create } from 'zustand';
import type { Comment, RiskAlert, OralBroadcast, ViewerTrendPoint } from '@/types';
import { channels } from '@/data/channels';
import { roomCommentsData, roomFrequentComments } from '@/data/comments';
import { roomProductsData, roomOralData } from '@/data/products';
import { roomRisksData, getPendingRisksCount, getHighestRiskLevel } from '@/data/risks';
import { roomViewerTrends } from '@/data/analytics';

interface AppState {
  theme: 'light' | 'dark';
  currentRoomId: string;
  channels: typeof channels;
  sidebarCollapsed: boolean;
  selectedCompareRooms: string[];
  operatorConclusions: Record<string, string>;
  
  toggleTheme: () => void;
  setCurrentRoomId: (id: string) => void;
  toggleStar: (roomId: string) => void;
  toggleSidebar: () => void;
  pinComment: (roomId: string, commentId: string) => void;
  unpinComment: (roomId: string, commentId: string) => void;
  addRiskNote: (roomId: string, riskId: string, content: string, author: string) => void;
  updateRiskStatus: (roomId: string, riskId: string, status: string, handler?: string) => void;
  addOralBroadcast: (roomId: string, oral: Omit<OralBroadcast, 'id' | 'timestamp' | 'roomId'>) => void;
  updateProductStatus: (roomId: string, productId: string, status: string) => void;
  toggleCompareRoom: (roomId: string) => void;
  setOperatorConclusion: (roomId: string, conclusion: string) => void;
  
  getRoomComments: (roomId: string) => Comment[];
  getRoomFrequentComments: (roomId: string) => typeof roomFrequentComments[string];
  getRoomProducts: (roomId: string) => typeof roomProductsData[string];
  getRoomOralBroadcasts: (roomId: string) => OralBroadcast[];
  getRoomRisks: (roomId: string) => RiskAlert[];
  getViewerTrend: (roomId: string) => ViewerTrendPoint[];
  getPendingRisksCount: (roomId: string) => number;
  getHighestRiskLevel: (roomId: string) => string | null;
}

export const useAppStore = create<AppState>((set, get) => ({
  theme: 'dark',
  currentRoomId: 'room-001',
  channels,
  sidebarCollapsed: false,
  selectedCompareRooms: ['room-001', 'room-002', 'room-005'],
  operatorConclusions: {},

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

  pinComment: (roomId: string, commentId: string) =>
    set((state) => {
      const roomComments = [...(roomCommentsData[roomId] || [])];
      const updatedComments = roomComments.map((c) =>
        c.id === commentId ? { ...c, isPinned: true } : c
      );
      roomCommentsData[roomId] = updatedComments;
      return {};
    }),

  unpinComment: (roomId: string, commentId: string) =>
    set((state) => {
      const roomComments = [...(roomCommentsData[roomId] || [])];
      const updatedComments = roomComments.map((c) =>
        c.id === commentId ? { ...c, isPinned: false } : c
      );
      roomCommentsData[roomId] = updatedComments;
      return {};
    }),

  addRiskNote: (roomId: string, riskId: string, content: string, author: string) =>
    set(() => {
      const risks = [...(roomRisksData[roomId] || [])];
      const riskIndex = risks.findIndex((r) => r.id === riskId);
      if (riskIndex !== -1) {
        const newNote = {
          id: `note-${Date.now()}`,
          content,
          author,
          timestamp: new Date().toISOString(),
        };
        risks[riskIndex] = {
          ...risks[riskIndex],
          notes: [...risks[riskIndex].notes, newNote],
        };
        roomRisksData[roomId] = risks;
      }
      return {};
    }),

  updateRiskStatus: (roomId: string, riskId: string, status: string, handler?: string) =>
    set(() => {
      const risks = [...(roomRisksData[roomId] || [])];
      const riskIndex = risks.findIndex((r) => r.id === riskId);
      if (riskIndex !== -1) {
        risks[riskIndex] = {
          ...risks[riskIndex],
          status: status as RiskAlert['status'],
          handler: handler || risks[riskIndex].handler,
          handleTime: new Date().toISOString(),
        };
        roomRisksData[roomId] = risks;
      }
      return {};
    }),

  addOralBroadcast: (roomId, oral) =>
    set(() => {
      const newOral: OralBroadcast = {
        ...oral,
        id: `ob-${Date.now()}`,
        roomId,
        timestamp: new Date().toISOString(),
      };
      roomOralData[roomId] = [newOral, ...(roomOralData[roomId] || [])];
      return {};
    }),

  updateProductStatus: (roomId: string, productId: string, status: string) =>
    set(() => {
      const products = [...(roomProductsData[roomId] || [])];
      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          status: status as any,
        };
        roomProductsData[roomId] = products;
      }
      return {};
    }),

  toggleCompareRoom: (roomId: string) =>
    set((state) => {
      const isSelected = state.selectedCompareRooms.includes(roomId);
      if (isSelected) {
        if (state.selectedCompareRooms.length <= 2) {
          return state;
        }
        return {
          selectedCompareRooms: state.selectedCompareRooms.filter(
            (id) => id !== roomId
          ),
        };
      }
      if (state.selectedCompareRooms.length >= 5) {
        return state;
      }
      return {
        selectedCompareRooms: [...state.selectedCompareRooms, roomId],
      };
    }),

  setOperatorConclusion: (roomId: string, conclusion: string) =>
    set((state) => ({
      operatorConclusions: {
        ...state.operatorConclusions,
        [roomId]: conclusion,
      },
    })),

  getRoomComments: (roomId: string) => roomCommentsData[roomId] || [],
  getRoomFrequentComments: (roomId: string) => roomFrequentComments[roomId] || [],
  getRoomProducts: (roomId: string) => roomProductsData[roomId] || [],
  getRoomOralBroadcasts: (roomId: string) => roomOralData[roomId] || [],
  getRoomRisks: (roomId: string) => roomRisksData[roomId] || [],
  getViewerTrend: (roomId: string) => roomViewerTrends[roomId] || [],
  getPendingRisksCount: (roomId: string) => getPendingRisksCount(roomId),
  getHighestRiskLevel: (roomId: string) => getHighestRiskLevel(roomId),
}));
