// src/App.jsx
import React, { useEffect, useState } from "react";
import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { fetchAuthSession } from "aws-amplify/auth"; // <-- added
import { Routes, Route } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

import { ChatProvider } from "./context/ChatContext";
import { ChatService } from "./services/ChatService";
import { HuggingfaceService } from "./services/huggingface.service";
import { useResizablePanes } from "./hooks/useResizablePanes";
import AppContent from "./components/AppContent";
import LogonScreen from "./components/Logon/LogonScreen";

import "./app.css";

/**
 * AuthGate – controls what is shown based on Amplify auth state.
 *   • While Amplify is configuring we render nothing.
 *   • If the user is not signed‑in we show the custom LogonScreen.
 *   • Once Amplify reports `authenticated` we *fetch* the session
 *     ourselves (via `fetchAuthSession`) to obtain a reliable user ID.
 *   • While that async call is in flight we show a tiny spinner.
 *   • When the ID is resolved we render the main chat UI.
 */
const AuthGate = ({ title, resizablePanes }) => {
  const { user, authStatus, signOut } = useAuthenticator();
  const [resolvedUser, setResolvedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // ---------------------------------------------------------------
  // When Amplify says we are authenticated, resolve the actual user ID.
  // ---------------------------------------------------------------
  useEffect(() => {
    if (authStatus !== "authenticated" || resolvedUser) return;

    const resolve = async () => {
      setLoadingUser(true);
      try {
        const session = await fetchAuthSession();
        // Fall back to the Cognito "sub" claim; prefer the username.
        const sub = session.tokens?.idToken?.payload?.sub;
        //const username = session.tokens?.accessToken?.payload?.username || session.username;
        const username = session.tokens?.signInDetails?.loginId || session.username;
        const id = username || sub || "unknown";
        // Build a minimal user object compatible with ChatContext's logic.
        setResolvedUser({ username: id, attributes: { sub: id } });
      } catch (e) {
        console.warn("Failed to fetch auth session:", e);
        // If we cannot resolve, keep the "Guest" fallback.
        setResolvedUser(null);
      } finally {
        setLoadingUser(false);
      }
    };
    resolve();
  }, [authStatus, resolvedUser]);

  // ---------------------------------------------------------------
  // Render based on auth status.
  // ---------------------------------------------------------------
  if (authStatus === "configuring") {
    return null; // or a loader if you prefer
  }

  if (authStatus !== "authenticated") {
    return <LogonScreen />;
  }

  // Authenticated but still waiting for the async user‑resolution.
  if (loadingUser || (!resolvedUser && user === undefined)) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--bg-default)"
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Prefer the resolved user; fall back to the raw `user` object if it exists.
  const activeUser = resolvedUser || user;

  return (
    <ChatProvider
      user={activeUser}
      signOut={signOut}
      chatService={new ChatService(new HuggingfaceService())}
    >
      <Routes>
        <Route
          path="/"
          element={
            <AppContent
              title={title}
              resizablePanes={resizablePanes}
              user={activeUser}
              signOut={signOut}
            />
          }
        />
      </Routes>
    </ChatProvider>
  );
};

function App() {
  const title = "Aye Chat";
  const resizablePanes = useResizablePanes();

  return (
    // Authenticator.Provider supplies the auth context without rendering the default UI.
    <Authenticator.Provider>
      <AuthGate title={title} resizablePanes={resizablePanes} />
    </Authenticator.Provider>
  );
}

export default App;
