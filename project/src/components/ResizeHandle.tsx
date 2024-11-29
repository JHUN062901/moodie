import React from 'react';

interface Props {
  position: 'se' | 'sw' | 'ne' | 'nw';
  onMouseDown: (e: React.MouseEvent) => void;
}

export const ResizeHandle: React.FC<Props> = ({ position, onMouseDown }) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'se':
        return 'bottom-0 right-0 cursor-se-resize';
      case 'sw':
        return 'bottom-0 left-0 cursor-sw-resize';
      case 'ne':
        return 'top-0 right-0 cursor-ne-resize';
      case 'nw':
        return 'top-0 left-0 cursor-nw-resize';
    }
  };

  return (
    <div
      className={`absolute w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${getPositionClasses()}`}
      onMouseDown={onMouseDown}
    />
  );
};