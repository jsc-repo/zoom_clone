import { Container, Heading } from "@chakra-ui/react";
import Notifications from "./components/Notifications";
import Options from "./components/Options";
import VideoPlayer from "./components/VideoPlayer";
function App() {
  return (
    <Container maxW="xxl">
      <Heading mb={5}>React Video Chat</Heading>
      <VideoPlayer />
      <Options>
        <Notifications />
      </Options>
    </Container>
  );
}

export default App;
