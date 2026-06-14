import React from "react";
import { Card, Avatar, Typography, Button, Space } from "antd";
import {
  PlayCircleFilled,
  DeleteOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import "./listitem.less";
const PubSub = require("pubsub-js");

const { Text, Title } = Typography;

const ListItem = ({ data, focus }) => {
  const deleteHandler = (item, event) => {
    event.stopPropagation();
    PubSub.publish("DEL_MUSIC", item);
  };

  const playMusic = (item) => {
    PubSub.publish("PLAY_MUSIC", item);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      style={{ marginBottom: 16 }}
    >
      <Card
        hoverable
        onClick={() => playMusic(data)}
        style={{
          borderRadius: 12,
          overflow: "hidden",
          border: focus ? "2px solid #667eea" : "1px solid #f0f0f0",
          background: focus
            ? "linear-gradient(135deg, #667eea15 0%, #764ba215 100%)"
            : "white",
          boxShadow: focus
            ? "0 4px 20px rgba(102, 126, 234, 0.3)"
            : "0 2px 8px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Avatar
            src={data.cover}
            size={64}
            shape="square"
            style={{ borderRadius: 8 }}
            icon={<CustomerServiceOutlined />}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <Title
              level={5}
              style={{ margin: 0, color: focus ? "#667eea" : "#1a1a1a" }}
              ellipsis
            >
              {focus && <PlayCircleFilled style={{ marginRight: 8 }} />}
              {data.title}
            </Title>
            <Text type="secondary" ellipsis>
              {data.artist}
            </Text>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default ListItem;
