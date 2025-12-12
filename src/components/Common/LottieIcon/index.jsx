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
    const player = playerRef.current;
    if (!player) return;

    const applySettings = () => {
      if (ariaLabel) {
        player.setAttribute("aria-label", ariaLabel);
      } else {
        player.removeAttribute("aria-label");
      }

      if (loop) {
        player.setAttribute("loop", "");
      } else {
        player.removeAttribute("loop");
      }

      if (autoplay) {
        player.setAttribute("autoplay", "");
      } else {
        player.removeAttribute("autoplay");
      }

      if (typeof player.load === "function") {
        player.load(src);
      } else {
        player.setAttribute("src", src);
      }
    };

    const ensureLottieReady = async () => {
      if (window.customElements?.get("lottie-player")) {
        applySettings();
        return;
      }

      const existingScript = document.querySelector(
        "script[data-lottie-player-script]"
      );

      if (!existingScript) {
        const script = document.createElement("script");
        script.src =
          "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
        script.async = true;
        script.dataset.lottiePlayerScript = "true";
        document.head.appendChild(script);
      }

      try {
        await window.customElements?.whenDefined("lottie-player");
        applySettings();
      } catch (e) {
        console.error("lottie-player load failed", e);
      }
    };

    ensureLottieReady();
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
