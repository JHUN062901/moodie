import { create } from 'zustand';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface MoodboardItem {
  id: string;
  type: 'image' | 'text';
  content: string;
  position: Position;
  size?: Size;
}

export interface Moodboard {
  id: string;
  name: string;
  items: MoodboardItem[];
  userId: string;
}

interface MoodboardStore {
  boards: Moodboard[];
  currentBoard: string | null;
  setBoards: (boards: Moodboard[]) => void;
  addBoard: (board: Moodboard) => void;
  removeBoard: (id: string) => void;
  updateBoard: (id: string, updates: Partial<Moodboard>) => void;
  setCurrentBoard: (id: string | null) => void;
  addItem: (boardId: string, item: MoodboardItem) => void;
  updateItem: (boardId: string, itemId: string, updates: Partial<MoodboardItem>) => void;
  removeItem: (boardId: string, itemId: string) => void;
}

export const useMoodboardStore = create<MoodboardStore>((set) => ({
  boards: [],
  currentBoard: null,
  setBoards: (boards) => set({ boards }),
  addBoard: (board) => set((state) => ({ boards: [...state.boards, board] })),
  removeBoard: (id) => set((state) => ({
    boards: state.boards.filter((board) => board.id !== id),
    currentBoard: state.currentBoard === id ? null : state.currentBoard,
  })),
  updateBoard: (id, updates) => set((state) => ({
    boards: state.boards.map((board) =>
      board.id === id ? { ...board, ...updates } : board
    ),
  })),
  setCurrentBoard: (id) => set({ currentBoard: id }),
  addItem: (boardId, item) => set((state) => ({
    boards: state.boards.map((board) =>
      board.id === boardId
        ? { ...board, items: [...board.items, item] }
        : board
    ),
  })),
  updateItem: (boardId, itemId, updates) => set((state) => ({
    boards: state.boards.map((board) =>
      board.id === boardId
        ? {
            ...board,
            items: board.items.map((item) =>
              item.id === itemId ? { ...item, ...updates } : item
            ),
          }
        : board
    ),
  })),
  removeItem: (boardId, itemId) => set((state) => ({
    boards: state.boards.map((board) =>
      board.id === boardId
        ? { ...board, items: board.items.filter((item) => item.id !== itemId) }
        : board
    ),
  })),
}));