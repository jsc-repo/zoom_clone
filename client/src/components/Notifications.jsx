import { Box, Button, Heading } from "@chakra-ui/react";
import { useSocketStore } from "../socketStore";

const Notifications = () => {
  const answerCall = useSocketStore((state) => state.answerCall);
  const call = useSocketStore((state) => state.call);
  const callAccepted = useSocketStore((state) => state.callAccepted);

  return (
    <Box>
      {call.isReceivedCall && !callAccepted && (
        <Box>
          <Heading>{call.name} is calling. . .</Heading>
          <Button colorScheme="blue" onClick={answerCall}>
            Answer
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Notifications;
