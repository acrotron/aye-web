import React, { useState } from "react";
import { useChatContext } from "../../context/ChatContext";
import ModelSelector from "../ModelSelector/ModelSelector";
import SystemPromptEditor from "../SystemPromptEditor/SystemPromptEditor";
import DeveloperSettings from "../Settings/DeveloperSettings";
import { AVAILABLE_MODELS } from "../../config/models";

// MUI imports
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import CloseIcon from "@mui/icons-material/Close";

/**
 * ChatSessionSettingsDrawer – MUI version.
 *
 * Props:
 *   open            – boolean controlling the drawer visibility.
 *   onClose         – callback invoked when the drawer should be closed.
 *   initialSection  – which tab to show initially ("currentChat" or "developer").
 */
const ChatSessionSettingsDrawer = ({ open = false, onClose, initialSection = "currentChat" }) => {
  const { selectedModel, setSelectedModel, systemPrompt, setSystemPrompt } =
    useChatContext();

  const [currentSection, setCurrentSection] = useState(initialSection);

  const handleClose = () => {
    onClose();
  };

  const renderSection = () => {
    switch (currentSection) {
      case "currentChat":
        return (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Model
              </Typography>
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                availableModels={AVAILABLE_MODELS}
              />
            </Box>
            <Box>
              <Typography variant="h6" gutterBottom>
                System Prompt
              </Typography>
              <SystemPromptEditor
                systemPrompt={systemPrompt}
                onSystemPromptChange={setSystemPrompt}
              />
            </Box>
          </>
        );
      case "developer":
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Developer Settings
            </Typography>
            <DeveloperSettings />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      // Force the drawer to occupy 80 % of the viewport width on all screens
      PaperProps={{ sx: { width: "80vw", maxWidth: "80vw" } }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="h5" component="div">
          Settings
        </Typography>
        <IconButton edge="end" onClick={handleClose} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Navigation & Content container */}
      <Box sx={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Navigation */}
        <List
          component="nav"
          sx={{ width: 200, borderRight: 1, borderColor: "divider" }}
        >
          <ListItemButton
            selected={currentSection === "currentChat"}
            onClick={() => setCurrentSection("currentChat")}
          >
            <ListItemText primary="Current Chat" />
          </ListItemButton>
          <ListItemButton
            selected={currentSection === "developer"}
            onClick={() => setCurrentSection("developer")}
          >
            <ListItemText primary="Developer Settings" />
          </ListItemButton>
        </List>

        {/* Main content */}
        <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          {renderSection()}
        </Box>
      </Box>
    </Drawer>
  );
};

export default ChatSessionSettingsDrawer;
