import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Image, X } from 'lucide-react';
import { useUploadMedia, useMedia, useDeleteMedia } from '../../hooks/useApi';

interface MediaUploaderProps {
  articleId?: string;
  onUploadComplete?: (url: string) => void;
}

export default function MediaUploader({ articleId, onUploadComplete }: MediaUploaderProps) {
  const { data: mediaList } = useMedia(articleId);
  const uploadMedia = useUploadMedia();
  const deleteMedia = useDeleteMedia();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        for (const file of acceptedFiles) {
          await uploadMedia.mutateAsync({ file, articleId });
        }
      } catch (error) {
        console.error('Upload failed:', error);
      }
    },
    [articleId, uploadMedia]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteMedia.mutateAsync(id);
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <Image className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag & drop files here, or click to select'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          PNG, JPG, GIF up to 5MB
        </p>
      </div>

      {uploadMedia.isLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Uploading...</p>
        </div>
      )}

      {mediaList?.data && mediaList.data.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {mediaList.data.map((media) => (
            <div key={media.id} className="relative group">
              <img
                src={`${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/media/${media.path}`}
                alt={media.filename}
                className="w-full h-32 object-cover rounded-lg"
              />
              <button
                onClick={() => handleDelete(media.id)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}