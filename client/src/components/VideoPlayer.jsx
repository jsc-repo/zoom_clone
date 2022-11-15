import { Box, Heading, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSocketStore } from "../socketStore";

const VideoPlayer = () => {
  const myVideo = useSocketStore((state) => state.myVideo);
  const userVideo = useSocketStore((state) => state.userVideo);
  const getPermission = useSocketStore((state) => state.getPermission);
  const name = useSocketStore((state) => state.name);
  const callAccepted = useSocketStore((state) => state.callAccepted);
  const callEnded = useSocketStore((state) => state.callEndedame);
  const call = useSocketStore((state) => state.call);
  const stream = useSocketStore((state) => state.stream);

  useEffect(() => {
    getPermission();
  }, []);

  console.log("myVideoRef", myVideo);

  return (
    <Stack spacing={2}>
      {/* your video */}
      {stream && (
        <Box>
          <Heading fontSize="lg">{name || "Name"}</Heading>
          <video playsInline muted ref={myVideo} autoPlay />
        </Box>
      )}

      {callAccepted && !callEnded && (
        // other user's video
        <Box>
          <Heading fontSize="lg">{call.name || "Name"}</Heading>
          <video playsInline muted ref={userVideo} autoPlay />
        </Box>
      )}
    </Stack>
  );
};

export default VideoPlayer;
