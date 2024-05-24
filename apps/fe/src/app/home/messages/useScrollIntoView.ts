import { useEffect, useRef } from 'react';

export const useScrollIntoView = ({ text }: { text: string }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [text]);

  return { ref };
};
