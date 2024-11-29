import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { MoodboardItem as MoodboardItemType } from '../store/moodboardStore';
import { ResizeHandle } from './ResizeHandle';

interface Props {
  item: MoodboardItemType;
  onUpdate: (id: string, updates: Partial<MoodboardItemType>) => void;
  onRemove: (id: string) => void;
}

export const MoodboardItem: React.FC<Props> = ({ item, onUpdate, onRemove }) => {
  const [size, setSize] = useState(item.size || { width: 200, height: 200 });
  const [isResizing, setIsResizing] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(1);
  const initialMousePos = useRef({ x: 0, y: 0 });
  const initialSize = useRef(size);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (item.type === 'image' && imageRef.current) {
      const img = imageRef.current;
      if (img.complete) {
        setAspectRatio(img.naturalWidth / img.naturalHeight);
      } else {
        img.onload = () => {
          setAspectRatio(img.naturalWidth / img.naturalHeight);
        };
      }
    }
  }, [item]);

  const handleDragStop = (_e: any, data: { x: number; y: number }) => {
    onUpdate(item.id, { position: { x: data.x, y: data.y } });
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    initialMousePos.current = { x: e.clientX, y: e.clientY };
    initialSize.current = size;
  };

  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (isResizing) {
        const dx = e.clientX - initialMousePos.current.x;
        
        const newWidth = Math.max(100, initialSize.current.width + dx);
        const newHeight = newWidth / aspectRatio;
        
        const newSize = {
          width: newWidth,
          height: newHeight,
        };
        
        setSize(newSize);
        onUpdate(item.id, { size: newSize });
      }
    };

    const handleResizeEnd = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleResize);
      window.addEventListener('mouseup', handleResizeEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleResize);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, onUpdate, item.id, aspectRatio]);

  return (
    <Draggable
      position={item.position}
      onStop={handleDragStop}
      bounds="parent"
      disabled={isResizing}
    >
      <div className="absolute cursor-move group">
        <div className="relative">
          {item.type === 'image' ? (
            <div style={{ width: size.width, height: size.height }} className="relative">
              <img
                ref={imageRef}
                src={item.content}
                alt="Moodboard item"
                className="w-full h-full object-contain rounded-lg"
              />
              <ResizeHandle position="se" onMouseDown={handleResizeStart} />
            </div>
          ) : (
            <div className="p-4 bg-white rounded-lg">
              <p>{item.content}</p>
            </div>
          )}
          
          <button
            onClick={() => onRemove(item.id)}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-600 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </Draggable>
  );
};