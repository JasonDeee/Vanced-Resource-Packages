/**
 * Vanced Chatbot - Chat Handler - Main CDN Script
 * Version: 1.0.0
 *
 * This script is loaded via CDN and injects the chatbot into user's website
 * genUI CDN URL: https://cdn.vanced.media/chatbot-mini/scripts/newest/generator.js
 * The generator will automatic import the Chat CDN after finish generating
 * Chat CDN URL: https://cdn.vanced.media/chatbot-mini/scripts/newest/OpusChat.js
 */

/**
 * Vanced Customer Support Chatbot Frontend
 * Tích hợp với MachineID và Rate Limiting System
 */

// ====== DEBUG CONFIGURATION ======
const DeBug_IsActive = true; // Set to false to disable debug logging

/**
 * Debug logging function for Frontend
 * @param {string} message - Debug message
 * @param {any} data - Optional data to log
 */
function debugLog(message, data = null) {
  if (!DeBug_IsActive) return;

  const timestamp = new Date().toISOString();
  const logMessage = `[FRONTEND-DEBUG ${timestamp}] ${message}`;

  if (data !== null) {
    console.log(`${logMessage}`, data);
  } else {
    console.log(logMessage);
  }
}

// Cấu hình
const WORKERS_ENDPOINT = window.VancedChatbotConfig.workersUrl || ""; // Cập nhật URL này

let chatHistory = [];
let machineId = null;
let isInitialized = false;
let rpdRemaining = 15;
let isBanned = false;

// WebSocket chat variables
let isInHumanSupportMode = false;
let webSocketConnection = null;
let currentRoomID = null;
let currentClientPeerID = null;
let connectionTimeout = null;

// DOM elements
const chatContainer = document.getElementById("Vx_chatMessages");
const messageInput = document.getElementById("Vx_messageInput");
const sendButton = document.getElementById("Vx_sendButton");

// Khởi tạo khi DOM loaded
document.addEventListener("DOMContentLoaded", async () => {
  await initializeChat();
  setupEventListeners();
});

/**
 * Khởi tạo chat với MachineID và validation
 */
async function initializeChat() {
  try {
    // Kiểm tra xem MachineID library có sẵn không
    if (typeof window.VancedMachineID === "undefined") {
      throw new Error("MachineID library not loaded");
    }

    // Generate browser fingerprint
    const fingerprint = window.VancedMachineID.generateFingerprint();
    debugLog("Generated fingerprint for initialization", {
      hasFingerprint: !!fingerprint,
      fingerprintKeys: Object.keys(fingerprint || {}),
      userAgent: fingerprint?.userAgent?.substring(0, 50),
    });

    // Gửi request khởi tạo tới Workers
    debugLog("Sending initChat request to Workers", {
      endpoint: WORKERS_ENDPOINT,
      action: "initChat",
    });

    const response = await fetch(WORKERS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "initChat",
        fingerprint: fingerprint,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      debugLog("HTTP error from Workers", {
        status: response.status,
        statusText: response.statusText,
        errorText: errorText.substring(0, 200),
      });
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    debugLog("InitChat response from Workers", {
      status: data.status,
      userType: data.userType,
      rpdRemaining: data.rpdRemaining,
      chatHistoryLength: data.chatHistory?.length,
      hasTimestamp: !!data.timestamp,
    });

    // Xử lý response
    if (data.status === "banned") {
      debugLog("User banned during initialization", { reason: data.reason });
      handleBannedUser(data.message);
      return;
    }

    if (data.status === "error") {
      debugLog("Error during initialization", { error: data.message });
      throw new Error(data.message);
    }

    if (data.status === "success") {
      // Lưu thông tin session
      machineId = data.machineId;
      chatHistory = data.chatHistory || [];
      rpdRemaining = data.rpdRemaining || 15;
      isInitialized = true;

      console.log(
        `Chat initialized successfully. MachineID: ${machineId}, RPD remaining: ${rpdRemaining}`
      );

      // Hiển thị chat history nếu có
      if (chatHistory.length > 0) {
        chatHistory.forEach((message) => displayMessage(message));
        console.log(`Loaded ${chatHistory.length} previous messages`);
      } else {
        // Hiển thị welcome message cho user mới
        const welcomeMessage = {
          role: "assistant",
          content:
            "Xin chào! Tôi là trợ lý ảo của Vanced Agency. Tôi có thể giúp gì cho bạn hôm nay?",
        };
        displayMessage(welcomeMessage);
      }

      // Update UI state
      updateRPDDisplay();
      setInputState(true);
    }
  } catch (error) {
    console.error("Error initializing chat:", error);
    handleInitializationError(error.message);
  }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Send button click
  sendButton.addEventListener("click", handleSendMessage);

  // Enter key press
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });

  // Recommendation questions click
  const recommendationQuestions = document.querySelectorAll(
    ".Vx_Recommendation_Question p"
  );
  recommendationQuestions.forEach((question) => {
    question.addEventListener("click", () => {
      messageInput.value = question.textContent;
      handleSendMessage();
    });
  });

  // Human support buttons (sẽ được thêm dynamically)
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("Opus_RequestForRealAssist_Button")) {
      handleHumanSupportRequest();
    } else if (e.target.classList.contains("Opus_StayWithOpus_Button")) {
      hideHumanSupportUI();
    }
  });
}

