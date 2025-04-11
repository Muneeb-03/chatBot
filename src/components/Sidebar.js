import React, { useState } from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import InputBase from "@mui/material/InputBase";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemSecondaryAction from "@mui/material/ListItemSecondaryAction";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SettingsIcon from "@mui/icons-material/Settings";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";

function Sidebar({
  chats,
  createNewChat,
  setCurrentChat,
  deleteChat,
  open,
  width,
  currentChatId,
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredChats = chats.filter((chat) => {
    if (searchTerm) {
      return chat.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return true;
  });

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation();
    deleteChat(chatId);
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: width,
          boxSizing: "border-box",
          borderRight: "1px solid #e1e1e1",
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <Button
          startIcon={<HomeIcon />}
          endIcon={<ExpandMoreIcon fontSize="small" />}
          sx={{
            justifyContent: "flex-start",
            textTransform: "none",
            fontWeight: "medium",
            color: "#000",
          }}
        >
          Home
        </Button>
        <IconButton size="small">
          <SettingsIcon />
        </IconButton>
      </Box>

      <Divider />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
        }}
      >
        <Typography variant="subtitle1">Chats</Typography>
        <IconButton size="small">
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ padding: "0 16px 16px" }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={createNewChat}
          sx={{
            width: "100%",
            textTransform: "none",
            bgcolor: "#1a1a1a",
            color: "white",
            "&:hover": {
              bgcolor: "#333333",
            },
            fontWeight: "normal",
            borderRadius: "8px",
          }}
        >
          New Chat
        </Button>
      </Box>

      <Box sx={{ padding: "0 16px" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            border: "1px solid #e0e0e0",
            borderRadius: 1,
            padding: "8px 12px",
            bgcolor: "#f9f9f9",
          }}
        >
          <SearchIcon sx={{ color: "#666", fontSize: 20 }} />
          <InputBase
            sx={{ ml: 1, flex: 1, fontSize: "0.9rem" }}
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
      </Box>

      <List
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          "& .MuiListItemButton-root": {
            borderRadius: 1,
          },
        }}
      >
        {filteredChats.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              textAlign: "center",
              color: "#666",
              fontStyle: "italic",
              padding: "16px 0",
            }}
          >
            {searchTerm ? "No matching chats." : "No chats."}
          </Typography>
        ) : (
          filteredChats.map((chat) => {
            const chatPreview =
              chat.messages.length > 0
                ? chat.messages[0].content.substring(0, 30) +
                  (chat.messages[0].content.length > 30 ? "..." : "")
                : "New conversation";

            return (
              <ListItem
                key={chat.id}
                disablePadding
                secondaryAction={
                  <Tooltip title="Delete chat">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                      sx={{ opacity: 0.7 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                }
                sx={{ paddingRight: "48px" }}
              >
                <ListItemButton
                  onClick={() => setCurrentChat(chat)}
                  selected={chat.id === currentChatId}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "#f0f0f0",
                    },
                    "&:hover": {
                      bgcolor: "#f5f5f5",
                    },
                  }}
                >
                  <ListItemText
                    primary={`Chat ${chat.id}`}
                    secondary={chatPreview}
                    primaryTypographyProps={{
                      fontWeight: chat.id === currentChatId ? "bold" : "normal",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        )}
      </List>
    </Drawer>
  );
}

export default Sidebar;
