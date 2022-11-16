import { Button, FormControl, FormLabel, Input, Box } from "@chakra-ui/react";
import { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useSocketStore } from "../socketStore";

const Options = ({ children }) => {
  const me = useSocketStore((state) => state.me);
  const callAccepted = useSocketStore((state) => state.callAccepted);
  const callEnded = useSocketStore((state) => state.callEnded);
  const name = useSocketStore((state) => state.name);
  const setName = useSocketStore((state) => state.setName);
  const leaveCall = useSocketStore((state) => state.leaveCall);
  const callUser = useSocketStore((state) => state.callUser);

  const [idToCall, setIdToCall] = useState("");

  return (
    <Box>
      <FormControl isRequired>
        <FormLabel>Account Info</FormLabel>
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <CopyToClipboard text={me}>
          <Button colorScheme="blue">Copy ID </Button>
        </CopyToClipboard>

        <FormLabel>Make a call</FormLabel>
        <Input
          label="ID to call"
          value={idToCall}
          onChange={(e) => setIdToCall(e.target.value)}
        />
        {callAccepted && !callEnded ? (
          <Button colorScheme="red" onClick={leaveCall}>
            Hang Up
          </Button>
        ) : (
          <Button colorScheme="blue" onClick={() => callUser(idToCall)}>
            Call
          </Button>
        )}
      </FormControl>

      {children}
    </Box>
  );
};

export default Options;
