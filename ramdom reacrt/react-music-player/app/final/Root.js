import React, { useState, useEffect } from "react";
import { ConfigProvider } from "antd";
import { MUSIC_LIST } from "./config/config";
import { randomRange } from "./utils/util";
const PubSub = require("pubsub-js");

import PlayerPage from "./page/player";
import ListPage from "./page/list";
import Logo from "./components/logo";

const App = ({ children }) => {
  const [musicList, setMusicList] = useState([]);
  const [currentMusitItem, setCurrentMusitItem] = useState({});
  const [repeatType, setRepeatType] = useState("cycle");
  const [loading, setLoading] = useState(true);
  const [songLoading, setSongLoading] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery || searchQuery.trim() === "") {
      // Reset to default songs if search is empty
      fetchSongs();
      return;
    }

    try {
      setLoading(true);
      const JAMENDO_CLIENT_ID = "55e6a3f0";
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&search=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await response.json();

      if (data && data.results) {
        const songs = data.results.map((song, index) => ({
          id: index + 1,
          title: song.name || "Unknown Title",
          artist: song.artist_name || "Unknown Artist",
          file: song.audio || "",
          cover: song.album_image || "https://via.placeholder.com/200",
        }));

        setMusicList(songs);

        if (songs.length > 0 && !currentMusitItem.id) {
          setCurrentMusitItem(songs[0]);
        }
      }
    } catch (error) {
      console.error("Error searching songs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const JAMENDO_CLIENT_ID = "55e6a3f0"; // Free client ID for testing
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=20&order=popularity_total`
      );
      const data = await response.json();

      if (data && data.results) {
        const songs = data.results.map((song, index) => ({
          id: index + 1,
          title: song.name || "Unknown Title",
          artist: song.artist_name || "Unknown Artist",
          file: song.audio || "",
          cover: song.album_image || "https://via.placeholder.com/200",
        }));

        setMusicList(songs);

        if (songs.length > 0) {
          setCurrentMusitItem(songs[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      // Fallback to default music list
      setMusicList(MUSIC_LIST);
      if (MUSIC_LIST.length > 0) {
        setCurrentMusitItem(MUSIC_LIST[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  useEffect(() => {
    // Set first song on mount
    if (musicList.length > 0 && !currentMusitItem.id && !loading) {
      setCurrentMusitItem(musicList[0]);
    }
  }, [musicList, loading]);

  useEffect(() => {
    if (!loading && musicList.length > 0) {
      // Initialize jPlayer
      $("#player").jPlayer({
        supplied: "mp3",
        wmode: "window",
        useStateClassSkin: true,
      });

      // Set first song (don't autoplay to avoid browser restrictions)
      if (currentMusitItem.id && currentMusitItem.file) {
        $("#player").jPlayer("setMedia", {
          mp3: currentMusitItem.file,
        });
      }

      // Bind loading events
      $("#player").bind($.jPlayer.event.loadstart, () => {
        setSongLoading(true);
      });

      $("#player").bind($.jPlayer.event.canplay, () => {
        setSongLoading(false);
      });

      $("#player").bind($.jPlayer.event.error, () => {
        setSongLoading(false);
      });
    }
  }, [loading, currentMusitItem]);

  const playWhenEnd = () => {
    if (repeatType === "random") {
      const index = findMusicIndex(currentMusitItem);
      let randomIndex = randomRange(0, musicList.length - 1);
      while (randomIndex === index && musicList.length > 1) {
        randomIndex = randomRange(0, musicList.length - 1);
      }
      playMusic(musicList[randomIndex]);
    } else if (repeatType === "once") {
      playMusic(currentMusitItem);
    } else {
      playNext();
    }
  };

  const playNext = (type = "next") => {
    let index = findMusicIndex(currentMusitItem);
    if (type === "next") {
      index = (index + 1) % musicList.length;
    } else {
      index = (index + musicList.length - 1) % musicList.length;
    }
    const musicItem = musicList[index];
    playMusic(musicItem);
  };

  const findMusicIndex = (music) => {
    const index = musicList.indexOf(music);
    return Math.max(0, index);
  };

  useEffect(() => {
    // Bind ended event
    $("#player").bind($.jPlayer.event.ended, () => {
      playWhenEnd();
    });

    // Subscribe to events
    const playMusicToken = PubSub.subscribe("PLAY_MUSIC", (msg, item) => {
      playMusic(item);
    });

    const delMusicToken = PubSub.subscribe("DEL_MUSIC", (msg, item) => {
      setMusicList((prevList) => prevList.filter((music) => music !== item));
    });

    const playNextToken = PubSub.subscribe("PLAY_NEXT", () => {
      playNext();
    });

    const playPrevToken = PubSub.subscribe("PLAY_PREV", () => {
      playNext("prev");
    });

    const changeRepeatToken = PubSub.subscribe("CHANAGE_REPEAT", () => {
      const repeatList = ["cycle", "once", "random"];
      setRepeatType((prevType) => {
        const index = repeatList.indexOf(prevType);
        return repeatList[(index + 1) % repeatList.length];
      });
    });

    // Cleanup
    return () => {
      $("#player").unbind($.jPlayer.event.ended);
      PubSub.unsubscribe(playMusicToken);
      PubSub.unsubscribe(delMusicToken);
      PubSub.unsubscribe(changeRepeatToken);
      PubSub.unsubscribe(playNextToken);
      PubSub.unsubscribe(playPrevToken);
    };
  }, [musicList, currentMusitItem, repeatType]);

  const getLightGradientForSong = (songId) => {
    const lightGradients = [
      "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)", // Dark purple/blue
      "linear-gradient(135deg, #6b2c4f 0%, #4a1d34 100%)", // Dark pink
      "linear-gradient(135deg, #1e3a5f 0%, #0f2942 100%)", // Dark cyan
      "linear-gradient(135deg, #1e4d3c 0%, #0f3028 100%)", // Dark green/teal
      "linear-gradient(135deg, #6b3a1e 0%, #4a2611 100%)", // Dark orange/yellow
      "linear-gradient(135deg, #2c3e6b 0%, #1a2447 100%)", // Dark blue/purple
    ];
    return (
      lightGradients[(songId - 1) % lightGradients.length] || lightGradients[0]
    );
  };

  const playMusic = (item) => {
    if (!item || !item.file) return;

    setSongLoading(true);
    setCurrentMusitItem(item);

    try {
      // Use setTimeout to ensure React state updates first
      setTimeout(() => {
        $("#player")
          .jPlayer("stop") // Stop current playback first
          .jPlayer("clearMedia") // Clear previous media
          .jPlayer("setMedia", {
            mp3: item.file,
          })
          .jPlayer("play"); // Then play
      }, 50);
    } catch (error) {
      console.log("Playback error:", error);
      setSongLoading(false);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#667eea",
          borderRadius: 8,
        },
      }}
    >
      <div
        style={{
          margin: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Logo />
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "50%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: "40px",
              padding: "20px",
              overflow: "hidden",
              background: currentMusitItem.id
                ? getLightGradientForSong(currentMusitItem.id)
                : "linear-gradient(135deg, #a8b5f5 0%, #c5a3e8 100%)",
              transition: "background 0.8s ease-in-out",
            }}
          >
            <PlayerPage
              currentMusitItem={currentMusitItem}
              repeatType={repeatType}
              songLoading={songLoading}
              currentBackground={
                currentMusitItem.id
                  ? getLightGradientForSong(currentMusitItem.id)
                  : "linear-gradient(135deg, #a8b5f5 0%, #c5a3e8 100%)"
              }
            />
          </div>
          <div
            style={{
              width: "50%",
              borderLeft: "1px solid #e0e0e0",
              overflow: "auto",
              background: "#fafafa",
            }}
          >
            <ListPage
              musicList={musicList}
              currentMusitItem={currentMusitItem}
              onSearch={handleSearch}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

const Root = () => {
  return <App />;
};

export default Root;
