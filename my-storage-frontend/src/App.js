import React from "react";
import { Box } from "@mui/system";
import Root from "./routes/Root";
import UploadProvider from "./context/UploadContext";

const App = () => {

  return (
    <Box 
        sx={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <UploadProvider>
          <Root />
        </UploadProvider>
    </Box>
  );
}

export default App;
