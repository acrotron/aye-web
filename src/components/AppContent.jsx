import React from "react";
import { useChatContext } from "../context/ChatContext";

import NavPane from "./NavPane/NavPane";
import ChatPane from "./ChatPane/ChatPane";
import InfoPane from "./InfoPane/InfoPane";
import ResizeHandle from "./ResizeHandle/ResizeHandle";
import ChatSessionSettingsDrawer from "./ChatSessionSettingsDrawer/ChatSessionSettingsDrawer";

const AppContent = ({ title, resizablePanes, user, signOut }) => {
  const { showSettings, setShowSettings, activeSettingsSection } = useChatContext();

  return (
    <div className={`app-container ${resizablePanes.isResizing ? "resizing" : ""}`}>
      {/* Nav pane (left) */}
      <div className="nav-pane" style={resizablePanes.getNavPaneStyle()}>
        <NavPane user={user} signOut={signOut} title={title} />
      </div>

      {/* Resize handle between nav and chat */}
      <ResizeHandle
        isResizing={resizablePanes.isResizing && resizablePanes.resizeType === "nav"}
        onResizeStart={resizablePanes.onNavResizeStart}
      />

      {/* Central chat pane */}
      <ChatPane style={resizablePanes.getChatPaneStyle()} />

      {/* Resize handle between chat and info */}
      <ResizeHandle
        isResizing={resizablePanes.isResizing && resizablePanes.resizeType === "info"}
        onResizeStart={resizablePanes.onInfoResizeStart}
      />

      {/* Additional info pane (right) */}
      <InfoPane style={resizablePanes.getInfoPaneStyle()} />

      {/* Settings drawer – always mounted, visibility controlled via `open` */}
      <ChatSessionSettingsDrawer
        open={showSettings}
        onClose={() => setShowSettings(false)}
        initialSection={activeSettingsSection}
      />
    </div>
  );
};

export default AppContent;
