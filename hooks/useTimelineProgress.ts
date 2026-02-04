
import React, { useState, useEffect, useCallback, useRef } from 'react';

export interface TimelineProgress {
  total: number;
  visibleRange: [number, number]; // [Start Index, End Index], 1-based
  centeredIndex: number; // 1-based
  progress: number; // 0 to 100
}

/**
 * Tracks scroll progress and item visibility for a horizontal timeline.
 * Ensures all indices are 1-based for UI display.
 */
// Added React to imports to resolve namespace errors for RefObject and MutableRefObject
export const useTimelineProgress = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  nodeRefs: React.MutableRefObject<Map<string, HTMLDivElement>>,
  sortedIds: string[]
): TimelineProgress => {
  const [stats, setStats] = useState<TimelineProgress>({
    total: 0,
    visibleRange: [0, 0],
    centeredIndex: 0,
    progress: 0,
  });

  const frameId = useRef<number | null>(null);

  const updateProgress = useCallback(() => {
    const container = containerRef.current;
    
    // Handle empty state gracefully
    if (!container || sortedIds.length === 0) {
      setStats({
        total: 0,
        visibleRange: [0, 0],
        centeredIndex: 0,
        progress: 0,
      });
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    
    // 1. Calculate Scroll Progress (Percentage of scrollable area)
    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;

    // 2. Identification Logic
    const containerCenter = scrollLeft + clientWidth / 2;
    let firstVisible = -1;
    let lastVisible = -1;
    let minDistance = Infinity;
    let centeredIdx = 0;

    sortedIds.forEach((id, index) => {
      const node = nodeRefs.current.get(id);
      if (!node) return;

      // Accumulate offsets through the DOM tree until we reach the scroll container
      // This is necessary because nodes are nested inside YearBlock containers
      let offsetLeft = 0;
      let curr: HTMLElement | null = node;
      while (curr && curr !== container) {
        offsetLeft += curr.offsetLeft;
        curr = curr.offsetParent as HTMLElement;
      }
      
      const nodeWidth = node.offsetWidth;
      const nodeRight = offsetLeft + nodeWidth;
      const nodeCenter = offsetLeft + (nodeWidth / 2);

      // Determine visibility overlap with the current viewport [scrollLeft, scrollLeft + clientWidth]
      const isVisible = nodeRight > scrollLeft && offsetLeft < scrollLeft + clientWidth;

      if (isVisible) {
        // Capture first and last visible items using human-friendly 1-based index
        if (firstVisible === -1) firstVisible = index + 1;
        lastVisible = index + 1;
      }

      // Find item closest to the visual center of the viewport
      const distance = Math.abs(containerCenter - nodeCenter);
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
  }, [containerRef, nodeRefs, sortedIds]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const onScroll = () => {
      if (frameId.current) cancelAnimationFrame(frameId.current);
      frameId.current = requestAnimationFrame(updateProgress);
    };

    // Immediate calculation on mount or sortedIds change
    updateProgress();

    container.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateProgress);
    
    return () => {
      container.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateProgress);
      if (frameId.current) cancelAnimationFrame(frameId.current);
    };
  }, [updateProgress, sortedIds]);

  return stats;
};
