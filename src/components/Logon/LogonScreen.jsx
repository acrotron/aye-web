// src/components/Logon/LogonScreen.jsx
import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Link,
} from "@mui/material";
import { signIn, signUp, confirmSignUp } from "aws-amplify/auth"; // low‑level auth calls – no UI overlay
import "./LogonScreen.css";

/**
 * Custom dark‑theme log‑in / registration screen.
 * Supports:
 *   • Sign‑In
 *   • Register (email + password) – triggers a confirmation code email.
 *   • Confirm the code – finalises registration and signs the user in.
 */
const LogonScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  // -----------------------------------------------------------------
  // Sign‑in flow (unchanged)
  // -----------------------------------------------------------------
  const handleSignIn = async () => {
    setError("");
    if (!username || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await signIn({ username, password });
    } catch (e) {
      console.error("Sign‑in error:", e);
      setError(e.message || "Failed to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // Registration – step 1: call signUp, then wait for confirmation code.
  // -----------------------------------------------------------------
  const handleSignUp = async () => {
    setError("");
    if (!username || !password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      await signUp({
        username,
        password,
        attributes: { email: username },
      });
      // Sign‑up succeeded – now ask for the confirmation code.
      setAwaitingConfirmation(true);
    } catch (e) {
      console.error("Sign‑up error:", e);
      setError(e.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------------------------------
  // Registration – step 2: confirm the code, then sign the user in.
  // -----------------------------------------------------------------
  const handleConfirm = async () => {
    setError("");
    if (!confirmationCode) {
      setError("Please enter the confirmation code sent to your email.");
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp({ username, confirmationCode });
      // After successful confirmation, sign the user in automatically.
      await signIn({ username, password });
    } catch (e) {
      console.error("Confirmation error:", e);
      setError(e.message || "Failed to confirm registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isRegistering) {
        awaitingConfirmation ? handleConfirm() : handleSignUp();
      } else {
        handleSignIn();
      }
    }
  };

  const toggleMode = () => {
    setError("");
    setIsRegistering((prev) => !prev);
    // Reset any registration‑specific state when switching modes.
    setAwaitingConfirmation(false);
    setConfirmationCode("");
  };

  return (
    <Box
      className="logon-screen"
      sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", width: "100vw" }}
    >
      <Card className="logon-card" elevation={3} sx={{ maxWidth: 400, width: "90%" }}>
        <CardContent>
          <Typography variant="h4" component="h1" gutterBottom className="logon-title" sx={{ textAlign: "center", whiteSpace: 'pre-line' }}>
            {isRegistering
              ? awaitingConfirmation
                ? "Confirm your email"
                : "Create your Aye Chat account"
              : "Welcome to\n Aye Chat"}
          </Typography>
          {!isRegistering && (
            <Typography variant="body2" sx={{ textAlign: "center", color: "var(--text-secondary)", mb: 2, fontStyle: 'italic' }}>
              A lightweight companion to your terminal client.
            </Typography>
          )}
          <Typography variant="subtitle1" gutterBottom className="logon-subtitle" sx={{ textAlign: "center", mb: 2 }}>
            {isRegistering
              ? awaitingConfirmation
                ? "Enter the verification code sent to your email."
                : "Enter your email and a password to register."
              : "Sign in to continue and start chatting."}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            onKeyPress={handleKeyPress}
          >
            {/* Email field – always shown */}
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputProps={{
                sx: {
                  backgroundColor: "var(--bg-paper)",
                  color: "var(--text-primary)",
                },
              }}
            />
            {/* Password field – hidden when awaiting confirmation */}
            {!awaitingConfirmation && (
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
                    color: "var(--text-primary)",
                  },
                }}
              />
            )}
            {/* Confirmation code field – only when awaiting confirmation */}
            {awaitingConfirmation && (
              <TextField
                label="Confirmation Code"
                variant="outlined"
                fullWidth
                value={confirmationCode}
                onChange={(e) => setConfirmationCode(e.target.value)}
                InputProps={{
                  sx: {
                    backgroundColor: "var(--bg-paper)",
                    color: "var(--text-primary)",
                  },
                }}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={
                isRegistering
                  ? awaitingConfirmation
                    ? handleConfirm
                    : handleSignUp
                  : handleSignIn
              }
              disabled={loading}
              className="logon-button"
              sx={{ mt: 1, py: 1.2 }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : awaitingConfirmation ? (
                "Confirm"
              ) : isRegistering ? (
                "Register"
              ) : (
                "Sign In"
              )}
            </Button>
          </Box>

          {/* Toggle between Sign‑In and Register */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link component="button" variant="body2" onClick={toggleMode} sx={{ cursor: "pointer" }}>
              {isRegistering ? "Already have an account? Sign In" : "New user? Create an account"}
            </Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LogonScreen;
