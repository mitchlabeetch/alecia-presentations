import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";

export interface VirtualScrollItem<T> {
  id: string;
  index: number;
  data: T;
}

export interface VirtualScrollProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
}

export function VirtualScroll<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 3,
  className = "",
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalHeight = items.length * itemHeight;

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    items.length - 1,
    Math.ceil((scrollTop + height) / itemHeight) + overscan
  );

  const visibleItems = useMemo(() => {
    const result: { item: T; index: number }[] = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (items[i] !== undefined) {
        result.push({ item: items[i], index: i });
      }
    }
    return result;
  }, [items, startIndex, endIndex]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ height: height + "px", overflow: "auto" }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight + "px", position: "relative" }}>
        {visibleItems.map(({ item, index }) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: index * itemHeight + "px",
              left: 0,
              right: 0,
              height: itemHeight + "px",
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualScroll;
