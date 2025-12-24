import { useEffect, useRef } from "react";

export const useAnimationFrameLoop = (isEnabled, onFrame) => {
  const animationFrameIdRef = useRef(0);
  const lastTimestampRef = useRef(0);

  useEffect(() => {
    if (!isEnabled) return undefined;

    lastTimestampRef.current = performance.now();

    const onAnimationFrame = (currentTimestamp) => {
      const deltaTimeInSeconds = Math.min(
        0.05,
        (currentTimestamp - lastTimestampRef.current) / 1000,
      );

      lastTimestampRef.current = currentTimestamp;
      onFrame(deltaTimeInSeconds, currentTimestamp);

      animationFrameIdRef.current = requestAnimationFrame(onAnimationFrame);
    };

    animationFrameIdRef.current = requestAnimationFrame(onAnimationFrame);

    return () => cancelAnimationFrame(animationFrameIdRef.current);
  }, [isEnabled, onFrame]);
};
