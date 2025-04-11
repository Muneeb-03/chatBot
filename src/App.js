import React, { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import {
  saveChatsToStorage,
  loadChatsFromStorage,
} from "./services/storageService";

const drawerWidth = 320;

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a1a1a",
    },
    background: {
      default: "#ffffff",
    },
  },
  typography: {
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
  },
});

function App() {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const savedChats = loadChatsFromStorage();
    if (savedChats.length > 0) {
      setChats(savedChats);
      setCurrentChat(savedChats[0]);
    } else {
      createNewChat();
    }
  }, []);

  useEffect(() => {
    if (chats.length > 0) {
      saveChatsToStorage(chats);
    }
  }, [chats]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const createNewChat = () => {
    const newChat = {
      id: Date.now(),
      messages: [],
    };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
  };

  const deleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);

    if (currentChat && currentChat.id === chatId) {
      setCurrentChat(updatedChats.length > 0 ? updatedChats[0] : null);
    }
  };

  const updateCurrentChat = (updatedChat) => {
    setCurrentChat(updatedChat);

    const updatedChats = chats.map((chat) =>
      chat.id === updatedChat.id ? updatedChat : chat
    );
    setChats(updatedChats);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <Sidebar
          chats={chats}
          createNewChat={createNewChat}
          setCurrentChat={setCurrentChat}
          deleteChat={deleteChat}
          open={sidebarOpen}
          width={drawerWidth}
          currentChatId={currentChat?.id}
        />
        <Box
          sx={{
            flexGrow: 1,
            width: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
            transition: (theme) =>
              theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
              }),
            position: "absolute",
            right: 0,
            height: "100%",
          }}
        >
          <ChatArea
            currentChat={currentChat}
            updateCurrentChat={updateCurrentChat}
            sidebarOpen={sidebarOpen}
            toggleSidebar={toggleSidebar}
            drawerWidth={drawerWidth}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
