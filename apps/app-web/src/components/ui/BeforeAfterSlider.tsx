'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

/**
 * 拖拽式 Before/After 对比滑块。
 *  - 鼠标拖拽 / 触摸拖拽均可
 *  - before 图铺底，after 图用 clip-path 按滑块位置裁切显示
 *  - 中央竖线 + 圆形手柄 + before/after 标签
 */
export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeLabel = 'Before',
  afterLabel = 'After',
  className = '',
}: BeforeAfterSliderProps): React.ReactElement {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50); // 0-100, 代表滑块在容器宽度中的百分比
  const [isDragging, setIsDragging] = useState(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, pct)));
  }, []);

  // 拖拽事件
  const handleDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(true);
      updatePosition(e.clientX);
      (e.target as Element).setPointerCapture?.(e.pointerId);
    },
    [updatePosition],
  );

  const handleMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;
      updatePosition(e.clientX);
    },
    [isDragging, updatePosition],
  );

  const handleUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // 全局 pointer 事件（鼠标移出容器后也能继续拖拽）
  useEffect(() => {
    if (!isDragging) return;
    const move = (e: PointerEvent) => updatePosition(e.clientX);
    const up = () => setIsDragging(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [isDragging, updatePosition]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full select-none overflow-hidden rounded-xl ${className}`}
    >
      {/* before 图（底） */}
      <img
        src={beforeSrc}
        alt={beforeLabel}
        className="pointer-events-none block h-full w-full object-cover"
        draggable={false}
      />

      {/* after 图（被 clip） */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ clipPath: `inset(0 0 0 ${position}%)` }}
      >
        <img
          src={afterSrc}
          alt={afterLabel}
          className="pointer-events-none block h-full w-full object-cover"
          draggable={false}
        />
      </div>

      {/* Before / After 标签 */}
      <div className="pointer-events-none absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
        {beforeLabel}
      </div>
      <div
        className="pointer-events-none absolute top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm"
        style={{ left: `calc(${position}% + 12px)`, transform: 'translateX(0)' }}
      >
        {afterLabel}
      </div>

      {/* 拖拽手柄 */}
      <div
        className={`absolute inset-y-0 w-0.5 bg-white shadow-lg ${isDragging ? 'bg-primary' : ''}`}
        style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
      >
        <div
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          className="absolute top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-white shadow-md ring-1 ring-border active:cursor-grabbing"
          role="slider"
          aria-label="Compare before and after"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground">
            <path d="M15 18l-6-6 6-6" />
            <path d="M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
