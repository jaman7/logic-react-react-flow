import { useEffect, useRef, useState } from 'react';

const useResizeObserver = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        const { width, height } = entry.contentRect;

        setSize((prevSize) => {
          if (prevSize.width !== width || prevSize.height !== height) {
            return { width, height };
          }
          return prevSize;
        });
      }
    });

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return { ref, size };
};

export default useResizeObserver;
