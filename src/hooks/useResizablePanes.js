import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Manages three resizable panes (Nav, Chat, Info).
 *
 * - Widths are stored as absolute pixels (so the mouse‑drag is precise).
 * - On a window resize we:
 *     • shrink proportionally if the container becomes smaller
 *     • expand the centre Chat pane if the container becomes larger
 * - The hook returns the inline‑style helpers used by App.jsx and the
 *   mouse‑down callbacks for the resize handles.
 */
export const useResizablePanes = () => {
  // -----------------------------------------------------------------
  // 1️⃣ Initial pixel sizes (feel free to tweak the defaults)
  // -----------------------------------------------------------------
  const [navPaneWidth, setNavPaneWidth] = useState(330);
  const [chatPaneWidth, setChatPaneWidth] = useState(1100);
  const [infoPaneWidth, setInfoPaneWidth] = useState(300);

  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState(null); // "nav" | "info" | null

  // -----------------------------------------------------------------
  // 2️⃣ Refs – keep the latest values inside the mouse‑move listener
  // -----------------------------------------------------------------
  const isResizingRef = useRef(isResizing);
  const resizeTypeRef = useRef(resizeType);
  const navPaneWidthRef = useRef(navPaneWidth);
  const chatPaneWidthRef = useRef(chatPaneWidth);
  const infoPaneWidthRef = useRef(infoPaneWidth);

  useEffect(() => {
    isResizingRef.current = isResizing;
  }, [isResizing]);
  useEffect(() => {
    resizeTypeRef.current = resizeType;
  }, [resizeType]);
  useEffect(() => {
    navPaneWidthRef.current = navPaneWidth;
  }, [navPaneWidth]);
  useEffect(() => {
    chatPaneWidthRef.current = chatPaneWidth;
  }, [chatPaneWidth]);
  useEffect(() => {
    infoPaneWidthRef.current = infoPaneWidth;
  }, [infoPaneWidth]);

  // -----------------------------------------------------------------
  // 3️⃣ Layout constraints
  // -----------------------------------------------------------------
  const minNavWidth = 250;
  const minChatWidth = 400;
  const minInfoWidth = 300;
  const handleWidth = 10; // each vertical resize handle is 10 px wide

  // -----------------------------------------------------------------
  // 4️⃣ Mouse‑move while dragging a handle
  // -----------------------------------------------------------------
  const handleMouseMove = useCallback(
    (e) => {
      if (!isResizingRef.current) return;

      const container = document.querySelector(".app-container");
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left; // X relative to container left edge
      const totalWidth = rect.width;
      const totalHandleWidth = handleWidth * 2; // we have two handles

      // -------------------------------------------------------------
      // Resize between Nav & Chat
      // -------------------------------------------------------------
      if (resizeTypeRef.current === "nav") {
        const newNav = Math.max(minNavWidth, mouseX);
        const spaceForChatAndInfo =
          totalWidth - newNav - totalHandleWidth; // leftover space after Nav
        const newChat = spaceForChatAndInfo - infoPaneWidthRef.current;

        if (
          newChat >= minChatWidth &&
          newNav <=
            totalWidth - minChatWidth - minInfoWidth - totalHandleWidth
        ) {
          setNavPaneWidth(newNav);
          setChatPaneWidth(newChat);
        }
        return;
      }

      // -------------------------------------------------------------
      // Resize between Chat & Info
      // -------------------------------------------------------------
      if (resizeTypeRef.current === "info") {
        const navAndFirstHandle = navPaneWidthRef.current + handleWidth;
        const newChat = mouseX - navAndFirstHandle;
        const newInfo =
          totalWidth - navAndFirstHandle - newChat - handleWidth;

        if (newChat >= minChatWidth && newInfo >= minInfoWidth) {
          setChatPaneWidth(newChat);
          setInfoPaneWidth(newInfo);
        }
        return;
      }
    },
    [minNavWidth, minChatWidth, minInfoWidth, handleWidth]
  );

  // -------------------------------------------------------------
  // Mouse‑up – stop the resize operation
  // -------------------------------------------------------------
  const handleMouseUp = useCallback(() => {
    if (isResizingRef.current) {
      setIsResizing(false);
      setResizeType(null);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    }
  }, []);

  // -------------------------------------------------------------
  // 5️⃣ Window‑resize handling (the piece that was missing)
  // -------------------------------------------------------------
  const handleWindowResize = useCallback(() => {
    const container = document.querySelector(".app-container");
    if (!container) return;

    const containerWidth = container.offsetWidth; // total width of the flex parent
    const totalHandleWidth = handleWidth * 2; // two vertical handles
    const availableForPanes = containerWidth - totalHandleWidth;

    const currentTotal =
      navPaneWidthRef.current +
      chatPaneWidthRef.current +
      infoPaneWidthRef.current;

    // ------------------- CASE A: container got smaller -------------------
    if (currentTotal > availableForPanes) {
      // Scale everything down proportionally
      const scale = availableForPanes / currentTotal;
      const newNav = Math.max(minNavWidth, navPaneWidthRef.current * scale);
      const newChat = Math.max(minChatWidth, chatPaneWidthRef.current * scale);
      const newInfo = Math.max(
        minInfoWidth,
        availableForPanes - newNav - newChat
      );

      setNavPaneWidth(newNav);
      setChatPaneWidth(newChat);
      setInfoPaneWidth(newInfo);
      return;
    }

    // ------------------- CASE B: container got larger ------------------
    // Give the extra space to the centre Chat pane (the pane users expect to grow)
    const extra = availableForPanes - currentTotal; // > 0
    setChatPaneWidth((prev) => prev + extra);
  }, [minNavWidth, minChatWidth, minInfoWidth, handleWidth]);

  // -------------------------------------------------------------
  // Attach global listeners (once)
  // -------------------------------------------------------------
  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleWindowResize);
    };
  }, [handleMouseMove, handleMouseUp, handleWindowResize]);

  // -------------------------------------------------------------
  // 6️⃣ Handlers that start a drag operation (called from ResizeHandle)
  // -------------------------------------------------------------
  const onNavResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeType("nav");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  const onInfoResizeStart = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
    setResizeType("info");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  // -------------------------------------------------------------
  // 7️⃣ Inline‑style helpers that the three panes consume
  // -------------------------------------------------------------
  const getNavPaneStyle = useCallback(
    () => ({
      width: `${navPaneWidth}px`,
      flex: `0 0 ${navPaneWidth}px`,
    }),
    [navPaneWidth]
  );

  const getChatPaneStyle = useCallback(
    () => ({
      width: `${chatPaneWidth}px`,
      flex: `0 0 ${chatPaneWidth}px`,
    }),
    [chatPaneWidth]
  );

  const getInfoPaneStyle = useCallback(
    () => ({
      width: `${infoPaneWidth}px`,
      flex: `0 0 ${infoPaneWidth}px`,
    }),
    [infoPaneWidth]
  );

  // -------------------------------------------------------------
  // 8️⃣ Return everything the UI needs
  // -------------------------------------------------------------
  return {
    // (optional) expose the raw pixel values for debugging / UI display
    navPaneWidth,
    chatPaneWidth,
    infoPaneWidth,

    // state useful for the resize‑handle component
    isResizing,
    resizeType,

    // callbacks to start a drag
    onNavResizeStart,
    onInfoResizeStart,

    // style getters used in App.jsx
    getNavPaneStyle,
    getChatPaneStyle,
    getInfoPaneStyle,
  };
};

