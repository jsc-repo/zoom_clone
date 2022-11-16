import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { useSocketStore } from "../socketStore";

const VideoPlayer = () => {
  const myVideo = useRef();
  const userVideo = useRef();

  const getPermission = useSocketStore((state) => state.getPermission);
  const name = useSocketStore((state) => state.name);
  const callAccepted = useSocketStore((state) => state.callAccepted);
  const callEnded = useSocketStore((state) => state.callEnded);
  const call = useSocketStore((state) => state.call);
  const stream = useSocketStore((state) => state.stream);

  const setUserVideoRef = useSocketStore((state) => state.setUserVideo);
  const setMyVideoRef = useSocketStore((state) => state.setMyVideo);

  console.log("userVideo", userVideo);

  useEffect(() => {
    getPermission();
    setMyVideoRef(myVideo);
    setUserVideoRef(userVideo);
  }, []);

  //   myVideo, userVideo

  console.log("myVideoRef", myVideo);

  return (
    // <Stack spacing={8} direction={["column", "row"]}>
    //     </Stack>
    <Flex justifyContent={"space-between"} direction={["column", "row"]}>
      {/* your video */}
      {stream && (
        <Box>
          <Heading fontSize="lg">{name || "Name"}</Heading>
          <video playsInline ref={myVideo} autoPlay muted />
        </Box>
      )}

      {callAccepted && !callEnded && (
        // other user's video
        <Box>
          <Heading fontSize="lg">{call.name || "Name"}</Heading>
          <video playsInline ref={userVideo} autoPlay />
        </Box>
      )}
    </Flex>
  );
};

export default VideoPlayer;
