import React, { useState, useRef, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HelpIcon from "@mui/icons-material/Help";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Fab from "@mui/material/Fab";
import { sendMessage, formatResponseForDisplay } from "../services/api";
const ReactMarkdown = React.lazy(() => import("react-markdown"));

function Message({ message }) {
  return (
    <Box
      sx={{
        padding: "16px",
        borderRadius: "8px",
        marginBottom: "16px",
        width: "100%",
        maxWidth: "800px",
        backgroundColor: message.role === "user" ? "#f0f0f0" : "#ffffff",
        border: message.role === "assistant" ? "1px solid #e0e0e0" : "none",
      }}
    >
      {message.role === "user" ? (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: "pre-wrap",
          }}
        >
          {message.content}
        </Typography>
      ) : (
        <React.Suspense
          fallback={<Typography variant="body1">{message.content}</Typography>}
        >
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </React.Suspense>
      )}
    </Box>
  );
}

function ChatArea({
  currentChat,
  updateCurrentChat,
  sidebarOpen,
  toggleSidebar,
  drawerWidth,
}) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [detailedMode, setDetailedMode] = useState(false);
  const messageRef = useRef(null);
  const chatContainerRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && currentChat) {
      try {
        setIsLoading(true);

        const userMessage = { role: "user", content: message };
        const updatedMessages = [...currentChat.messages, userMessage];
        const updatedChat = { ...currentChat, messages: updatedMessages };
        updateCurrentChat(updatedChat);

        const history = updatedChat.messages.slice(0, -1).map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

        const response = await sendMessage(message, history, detailedMode);

        const formattedResponse = detailedMode
          ? formatResponseForDisplay(response)
          : response.response;

        const assistantMessage = {
          role: "assistant",
          content: formattedResponse,
          raw: response,
        };

        const finalMessages = [...updatedMessages, assistantMessage];
        updateCurrentChat({ ...currentChat, messages: finalMessages });

        setMessage("");

        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
        }, 100);
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage = {
          role: "assistant",
          content: `Error: ${
            error.message ||
            "There was an error processing your request. Please try again."
          }`,
        };
        updateCurrentChat({
          ...currentChat,
          messages: [...currentChat.messages, errorMessage],
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentChat?.messages]);

  const handleDetailedModeToggle = () => {
    setDetailedMode(!detailedMode);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        position: "relative",
        transition: "all 0.3s ease",
      }}
    >
      <Box
        sx={{
          padding: "16px 24px",
          borderBottom: "1px solid #e1e1e1",
          display: "flex",
          alignItems: "center",
          justifyContent: !sidebarOpen ? "space-between" : "center",
          position: "relative",
        }}
      >
        {!sidebarOpen && (
          <IconButton onClick={toggleSidebar} size="small">
            <KeyboardArrowRightIcon />
          </IconButton>
        )}

        {sidebarOpen && (
          <IconButton
            onClick={toggleSidebar}
            size="small"
            sx={{
              position: "absolute",
              left: 16,
            }}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
        )}

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Button
            endIcon={<ExpandMoreIcon />}
            sx={{
              textTransform: "none",
              fontSize: "0.9rem",
              color: "#333",
            }}
          >
            Quick Settings
          </Button>

          <FormControlLabel
            control={
              <Switch
                checked={detailedMode}
                onChange={handleDetailedModeToggle}
                size="small"
              />
            }
            label={<Typography variant="body2">Detailed Mode</Typography>}
            sx={{ ml: 2 }}
          />
        </Box>

        {!sidebarOpen && <Box sx={{ width: 40 }} />}
      </Box>

      <Box
        ref={chatContainerRef}
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {currentChat && currentChat.messages.length > 0 ? (
          currentChat.messages.map((msg, index) => (
            <Message key={index} message={msg} />
          ))
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              height: "100%",
            }}
          >
            <Box
              sx={{
                width: 100,
                height: 100,
                bgcolor: "black",
                color: "white",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 2,
                fontWeight: "bold",
                fontSize: 30,
                mb: 2,
              }}
            >
              UI
            </Box>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                fontSize: { xs: "2.5rem", md: "3.75rem" },
              }}
            >
              Chatbot UI
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#666",
                maxWidth: "500px",
                textAlign: "center",
                mt: 2,
              }}
            >
              Start a conversation by typing your message below. Toggle detailed
              mode to see more information about the responses.
            </Typography>
          </Box>
        )}
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          padding: "16px",
          display: "flex",
          justifyContent: "center",
          borderTop: "1px solid #f0f0f0",
          paddingBottom: "24px",
          marginTop: "auto",
        }}
      >
        <Paper
          sx={{
            p: "2px",
            display: "flex",
            alignItems: "center",
            borderRadius: "24px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            width: "100%",
            maxWidth: "680px",
            position: "relative",
          }}
        >
          <IconButton
            sx={{
              p: "10px",
              color: "#767676",
            }}
          >
            <AddIcon />
          </IconButton>
          <InputBase
            sx={{
              ml: 1,
              flex: 1,
              "& .MuiInputBase-input": {
                padding: "10px 0",
              },
              fontSize: "0.95rem",
            }}
            placeholder="Ask anything. Type @ / # !"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            inputRef={messageRef}
            disabled={isLoading}
          />
          {isLoading ? (
            <CircularProgress
              size={24}
              sx={{
                m: "8px",
                color: "#1a1a1a",
              }}
            />
          ) : (
            <IconButton
              type="submit"
              sx={{
                bgcolor: message.trim() ? "#1a1a1a" : "#e0e0e0",
                color: "white",
                "&:hover": {
                  bgcolor: message.trim() ? "#333333" : "#e0e0e0",
                },
                width: 36,
                height: 36,
                m: "4px",
                borderRadius: "50%",
              }}
              disabled={!message.trim() || isLoading}
            >
              <ArrowForwardIcon fontSize="small" />
            </IconButton>
          )}
        </Paper>
      </Box>

      <Box
        sx={{
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        <Fab
          size="medium"
          sx={{
            bgcolor: "#1a1a1a",
            color: "white",
            "&:hover": {
              bgcolor: "#333333",
            },
            boxShadow: "0 3px 5px rgba(0,0,0,0.2)",
          }}
        >
          <HelpIcon />
        </Fab>
      </Box>
    </Box>
  );
}

export default ChatArea;
