import { useRef, useState, useCallback } from 'react';

interface ImageSlotProps {
  placeholder?: string;
  className?: string;
}

export default function ImageSlot({ placeholder = 'Drop image here', className = '' }: ImageSlotProps) {
  const [src, setSrc] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, [loadFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const onDragLeave = useCallback(() => setDragging(false), []);

  const onClick = useCallback(() => inputRef.current?.click(), []);

  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  }, [loadFile]);

  return (
    <div
      className={`relative w-full h-full cursor-pointer select-none ${dragging ? 'opacity-70' : ''} ${className}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={onClick}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onInputChange}
      />
      {src ? (
        <img src={src} alt={placeholder} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <span
            className="text-[10px] tracking-[0.25em] uppercase"
            style={{ fontFamily: 'var(--font-mono)', color: 'rgba(244,236,220,0.4)' }}
          >
            {placeholder}
          </span>
        </div>
      )}
    </div>
  );
}
