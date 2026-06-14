import React, { useState, useEffect } from "react";
import { Card, Typography, Space, Avatar } from "antd";
import {
  PlayCircleFilled,
  PauseCircleFilled,
  StepBackwardFilled,
  StepForwardFilled,
  SoundFilled,
  RetweetOutlined,
  ReloadOutlined,
  SwapOutlined,
  LoadingOutlined,
  PlusOutlined,
  MinusOutlined,
} from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";
import Progress from "../components/progress";
import Waveform from "../components/waveform";

const PubSub = require("pubsub-js");
import "./player.less";

const { Title, Text } = Typography;

let duration = null;

const Player = ({
  currentMusitItem = {},
  repeatType = "cycle",
  songLoading = false,
  currentBackground = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
}) => {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0);
  const [isPlay, setIsPlay] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [totalDuration, setTotalDuration] = useState("0:00");

  useEffect(() => {
    const handleTimeUpdate = (e) => {
      duration = e.jPlayer.status.duration;
      const currentSeconds =
        (duration * e.jPlayer.status.currentPercentAbsolute) / 100;

      setProgress(e.jPlayer.status.currentPercentAbsolute);
      setVolume(e.jPlayer.options.volume * 100);
      setCurrentTime(formatTime(currentSeconds));
      setTotalDuration(formatTime(duration));
    };

    const handlePlay = () => {
      setIsPlay(true);
    };

    const handlePause = () => {
      setIsPlay(false);
    };

    $("#player").bind($.jPlayer.event.timeupdate, handleTimeUpdate);
    $("#player").bind($.jPlayer.event.play, handlePlay);
    $("#player").bind($.jPlayer.event.pause, handlePause);

    return () => {
      $("#player").unbind($.jPlayer.event.timeupdate);
      $("#player").unbind($.jPlayer.event.play);
      $("#player").unbind($.jPlayer.event.pause);
    };
  }, []);

  const formatTime = (time) => {
    time = Math.floor(time);
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" + seconds : seconds}`;
  };

  const changeProgressHandler = (progressValue) => {
    $("#player").jPlayer("play", duration * progressValue);
    setIsPlay(true);
  };

  const changeVolumeHandler = (volumeValue) => {
    $("#player").jPlayer("volume", volumeValue);
    setVolume(volumeValue * 100);
  };

  const increaseVolume = () => {
    const newVolume = Math.min(volume + 10, 100);
    $("#player").jPlayer("volume", newVolume / 100);
    setVolume(newVolume);
  };

  const decreaseVolume = () => {
    const newVolume = Math.max(volume - 10, 0);
    $("#player").jPlayer("volume", newVolume / 100);
    setVolume(newVolume);
  };

  const play = () => {
    if (isPlay) {
      $("#player").jPlayer("pause");
    } else {
      $("#player").jPlayer("play");
    }
    setIsPlay(!isPlay);
  };

  const next = () => {
    PubSub.publish("PLAY_NEXT");
  };

  const prev = () => {
    PubSub.publish("PLAY_PREV");
  };

  const changeRepeat = () => {
    PubSub.publish("CHANAGE_REPEAT");
  };

  const getRepeatIcon = () => {
    switch (repeatType) {
      case "once":
        return <ReloadOutlined style={{ fontSize: 28, cursor: "pointer" }} />;
      case "random":
        return <SwapOutlined style={{ fontSize: 28, cursor: "pointer" }} />;
      default:
        return <RetweetOutlined style={{ fontSize: 28, cursor: "pointer" }} />;
    }
  };

  return (
    <div
      className="player-page"
      style={{
        padding: "10px",
        minHeight: "50vh",
        // background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title level={2} style={{ color: "white", marginBottom: 30 }}>
          My Music Player
        </Title>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentMusitItem.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
        >
          <Card
            style={{
              maxWidth: 800,
              margin: "0 auto",
              borderRadius: 20,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
              background: "rgba(220, 220, 220, 0.35)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              transition: "all 0.8s ease-in-out",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              position: "relative",
            }}
            bordered={false}
          >
            {/* Lottie Waveform Animation */}
            <Waveform isPlaying={isPlay} />

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 15,
                padding: "15px",
                position: "relative",
                zIndex: 2,
              }}
            >
              {/* Album Cover */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                style={{ position: "relative" }}
              >
                <Avatar
                  src={currentMusitItem.cover}
                  size={200}
                  shape="square"
                  style={{
                    borderRadius: 15,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    filter: songLoading ? "brightness(0.5)" : "brightness(1)",
                    transition: "filter 0.3s ease",
                  }}
                />
                {songLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 10,
                    }}
                  >
                    <LoadingOutlined
                      style={{
                        fontSize: 48,
                        color: "#ffffff",
                      }}
                      spin
                    />
                  </motion.div>
                )}
              </motion.div>

              {/* Controls Section */}
              <div style={{ width: "100%", maxWidth: 500 }}>
                <Space
                  direction="vertical"
                  size="medium"
                  style={{ width: "100%" }}
                >
                  {/* Song Info */}
                  <div style={{ textAlign: "center" }}>
                    <Title level={3} style={{ margin: 0, color: "#ffffff" }}>
                      {currentMusitItem.title || "No Song Selected"}
                    </Title>
                    <Text
                      style={{
                        fontSize: 16,
                        color: "rgba(255, 255, 255, 0.85)",
                      }}
                    >
                      {currentMusitItem.artist || "Unknown Artist"}
                    </Text>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <Progress
                      progress={progress}
                      onProgressChange={changeProgressHandler}
                      barColor="#ffffff"
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: "rgba(255, 255, 255, 0.85)",
                          fontSize: 14,
                        }}
                      >
                        {currentTime}
                      </Text>
                      <Text
                        style={{
                          color: "rgba(255, 255, 255, 0.85)",
                          fontSize: 14,
                        }}
                      >
                        {totalDuration}
                      </Text>
                    </div>
                  </div>

                  {/* Playback Controls */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <StepBackwardFilled
                        onClick={prev}
                        style={{
                          fontSize: 40,
                          color: "#ffffff",
                          cursor: "pointer",
                        }}
                      />
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isPlay ? (
                        <PauseCircleFilled
                          onClick={play}
                          style={{
                            fontSize: 64,
                            color: "#ffffff",
                            cursor: "pointer",
                          }}
                        />
                      ) : (
                        <PlayCircleFilled
                          onClick={play}
                          style={{
                            fontSize: 64,
                            color: "#ffffff",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <StepForwardFilled
                        onClick={next}
                        style={{
                          fontSize: 40,
                          color: "#ffffff",
                          cursor: "pointer",
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Volume and Repeat */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 15,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flex: 1,
                      }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MinusOutlined
                          onClick={decreaseVolume}
                          style={{
                            fontSize: 16,
                            color: "#ffffff",
                            cursor: "pointer",
                          }}
                        />
                      </motion.div>
                      <SoundFilled style={{ fontSize: 20, color: "#ffffff" }} />
                      <div style={{ flex: 1 }}>
                        <Progress
                          progress={volume}
                          onProgressChange={changeVolumeHandler}
                          barColor="#ffffff"
                        />
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <PlusOutlined
                          onClick={increaseVolume}
                          style={{
                            fontSize: 16,
                            color: "#ffffff",
                            cursor: "pointer",
                          }}
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 180 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={changeRepeat}
                      style={{ color: "#ffffff" }}
                    >
                      {getRepeatIcon()}
                    </motion.div>
                  </div>
                </Space>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Player;
