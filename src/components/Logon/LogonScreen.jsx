// src/components/Logon/LogonScreen.jsx
import React, { useState } from "react";
import { Box, Card, CardContent, Typography, Button, TextField, Alert, CircularProgress } from "@mui/material";
import { signIn } from "aws-amplify/auth"; // low‑level auth call – no UI overlay
// NOTE: No Hub import – Amplify emits its own auth event.
import "./LogonScreen.css";

/**
 * Custom dark‑theme log‑in screen.
 * Renders username/email and password fields, handles sign‑in via the low‑level
 * Amplify `signIn` API, and displays loading / error feedback.
 * The surrounding `<Authenticator.Provider>` supplies the auth context, so
 * once the sign‑in succeeds the `user` object becomes available and the app
 * switches to the main chat UI.
 */
const LogonScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async () => {
    setError("");
    if (!username || !password) {
      setError("Please enter both username (or email) and password.");
      return;
    }
    setLoading(true);
    try {
      // `signIn` returns a CognitoUser on success; the Authenticator context
      // will pick up the new session automatically.
      await signIn({ username, password });
      // No manual Hub dispatch needed – Amplify will emit a SIGNED_IN event.
    } catch (e) {
      console.error("Sign‑in error:", e);
      setError(e.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSignIn();
    }
  };

  return (
    <Box className="logon-screen" sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }}>
      <Card className="logon-card" elevation={3} sx={{ maxWidth: 400, width: "90%" }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom className="logon-title" sx={{ textAlign: "center" }}>
            Welcome to Aye Chat
          </Typography>
          <Typography variant="subtitle1" gutterBottom className="logon-subtitle" sx={{ textAlign: "center", mb: 2 }}>
            Sign in to continue and start chatting with Régine.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" noValidate autoComplete="off" sx={{ display: "flex", flexDirection: "column", gap: 2 }} onKeyPress={handleKeyPress}>
            <TextField
              label="Username or Email"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "var(--bg-paper)",
                  color: "var(--text-primary)"
                }
              }}
            />
            <TextField
              label="Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "var(--bg-paper)",
                  color: "var(--text-primary)"
                }
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSignIn}
              disabled={loading}
              className="logon-button"
              sx={{ mt: 1, py: 1.2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LogonScreen;
