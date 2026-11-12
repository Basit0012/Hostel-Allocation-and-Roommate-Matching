import React, { useCallback, useRef, useState } from 'react';

interface RippleWave {
  id: number;
  x: number;
  y: number;
  size: number;
}

export function useM3Ripple() {
  const [ripples, setRipples] = useState<RippleWave[]>([]);
  const nextId = useRef(1);

  const triggerRipple = useCallback((event: React.MouseEvent<HTMLElement> | React.PointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const isKeyboardOrigin = event.clientX === 0 && event.clientY === 0;
    const x = isKeyboardOrigin ? rect.width / 2 : event.clientX - rect.left;
    const y = isKeyboardOrigin ? rect.height / 2 : event.clientY - rect.top;

    const dx = Math.max(x, rect.width - x);
    const dy = Math.max(y, rect.height - y);
    const size = Math.ceil(Math.hypot(dx, dy) * 2.15);
    const id = nextId.current++;

    setRipples((prev) => [...prev.slice(-3), { id, x, y, size }]);
    window.setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 520);
  }, []);

  return { ripples, triggerRipple };
}

interface RippleOverlayProps {
  ripples: RippleWave[];
  color?: string;
}

export const RippleOverlay: React.FC<RippleOverlayProps> = ({
  ripples,
  color = 'currentColor',
}) => {
  return (
    <span className="m3-ripple-container" aria-hidden="true">
      {ripples.map((wave) => (
        <span
          key={wave.id}
          className="m3-ripple-wave"
          style={{
            left: `${wave.x}px`,
            top: `${wave.y}px`,
            width: `${wave.size}px`,
            height: `${wave.size}px`,
            backgroundColor: color,
          }}
        />
      ))}
    </span>
  );
};

