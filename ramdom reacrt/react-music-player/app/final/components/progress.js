import React, { useRef } from "react";
import { Slider } from "antd";
import { motion } from "framer-motion";
import "./progress.less";

const Progress = ({ progress = 0, barColor = "#2f9842", onProgressChange }) => {
  const progressBarRef = useRef(null);

  const handleClick = (e) => {
    if (!progressBarRef.current) return;
    const progressBar = progressBarRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / progressBar.clientWidth;
    const calculatedProgress = Math.max(0, Math.min(100, clickPosition * 100));

    if (onProgressChange) {
      onProgressChange(calculatedProgress / 100);
    }
  };

  return (
    <motion.div
      className="components-progress"
      ref={progressBarRef}
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ cursor: "pointer" }}
    >
      <motion.div
        className="progress"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{ background: barColor }}
      />
    </motion.div>
  );
};

export default Progress;
