
import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface TimelineProgress {
  total: number;
  visibleRange: [number, number]; // [Start Index, End Index], 1-based
  centeredIndex: number; // 1-based
  progress: number; // 0 to 100
}

/**
 * Tracks scroll progress and item visibility for a horizontal timeline or vertical grid.
 * Ensures all indices are 1-based for UI display.
 */
export const useTimelineProgress = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>,
  sortedIds: string[],
  isVertical: boolean = false
): TimelineProgress => {
  const [stats, setStats] = useState<TimelineProgress>({
    total: 0,
    visibleRange: [0, 0],
    centeredIndex: 0,
    progress: 0,
  });

  const frameId = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    // If tracking window scroll for vertical grid
    const container = isVertical ? document.documentElement : containerRef.current;
    
    if (!container || sortedIds.length === 0) {
      setStats({
        total: 0,
        visibleRange: [0, 0],
        centeredIndex: 0,
        progress: 0,
      });
      return;
    }

    const { 
      scrollLeft, scrollTop, 
      scrollWidth, scrollHeight, 
      clientWidth, clientHeight 
    } = isVertical ? {
      scrollLeft: window.scrollX,
      scrollTop: window.scrollY,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      clientWidth: window.innerWidth,
      clientHeight: window.innerHeight
    } : container as HTMLDivElement;
    
    const currScroll = isVertical ? scrollTop : scrollLeft;
    const maxScroll = (isVertical ? scrollHeight : scrollWidth) - (isVertical ? clientHeight : clientWidth);
    const progress = maxScroll > 0 ? (currScroll / maxScroll) * 100 : 0;

    const viewportStart = currScroll;
    const viewportEnd = currScroll + (isVertical ? clientHeight : clientWidth);
    const viewportCenter = currScroll + (isVertical ? clientHeight : clientWidth) / 2;

    let firstVisible = -1;
    let lastVisible = -1;
    let minDistance = Infinity;
    let centeredIdx = 0;

    sortedIds.forEach((id, index) => {
      const node = nodeRefs.current.get(id);
      if (!node) return;

      let offset = 0;
      let curr: HTMLElement | null = node;
      
      // Accumulate offsets
      while (curr && (!isVertical ? curr !== container : curr !== document.body)) {
        offset += isVertical ? curr.offsetTop : curr.offsetLeft;
        curr = curr.offsetParent as HTMLElement;
      }
      
      const nodeSize = isVertical ? node.offsetHeight : node.offsetWidth;
      const nodeEnd = offset + nodeSize;
      const nodeCenter = offset + (nodeSize / 2);

      const isVisible = nodeEnd > viewportStart && offset < viewportEnd;

      if (isVisible) {
        if (firstVisible === -1) firstVisible = index + 1;
        lastVisible = index + 1;
      }

      const distance = Math.abs(viewportCenter - nodeCenter);
      if (distance < minDistance) {
        minDistance = distance;
        centeredIdx = index + 1;
      }
    });

    setStats({
      total: sortedIds.length,
      visibleRange: [
        firstVisible === -1 ? 0 : firstVisible, 
        lastVisible === -1 ? 0 : lastVisible
      ],
      centeredIndex: centeredIdx,
      progress: Math.min(100, Math.max(0, progress)),
    });
  }, [containerRef, nodeRefs, sortedIds, isVertical]);

  useEffect(() => {
    const container = isVertical ? window : containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      frameId.current = requestAnimationFrame(updateProgress);
    };

    updateProgress();

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    
    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [updateProgress, sortedIds, isVertical]);

  return stats;
};
