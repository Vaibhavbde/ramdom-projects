import React, { useState, useEffect } from "react";
import {
  Typography,
  Empty,
  AutoComplete,
  Input,
  Spin,
  Skeleton,
  Card,
} from "antd";
import { motion } from "framer-motion";
import {
  CustomerServiceOutlined,
  SearchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import ListItem from "../components/listItem";

const { Title } = Typography;

const List = ({
  musicList = [],
  currentMusitItem,
  onSearch,
  loading = false,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const fetchSuggestions = async (query) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      setLoadingSuggestions(true);
      const JAMENDO_CLIENT_ID = "55e6a3f0";
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=10&search=${encodeURIComponent(
          query
        )}`
      );
      const data = await response.json();

      if (data && data.results) {
        const options = data.results.map((song) => ({
          value: song.name,
          label: (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img
                src={song.album_image || "https://via.placeholder.com/40"}
                alt={song.name}
                style={{ width: 40, height: 40, borderRadius: 4 }}
              />
              <div>
                <div style={{ fontWeight: 500 }}>{song.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>
                  {song.artist_name}
                </div>
              </div>
            </div>
          ),
        }));
        setSuggestions(options);
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchValue) {
        fetchSuggestions(searchValue);
      }
    }, 300); // Debounce

    return () => clearTimeout(timeoutId);
  }, [searchValue]);

  const handleSearch = (value) => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSelect = (value) => {
    setSearchValue(value);
    handleSearch(value);
  };

  const LoadingSkeleton = () => (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Card
          key={i}
          style={{
            marginBottom: 16,
            borderRadius: 12,
            background: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <Skeleton.Input active style={{ width: 200, marginBottom: 8 }} />
          <Skeleton.Input active style={{ width: 150 }} size="small" />
        </Card>
      ))}
    </div>
  );

  // Show loading animation while fetching songs
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "#e8eaf6",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: "20px",
            borderBottom: "2px solid rgba(0,0,0,0.1)",
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Title level={2} style={{ margin: "0 0 16px 0", color: "#1a1a1a" }}>
            🎵 My Playlist
          </Title>
        </motion.div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />}
            tip="Loading your music..."
            size="large"
          >
            <div style={{ padding: 50 }}>
              <LoadingSkeleton />
            </div>
          </Spin>
        </div>
      </div>
    );
  }

  if (!musicList || musicList.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          background: "#e8eaf6",
        }}
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            padding: "20px",
            borderBottom: "2px solid rgba(0,0,0,0.1)",
            background: "rgba(255, 255, 255, 0.5)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Title level={2} style={{ margin: "0 0 16px 0", color: "#1a1a1a" }}>
            🎵 My Playlist
          </Title>
        </motion.div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 40,
          }}
        >
          <Empty
            image={
              <CustomerServiceOutlined
                style={{ fontSize: 64, color: "#ccc" }}
              />
            }
            description="No music in your playlist"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        background: "#e8eaf6",
      }}
    >
      {/* Static Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: "20px",
          borderBottom: "2px solid rgba(0,0,0,0.1)",
          background: "rgba(255, 255, 255, 0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Title level={2} style={{ margin: "0 0 16px 0", color: "#1a1a1a" }}>
          🎵 My Playlist ({musicList.length} songs)
        </Title>
        <AutoComplete
          value={searchValue}
          options={suggestions}
          onSelect={handleSelect}
          onSearch={(value) => setSearchValue(value)}
          onChange={(value) => setSearchValue(value)}
          placeholder="Search for songs..."
          size="large"
          style={{
            maxWidth: 500,
            width: "100%",
          }}
          notFoundContent={
            loadingSuggestions ? (
              <Spin size="small" />
            ) : searchValue.length >= 2 ? (
              "No songs found"
            ) : null
          }
        >
          <Input
            suffix={
              <SearchOutlined
                onClick={() => handleSearch(searchValue)}
                style={{ cursor: "pointer", color: "#1890ff" }}
              />
            }
            onPressEnter={() => handleSearch(searchValue)}
            allowClear
          />
        </AutoComplete>
      </motion.div>

      {/* Scrollable Song List */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          padding: "20px",
        }}
      >
        {loading ? (
          <Spin
            indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
            tip="Loading songs..."
            size="large"
          >
            <LoadingSkeleton />
          </Spin>
        ) : (
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {musicList.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem
                  data={item}
                  focus={currentMusitItem?.id === item.id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
