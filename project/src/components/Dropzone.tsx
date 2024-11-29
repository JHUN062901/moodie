import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface Props {
  onImageDrop: (imageUrl: string) => void;
}

export const Dropzone: React.FC<Props> = ({ onImageDrop }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        onImageDrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    });
  }, [onImageDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border border-dashed p-8 text-center rounded-xl transition-colors ${
        isDragActive ? 'border-blue-500 bg-blue-50/50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p className="text-blue-500 font-medium">Drop your images here...</p>
      ) : (
        <p className="text-gray-500">Drop images here or click to browse</p>
      )}
    </div>
  );
};