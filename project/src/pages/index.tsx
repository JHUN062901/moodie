import React, { useState } from 'react';
import { AuthForm } from '../components/AuthForm';
import { Sidebar } from '../components/Sidebar';
import { Dropzone } from '../components/Dropzone';
import { MoodboardItem } from '../components/MoodboardItem';
import { useMoodboardStore } from '../store/moodboardStore';
import { useAuthStore } from '../store/authStore';

export default function Home() {
  const { user } = useAuthStore();
  const { boards, currentBoard, addItem, updateItem, removeItem } = useMoodboardStore();
  const [isAddingText, setIsAddingText] = useState(false);
  const [newText, setNewText] = useState('');

  if (!user) {
    return <AuthForm />;
  }

  const currentBoardData = boards.find((board) => board.id === currentBoard);

  const handleImageDrop = (imageUrl: string) => {
    if (currentBoard) {
      addItem(currentBoard, {
        id: Date.now().toString(),
        type: 'image',
        content: imageUrl,
        position: { x: Math.random() * 200, y: Math.random() * 200 },
        size: { width: 250, height: 250 },
      });
    }
  };

  const handleAddText = () => {
    if (newText.trim() && currentBoard) {
      addItem(currentBoard, {
        id: Date.now().toString(),
        type: 'text',
        content: newText,
        position: { x: Math.random() * 200, y: Math.random() * 200 },
      });
      setNewText('');
      setIsAddingText(false);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      
      <div className="flex-1 bg-gray-50/50 overflow-hidden">
        {currentBoardData ? (
          <div className="h-full p-8">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl font-semibold text-gray-900">
                {currentBoardData.name}
              </h1>
              
              {isAddingText ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newText}
                    onChange={(e) => setNewText(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your text..."
                  />
                  <button
                    onClick={handleAddText}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => setIsAddingText(false)}
                    className="px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingText(true)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Add Text
                </button>
              )}
            </div>

            <div className="mb-8">
              <Dropzone onImageDrop={handleImageDrop} />
            </div>

            <div 
              className="relative h-[calc(100vh-280px)] bg-white rounded-2xl border border-gray-100"
              style={{
                backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              {currentBoardData.items.map((item) => (
                <MoodboardItem
                  key={item.id}
                  item={item}
                  onUpdate={(itemId, updates) => updateItem(currentBoard, itemId, updates)}
                  onRemove={(itemId) => removeItem(currentBoard, itemId)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            Select a moodboard or create a new one to get started
          </div>
        )}
      </div>
    </div>
  );
}