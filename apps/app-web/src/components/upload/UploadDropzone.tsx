'use client';

import { useCallback, useRef, useState } from 'react';

export interface UploadDropzoneProps {
  onUploaded?: (photoId: string, url: string) => void;
}

type Status = 'idle' | 'uploading' | 'success' | 'error';

export default function UploadDropzone({
  onUploaded,
}: UploadDropzoneProps): React.ReactElement {
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [resultUrl, setResultUrl] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(
    async (file: File) => {
      setStatus('uploading');
      setErrorMsg('');
      setResultUrl('');

      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      try {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = (await res.json()) as {
          photoId?: string;
          url?: string;
          error?: string;
          reason?: string;
        };
        if (!res.ok || !data.photoId) {
          setStatus('error');
          setErrorMsg(data.reason ?? data.error ?? 'Upload failed');
          return;
        }
        setStatus('success');
        setResultUrl(data.url ?? '');
        onUploaded?.(data.photoId, data.url ?? '');
      } catch (e) {
        setStatus('error');
        setErrorMsg(e instanceof Error ? e.message : 'Upload failed');
      }
    },
    [onUploaded],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files?.[0];
      if (file) void uploadFile(file);
    },
    [uploadFile],
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleClick = useCallback(() => inputRef.current?.click(), []);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) void uploadFile(file);
    },
    [uploadFile],
  );

  const showImage = resultUrl || previewUrl;

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
      className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border bg-muted/30 hover:border-primary/50 hover:bg-muted/50'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {showImage ? (
        <div className="flex flex-col items-center gap-3">
          <img
            src={resultUrl || previewUrl}
            alt="preview"
            className="max-w-full max-h-80 rounded-xl"
          />
          {status === 'uploading' && (
            <p className="text-sm text-muted-foreground">Uploading…</p>
          )}
          {status === 'success' && (
            <p className="text-sm text-emerald-600">Uploaded ✓</p>
          )}
          {status === 'error' && (
            <p className="text-sm text-destructive">{errorMsg}</p>
          )}
        </div>
      ) : (
        <>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
            <span className="text-2xl">📷</span>
          </div>
          <p className="font-medium">Drag & drop your photo here</p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to select a file
          </p>
          <p className="mt-3 text-xs text-muted-foreground/70">
            JPG, PNG or WebP · up to 10MB · clear front-facing photo
          </p>
        </>
      )}
    </div>
  );
}
