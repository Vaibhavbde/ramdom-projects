import React from "react";
import { motion } from "framer-motion";
import { CustomerServiceOutlined } from "@ant-design/icons";
import "./logo.less";

const Logo = () => {
  return (
    <motion.div
      className="components-logo"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "20px",
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
      >
        <CustomerServiceOutlined style={{ fontSize: 40, color: "white" }} />
      </motion.div>
      <h1
        style={{
          margin: 0,
          color: "white",
          fontSize: 24,
          fontWeight: 600,
          textShadow: "0 2px 10px rgba(0,0,0,0.2)",
        }}
      >
        Modern Music Player
      </h1>
    </motion.div>
  );
};

export default Logo;
