import React, { useState } from 'react';
import { useMoodboardStore } from '../store/moodboardStore';
import { useAuthStore } from '../store/authStore';
import { Plus, Trash2 } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { boards, currentBoard, setCurrentBoard, addBoard, removeBoard } = useMoodboardStore();
  const { user } = useAuthStore();
  const [newBoardName, setNewBoardName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateBoard = () => {
    if (newBoardName.trim() && user) {
      const newBoard = {
        id: Date.now().toString(),
        name: newBoardName,
        items: [],
        userId: user.id,
      };
      addBoard(newBoard);
      setNewBoardName('');
      setIsCreating(false);
    }
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold">Your Moodboards</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <Plus size={20} />
        </button>
      </div>

      {isCreating && (
        <div className="mb-4">
          <input
            type="text"
            value={newBoardName}
            onChange={(e) => setNewBoardName(e.target.value)}
            placeholder="Board name"
            className="w-full px-3 py-2 border rounded-lg mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateBoard}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm"
            >
              Create
            </button>
            <button
              onClick={() => setIsCreating(false)}
              className="px-3 py-1 text-gray-500 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {boards.map((board) => (
          <div
            key={board.id}
            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
              currentBoard === board.id ? 'bg-blue-50' : 'hover:bg-gray-50'
            }`}
            onClick={() => setCurrentBoard(board.id)}
          >
            <span className="truncate">{board.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeBoard(board.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded-full"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};