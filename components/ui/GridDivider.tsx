'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';

type GridDividerProps = {
  rows?: number;
  cellSize?: number;
  gap?: number;
  animationInterval?: number;
  activeRatio?: number;
  noGradient?: boolean;
  className?: string;
};

export function GridDivider({
  rows = 6,
  cellSize = 8,
  gap = 1,
  animationInterval = 2000,
  activeRatio = 0.08,
  noGradient = false,
  className,
}: GridDividerProps) {
  const [columns, setColumns] = useState(60);

  useEffect(() => {
    const updateColumns = () => {
      const viewportWidth = window.innerWidth;
      const cellWithGap = cellSize + gap;
      const calculatedColumns = Math.ceil(viewportWidth / cellWithGap) + 2;
      setColumns(calculatedColumns);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, [cellSize, gap]);

  const totalCells = columns * rows;

  const generateActiveCells = useCallback(() => {
    const activeCount = Math.floor(totalCells * activeRatio);
    const indices = new Set<number>();
    while (indices.size < activeCount) {
      indices.add(Math.floor(Math.random() * totalCells));
    }
    return indices;
  }, [totalCells, activeRatio]);

  const [activeCells, setActiveCells] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCells(generateActiveCells());
    }, animationInterval);

    return () => clearInterval(interval);
  }, [animationInterval, generateActiveCells]);

  const cells = useMemo(
    () =>
      Array.from({ length: totalCells }).map((_, index) => ({
        index,
        isActive: activeCells.has(index),
      })),
    [totalCells, activeCells],
  );

  return (
    <div
      className={cn('relative w-full overflow-hidden py-4', className)}
      aria-hidden="true"
    >
      {!noGradient && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, var(--color-background) 0%, transparent 30%, transparent 70%, var(--color-background) 100%)',
          }}
        />
      )}

      <div
        className="grid justify-center"
        style={{
          gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
          gap: `${gap}px`,
        }}
      >
        {cells.map(({ index, isActive }) => (
          <div
            key={index}
            className={cn(
              'transition-all duration-700 ease-in-out',
              isActive ? 'bg-[var(--grid-cell-active)]' : 'bg-[var(--grid-cell-muted)]',
            )}
            style={{
              width: cellSize,
              height: cellSize,
            }}
          />
        ))}
      </div>
    </div>
  );
}
