import { Box, Heading } from "@chakra-ui/react";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";
function App() {
  return (
    <Box>
      <Heading>React Video Chat</Heading>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </Box>
  );
}

export default App;
