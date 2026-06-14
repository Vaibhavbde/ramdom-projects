import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function VideoComp() {
  const { roomID } = useParams();
  const containerRef = useRef(null);

  useEffect(() => {
    const initMeeting = async (element) => {
      if (!roomID || !element) return;

      // ✅ Load credentials from .env
      const appID = Number(import.meta.env.VITE_ZEGO_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

      if (!appID || !serverSecret) {
        console.error("❌ Missing ZEGOCLOUD credentials. Please check your .env file.");
        return;
      }

      try {
        // ✅ Generate token
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          roomID,
          Date.now().toString(),
          "Anonymous"
        );

        // ✅ Create Zego instance and join room
        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: element,
          sharedLinks: [
            {
              name: "Personal link",
              url: `${window.location.origin}/room/${roomID}?roomID=${roomID}`,
            },
          ],
          scenario: {
            mode: ZegoUIKitPrebuilt.GroupCall, // 👈 Change to OneONoneCall for 1:1
          },
        });
      } catch (error) {
        console.error("🚨 Error initializing meeting:", error);
      }
    };

    initMeeting(containerRef.current);

    // ✅ Cleanup when component unmounts
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, [roomID]);

  return (
    <div
      className="myCallContainer"
      ref={containerRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
}

export default VideoComp;
