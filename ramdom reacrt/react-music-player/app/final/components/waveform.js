import React, { useRef, useEffect } from "react";
import Lottie from "lottie-react";
import voiceAnimation from "../../../static/Voice.json";

const Waveform = ({ isPlaying = false }) => {
  const lottieRef = useRef(null);

  useEffect(() => {
    if (lottieRef.current) {
      if (isPlaying) {
        lottieRef.current.play();
      } else {
        lottieRef.current.stop();
      }
    }
  }, [isPlaying]);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "250px",
        height: "250px",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={voiceAnimation}
        loop={true}
        autoplay={false}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default Waveform;
