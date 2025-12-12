import { useEffect, useRef } from "react";
import "./index.css";

const LottieIcon = ({
  src,
  ariaLabel,
  loop = true,
  autoplay = true,
  size = 168,
  className = "",
}) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) return;

    if (ariaLabel) {
      playerRef.current.setAttribute("aria-label", ariaLabel);
    }

    playerRef.current.setAttribute("loop", loop ? "" : null);
    playerRef.current.setAttribute("autoplay", autoplay ? "" : null);

    if (typeof playerRef.current.load === "function") {
      playerRef.current.load(src);
    } else {
      playerRef.current.setAttribute("src", src);
    }
  }, [src, loop, autoplay, ariaLabel]);

  return (
    <div
      className={`lottie_icon ${className}`.trim()}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <lottie-player
        ref={playerRef}
        src={src}
        background="transparent"
        loop
        autoplay
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default LottieIcon;