/**
 * Xử lý gửi tin nhắn với MachineID và rate limiting
 */
async function handleSendMessage() {
  const message = messageInput.value.trim();
  if (!message) return;

  // Kiểm tra xem đã khởi tạo chưa
  if (!isInitialized || !machineId) {
    showErrorMessage("Vui lòng refresh trang để khởi tạo lại chat.");
    return;
  }

  // Kiểm tra banned status
  if (isBanned) {
    showErrorMessage("Thiết bị này không hợp lệ!");
    return;
  }

  // Disable input và button
  setInputState(false);

  // Hiển thị tin nhắn user
  const userMessage = { role: "user", content: message };
  displayMessage(userMessage);

  // Clear input
  messageInput.value = "";

  // Nếu đang trong chế độ human support, gửi qua WebSocket
  if (isInHumanSupportMode && webSocketConnection) {
    const sent = sendWebSocketMessage(message);
    if (sent) {
      // Tin nhắn đã được gửi qua WebSocket
      setInputState(true); // Re-enable input ngay lập tức
      return;
    } else {
      // WebSocket không hoạt động, fallback về AI chat
      showErrorMessage("Kết nối với tư vấn viên bị lỗi. Chuyển về chat AI.");
      resetToNormalMode();
    }
  }

  // Hiển thị loading state cho AI chat
  chatContainer.classList.add("AwaitingResponse");

  try {
    // Gửi request đến Workers với MachineID
    const response = await fetch(WORKERS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "sendMessage",
        message: message,
        machineId: machineId,
        chatHistory: chatHistory.slice(-10), // Chỉ gửi 10 tin nhắn gần nhất
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    debugLog("SendMessage response from Workers", {
      status: data.status,
      responseLength: data.response?.length,
      needsHumanSupport: data.needsHumanSupport,
      rpdRemaining: data.rpdRemaining,
      hasTimestamp: !!data.timestamp,
      error: data.error,
    });

    // Xử lý các loại response khác nhau
    if (data.status === "banned") {
      debugLog("User banned during message send", { reason: data.reason });
      handleBannedUser(data.message);
      return;
    }

    if (data.status === "rate_limited_daily") {
      debugLog("Daily rate limit hit", { message: data.message });
      showRateLimitMessage(data.message);
      return;
    }

    if (data.status === "rate_limited_minute") {
      debugLog("Minute rate limit hit", { message: data.message });
      showRateLimitMessage(data.message);
      return;
    }

    if (data.status === "error") {
      debugLog("Error during message send", { error: data.message });
      throw new Error(data.message);
    }

    if (data.status === "success") {
      // Cập nhật chat history
      chatHistory.push(userMessage);

      // Hiển thị response từ bot
      const botMessage = { role: "assistant", content: data.response };
      displayMessage(botMessage);
      chatHistory.push(botMessage);

      // Cập nhật RPD remaining
      rpdRemaining = data.rpdRemaining;
      updateRPDDisplay();

      // Kiểm tra xem có cần human support không
      if (data.needsHumanSupport) {
        showHumanSupportUI();
      }
    }
  } catch (error) {
    console.error("Error sending message:", error);
    showErrorMessage(
      "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ trực tiếp với chúng tôi."
    );
  } finally {
    // Remove loading state và enable input
    chatContainer.classList.remove("AwaitingResponse");
    if (!isBanned) {
      setInputState(true);
    }
  }
}

/**
 * Hiển thị tin nhắn trong chat
 */
function displayMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.className = `Vx_message ${
    message.role === "user" ? "Vx_user-message" : "Vx_bot-message"
  }`;

  // Xử lý markdown cơ bản
  const formattedContent = formatMessageContent(message.content);
  messageElement.innerHTML = formattedContent;

  chatContainer.appendChild(messageElement);

  // Scroll to bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

/**
 * Format nội dung tin nhắn (markdown cơ bản)
 */
function formatMessageContent(content) {
  return content
    .replace(/\n/g, "<br>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`(.*?)`/g, "<code>$1</code>");
}

/**
 * Hiển thị Human Support UI
 */
function showHumanSupportUI() {
  const template = document.querySelector(
    ".OpusPC_RequestForRealAssist_Message"
  );
  if (template) {
    const humanSupportUI = template.cloneNode(true);
    humanSupportUI.style.display = "block";
    humanSupportUI.style.animation = "fadeIn 0.3s ease-in-out";

    chatContainer.appendChild(humanSupportUI);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }
}

/**
 * Ẩn Human Support UI
 */
function hideHumanSupportUI() {
  const humanSupportElements = document.querySelectorAll(
    '.OpusPC_RequestForRealAssist_Message[style*="block"]'
  );
  humanSupportElements.forEach((element) => {
    element.style.animation = "fadeOut 0.3s ease-in-out";
    setTimeout(() => element.remove(), 300);
  });

  // Thêm tin nhắn xác nhận
  const continueMessage = {
    role: "assistant",
    content: "Tôi sẽ tiếp tục hỗ trợ bạn. Bạn có câu hỏi gì khác không?",
  };
  displayMessage(continueMessage);
  chatHistory.push(continueMessage);
}

/**
 * Xử lý yêu cầu human support
 */
async function handleHumanSupportRequest() {
  debugLog("Human support request initiated", { machineId });

  try {
    // Ẩn human support UI
    hideHumanSupportUI();

    // Tạo support request data
    const timestamp = new Date().toISOString();
    const roomID = `support_${machineId}_${Date.now()}`;
    const clientPeerID = `client_${machineId}_${Date.now()}`;

    const supportData = {
      roomID: roomID,
      clientPeerID: clientPeerID,
      timestamp: timestamp,
      status: "waiting",
      chatHistory: [],
    };

    // Gửi support request tới Workers
    const response = await fetch(WORKERS_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "requestHumanSupport",
        machineId: machineId,
        supportData: JSON.stringify(supportData),
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    debugLog("Support request response", data);

    if (data.status === "success") {
      // Hiển thị waiting status
      showWaitingForAdminUI(roomID, clientPeerID);

      // Bắt đầu WebSocket connection
      await initializeWebSocketChat(roomID, clientPeerID);
    } else {
      throw new Error(data.message || "Failed to create support request");
    }
  } catch (error) {
    console.error("Error requesting human support:", error);
    showErrorMessage(
      "Không thể kết nối với tư vấn viên. Vui lòng thử lại sau hoặc liên hệ: contact@vanced.agency"
    );
  }
}

/**
 * Set trạng thái input (enable/disable)
 */
function setInputState(enabled) {
  messageInput.disabled = !enabled;
  sendButton.disabled = !enabled;

  if (enabled) {
    messageInput.focus();
  }
}

/**
 * Utility: Thêm CSS animations và styles
 */
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fadeOut {
    from { opacity: 1; transform: translateY(0); }
    to { opacity: 0; transform: translateY(-10px); }
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .waiting-for-admin {
    text-align: center;
    padding: 20px;
    background: rgba(0, 123, 255, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(0, 123, 255, 0.3);
    margin: 10px 0;
  }
  
  .waiting-spinner {
    font-size: 24px;
    animation: spin 2s linear infinite;
    margin-bottom: 10px;
  }
  
  .waiting-details {
    color: #666;
    font-size: 14px;
    margin: 10px 0;
  }
  
  .waiting-timer {
    font-size: 12px;
    color: #888;
    margin: 10px 0;
  }
  
  .cancel-waiting-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
    margin-top: 10px;
  }
  
  .cancel-waiting-btn:hover {
    background: #c82333;
  }
`;
document.head.appendChild(style);

// ====== NEW HELPER FUNCTIONS ======

/**
 * Xử lý khi user bị ban
 */
function handleBannedUser(message) {
  isBanned = true;
  setInputState(false);

  // Hiển thị thông báo ban
  const banMessage = {
    role: "system",
    content: message || "Thiết bị này không hợp lệ!",
  };
  displayMessage(banMessage);

  // Đóng băng UI
  freezeChatUI();

  console.log("User has been banned");
}

/**
 * Xử lý lỗi khởi tạo
 */
function handleInitializationError(errorMessage) {
  const errorMsg = {
    role: "system",
    content: `Lỗi khởi tạo: ${errorMessage}. Vui lòng refresh trang.`,
  };
  displayMessage(errorMsg);
  setInputState(false);
}

/**
 * Hiển thị thông báo rate limit
 */
function showRateLimitMessage(message) {
  const rateLimitMsg = {
    role: "system",
    content: message,
  };
  displayMessage(rateLimitMsg);

  // Tạm thời disable input
  setInputState(false);

  // Enable lại sau 5 giây (cho rate limit per minute)
  setTimeout(() => {
    if (!isBanned) {
      setInputState(true);
    }
  }, 5000);
}

/**
 * Hiển thị error message
 */
function showErrorMessage(message) {
  const errorMsg = {
    role: "assistant",
    content: message,
  };
  displayMessage(errorMsg);
}

/**
 * Cập nhật hiển thị RPD remaining
 */
function updateRPDDisplay() {
  // Tạo hoặc cập nhật RPD indicator
  let rpdIndicator = document.getElementById("rpd-indicator");
  if (!rpdIndicator) {
    rpdIndicator = document.createElement("div");
    rpdIndicator.id = "rpd-indicator";
    rpdIndicator.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(0,0,0,0.7);
      color: white;
      padding: 5px 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 1000;
    `;
    document.body.appendChild(rpdIndicator);
  }

  rpdIndicator.textContent = `Tin nhắn còn lại: ${rpdRemaining}/15`;

  // Thay đổi màu dựa trên số lượng còn lại
  if (rpdRemaining <= 3) {
    rpdIndicator.style.background = "rgba(231, 33, 102, 0.9)"; // Red
  } else if (rpdRemaining <= 7) {
    rpdIndicator.style.background = "rgba(255, 165, 0, 0.9)"; // Orange
  } else {
    rpdIndicator.style.background = "rgba(0, 128, 0, 0.9)"; // Green
  }
}

/**
 * Hiển thị UI chờ admin kết nối
 */
function showWaitingForAdminUI(roomID, clientPeerID) {
  const recommendationArea = document.querySelector(
    ".Vx_Recommendation_Question"
  );

  if (recommendationArea) {
    // Thay thế recommendation questions bằng waiting status
    recommendationArea.innerHTML = `
      <div class="waiting-for-admin" id="waitingForAdmin">
        <div class="waiting-spinner">⏳</div>
        <p><strong>Đang chờ tư vấn viên...</strong></p>
        <p class="waiting-details">Chúng tôi đang kết nối bạn với tư vấn viên. Vui lòng chờ trong giây lát.</p>
        <div class="waiting-timer" id="waitingTimer">Thời gian chờ: <span id="timerCount">0</span>s</div>
        <button class="cancel-waiting-btn" onclick="cancelWaitingForAdmin()">Hủy chờ</button>
      </div>
    `;

    // Bắt đầu timer
    startWaitingTimer();

    // Set timeout 3 phút
    connectionTimeout = setTimeout(() => {
      handleConnectionTimeout();
    }, 3 * 60 * 1000); // 3 minutes
  }

  debugLog("Waiting UI displayed", { roomID, clientPeerID });
}

/**
 * Bắt đầu timer đếm thời gian chờ
 */
function startWaitingTimer() {
  let seconds = 0;
  const timerElement = document.getElementById("timerCount");

  const timer = setInterval(() => {
    seconds++;
    if (timerElement) {
      timerElement.textContent = seconds;
    }

    // Dừng timer nếu không còn trong chế độ chờ
    if (!isInHumanSupportMode || !document.getElementById("waitingForAdmin")) {
      clearInterval(timer);
    }
  }, 1000);
}

/**
 * Xử lý timeout kết nối
 */
function handleConnectionTimeout() {
  debugLog("Connection timeout occurred");

  // Hiển thị thông báo timeout
  const timeoutMessage = {
    role: "system",
    content:
      "Có vẻ như chúng tôi chưa thể hỗ trợ bạn lúc này. Thành thật xin lỗi vì sự bất tiện này. Bạn có thể liên hệ trực tiếp qua email: contact@vanced.agency",
  };
  displayMessage(timeoutMessage);

  // Reset UI
  resetToNormalMode();
}

/**
 * Hủy chờ admin
 */
function cancelWaitingForAdmin() {
  debugLog("User cancelled waiting for admin");

  // Đóng WebSocket nếu có
  if (webSocketConnection) {
    webSocketConnection.close();
  }

  // Reset UI
  resetToNormalMode();

  // Hiển thị thông báo
  const cancelMessage = {
    role: "assistant",
    content:
      "Đã hủy yêu cầu gặp tư vấn viên. Tôi sẽ tiếp tục hỗ trợ bạn. Bạn có câu hỏi gì khác không?",
  };
  displayMessage(cancelMessage);
}

/**
 * Reset về chế độ chat bình thường
 */
function resetToNormalMode() {
  isInHumanSupportMode = false;
  currentRoomID = null;
  currentClientPeerID = null;

  // Clear timeout
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }

  // Đóng WebSocket
  if (webSocketConnection) {
    webSocketConnection.close();
    webSocketConnection = null;
  }

  // Khôi phục recommendation questions
  const recommendationArea = document.querySelector(
    ".Vx_Recommendation_Question"
  );
  if (recommendationArea) {
    recommendationArea.innerHTML = `
      <p>Giúp tôi xây dựng cấu hình PC cho Streamer.</p>
      <p>Cách vệ sinh PC đúng cách.</p>
      <p>Hiện tại đang có chương trình khuyến mãi gì?</p>
    `;
  }

  // Enable input
  setInputState(true);
}

/**
 * Đóng băng chat UI
 */
function freezeChatUI() {
  // Disable tất cả input
  setInputState(false);

  // Thêm overlay
  const overlay = document.createElement("div");
  overlay.id = "chat-freeze-overlay";
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
    font-weight: bold;
  `;
  overlay.innerHTML = "🔒 Chat đã bị đóng băng";

  document.body.appendChild(overlay);
}

/**
 * Debug function - Clear MachineID và refresh
 */
function debugClearMachineID() {
  if (typeof window.VancedMachineID !== "undefined") {
    window.VancedMachineID.clear();
    console.log("MachineID cleared. Refreshing page...");
    location.reload();
  }
}

/**
 * Debug function - Show MachineID info
 */
async function debugShowMachineIDInfo() {
  if (typeof window.VancedMachineID !== "undefined") {
    const info = await window.VancedMachineID.getInfo();
    console.log("MachineID Info:", info);
    return info;
  }
}

/**
 * Khởi tạo WebSocket chat với admin
 */
async function initializeWebSocketChat(roomID, clientPeerID) {
  try {
    debugLog("Initializing WebSocket chat", { roomID, clientPeerID });

    // Tạo WebSocket URL - Fix: thêm dấu / trước chat/room
    let baseWsUrl = WORKERS_ENDPOINT.replace("https://", "wss://").replace(
      "http://",
      "ws://"
    );
    if (!baseWsUrl.endsWith("/")) {
      baseWsUrl += "/";
    }
    const wsUrl = `${baseWsUrl}chat/room/${roomID}?peerID=${clientPeerID}&roomID=${roomID}&nickname=Client`;

    debugLog("Connecting to WebSocket", { wsUrl });

    // Tạo WebSocket connection
    webSocketConnection = new WebSocket(wsUrl);
    currentRoomID = roomID;
    currentClientPeerID = clientPeerID;
    isInHumanSupportMode = true;

    // WebSocket event handlers
    webSocketConnection.onopen = (event) => {
      debugLog("WebSocket connected", event);
      onWebSocketConnected();
    };

    webSocketConnection.onmessage = (event) => {
      debugLog("WebSocket message received", event.data);
      handleWebSocketMessage(event.data);
    };

    webSocketConnection.onclose = (event) => {
      debugLog("WebSocket closed", event);
      onWebSocketClosed(event);
    };

    webSocketConnection.onerror = (error) => {
      debugLog("WebSocket error", error);
      onWebSocketError(error);
    };
  } catch (error) {
    console.error("Error initializing WebSocket:", error);
    showErrorMessage("Không thể kết nối WebSocket. Vui lòng thử lại.");
    resetToNormalMode();
  }
}

/**
 * Xử lý khi WebSocket kết nối thành công
 */
function onWebSocketConnected() {
  debugLog("WebSocket connection established");

  // Xóa waiting UI
  const waitingElement = document.getElementById("waitingForAdmin");
  if (waitingElement) {
    waitingElement.remove();
  }

  // Clear timeout
  if (connectionTimeout) {
    clearTimeout(connectionTimeout);
    connectionTimeout = null;
  }

  // Hiển thị thông báo kết nối thành công
  const connectedMessage = {
    role: "system",
    content:
      "✅ Đã kết nối với hệ thống hỗ trợ. Tư vấn viên sẽ tham gia cuộc trò chuyện sớm nhất có thể.",
  };
  displayMessage(connectedMessage);

  // Enable input cho WebSocket chat
  setInputState(true);
}

/**
 * Xử lý tin nhắn WebSocket
 */
function handleWebSocketMessage(messageData) {
  try {
    const message = JSON.parse(messageData);
    debugLog("Processing WebSocket message", message);

    switch (message.type) {
      case "connected":
        debugLog("WebSocket handshake completed", message);
        break;

      case "user-joined":
        if (message.peerID.startsWith("admin_")) {
          const adminJoinedMessage = {
            role: "system",
            content: `🎧 Tư vấn viên ${
              message.nickname || "Admin"
            } đã tham gia cuộc trò chuyện.`,
          };
          displayMessage(adminJoinedMessage);
        }
        break;

      case "user-left":
        if (message.peerID.startsWith("admin_")) {
          const adminLeftMessage = {
            role: "system",
            content: `👋 Tư vấn viên ${
              message.nickname || "Admin"
            } đã rời khỏi cuộc trò chuyện.`,
          };
          displayMessage(adminLeftMessage);
        }
        break;

      case "chat-message":
        if (message.fromPeerID !== currentClientPeerID) {
          // Tin nhắn từ admin
          const adminMessage = {
            role: "assistant",
            content: `[${message.from}]: ${message.text}`,
          };
          displayMessage(adminMessage);
        }
        break;

      case "pong":
        debugLog("Received pong from server", message);
        break;

      default:
        debugLog("Unknown WebSocket message type", message);
    }
  } catch (error) {
    console.error("Error processing WebSocket message:", error);
  }
}

/**
 * Xử lý khi WebSocket đóng
 */
function onWebSocketClosed(event) {
  debugLog("WebSocket connection closed", event);

  if (isInHumanSupportMode) {
    const disconnectedMessage = {
      role: "system",
      content:
        "❌ Kết nối với tư vấn viên đã bị ngắt. Bạn có thể thử kết nối lại hoặc tiếp tục chat với AI.",
    };
    displayMessage(disconnectedMessage);

    // Reset về chế độ bình thường sau 3 giây
    setTimeout(() => {
      resetToNormalMode();
    }, 3000);
  }
}

/**
 * Xử lý lỗi WebSocket
 */
function onWebSocketError(error) {
  console.error("WebSocket error:", error);

  const errorMessage = {
    role: "system",
    content: "⚠️ Có lỗi xảy ra với kết nối WebSocket. Đang thử kết nối lại...",
  };
  displayMessage(errorMessage);
}

/**
 * Gửi tin nhắn qua WebSocket
 */
function sendWebSocketMessage(text) {
  if (
    webSocketConnection &&
    webSocketConnection.readyState === WebSocket.OPEN
  ) {
    const message = {
      type: "chat-message",
      from: "Client",
      fromPeerID: currentClientPeerID,
      text: text,
      timestamp: new Date().toISOString(),
      roomID: currentRoomID,
    };

    webSocketConnection.send(JSON.stringify(message));
    debugLog("Sent WebSocket message", message);
    return true;
  }
  return false;
}

// Expose debug functions to window for console access
window.VancedChatDebug = {
  clearMachineID: debugClearMachineID,
  showMachineIDInfo: debugShowMachineIDInfo,
  getCurrentState: () => ({
    machineId,
    isInitialized,
    rpdRemaining,
    isBanned,
    chatHistoryLength: chatHistory.length,
    isInHumanSupportMode,
    currentRoomID,
    webSocketConnected: webSocketConnection?.readyState === WebSocket.OPEN,
  }),
  resetToNormalMode,
  cancelWaitingForAdmin,
};

/**
 * Error handling cho uncaught errors
 */
window.addEventListener("error", (e) => {
  console.error("Uncaught error:", e.error);
});

window.addEventListener("unhandledrejection", (e) => {
  console.error("Unhandled promise rejection:", e.reason);
});
