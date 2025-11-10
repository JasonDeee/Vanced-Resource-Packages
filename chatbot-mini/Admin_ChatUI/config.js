/**
 * 🔧 Admin Dashboard Configuration
 *
 * COMMUNITY SETUP:
 * 1. Update SPREADSHEET_URL with your Google Apps Script URL
 * 2. Update WORKERS_URL with your Cloudflare Workers URL
 * 3. Customize ADMIN_SETTINGS if needed
 * 4. Deploy this folder to GitHub Pages
 */

// ====== REQUIRED CONFIGURATION ======
/**
 * 📊 Google Apps Script URL
 * Get this from your Apps Script deployment
 * Format: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */
const SPREADSHEET_URL =
  "https://script.google.com/macros/s/AKfycbzZPxkICg1AHucIZ2AFQmnLLg_hjG8s9ouJUU9eSG1043AronwRwV45i5tMOQT5VuPDvw/exec";

/**
 * 🔗 Cloudflare Workers URL
 * Your deployed Workers URL for WebSocket connections
 * Format: https://your-worker.your-subdomain.workers.dev
 */
const WORKERS_URL = "https://vanced-chatbot.caocv-work.workers.dev";

// ====== OPTIONAL CUSTOMIZATION ======
/**
 * ⚙️ Admin Dashboard Settings
 * Customize these settings for your team
 */
const ADMIN_SETTINGS = {
  // Dashboard title and branding
  title: "Vanced Support Dashboard",
  companyName: "Vanced Agency",

  // Auto-refresh intervals (in milliseconds)
  refreshInterval: 10000, // 10 seconds

  // UI preferences
  theme: "light", // "light" or "dark"
  defaultNickname: "Support Agent",

  // Notification settings
  enableNotifications: true,
  notificationSound: true,

  // Chat settings
  maxChatHistory: 100,
  typingIndicator: true,

  // Time format
  timeFormat: "24h", // "12h" or "24h"
  timezone: "Asia/Ho_Chi_Minh",
};

/**
 * 🎨 Theme Colors (Optional)
 * Customize the dashboard appearance
 */
const THEME_COLORS = {
  light: {
    primary: "#4267b2",
    secondary: "#42b883",
    background: "#f0f2f5",
    surface: "#ffffff",
    text: "#1c1e21",
    textSecondary: "#65676b",
  },
  dark: {
    primary: "#5890ff",
    secondary: "#00d4aa",
    background: "#18191a",
    surface: "#242526",
    text: "#e4e6ea",
    textSecondary: "#b0b3b8",
  },
};

/**
 * 🔔 Notification Messages (Optional)
 * Customize notification text
 */
const NOTIFICATION_MESSAGES = {
  newSupportRequest: "Có yêu cầu hỗ trợ mới",
  adminJoined: "Tư vấn viên đã tham gia",
  clientDisconnected: "Khách hàng đã ngắt kết nối",
  connectionError: "Lỗi kết nối WebSocket",
  connectionRestored: "Đã khôi phục kết nối",
};

// ====== SYSTEM CONFIGURATION (DO NOT MODIFY) ======
/**
 * 🌐 WebSocket Configuration
 * These are automatically generated based on your Workers URL
 */
const WEBSOCKET_CONFIG = {
  // WebSocket URL is built from WORKERS_URL
  getWebSocketUrl: (roomID, peerID, nickname) => {
    const wsUrl = WORKERS_URL.replace("https://", "wss://").replace(
      "http://",
      "ws://"
    );
    return `${wsUrl}/chat/room/${roomID}?peerID=${peerID}&roomID=${roomID}&nickname=${encodeURIComponent(
      nickname
    )}`;
  },

  // Connection settings
  reconnectAttempts: 5,
  reconnectDelay: 3000,
  heartbeatInterval: 30000,
};

/**
 * 📋 Export configuration for use in main script
 * DO NOT MODIFY THIS SECTION
 */
if (typeof window !== "undefined") {
  window.AdminConfig = {
    SPREADSHEET_URL,
    WORKERS_URL,
    ADMIN_SETTINGS,
    THEME_COLORS,
    NOTIFICATION_MESSAGES,
    WEBSOCKET_CONFIG,
  };
}

/**
 * 🚀 DEPLOYMENT CHECKLIST:
 *
 * ✅ 1. Update SPREADSHEET_URL with your Apps Script URL
 * ✅ 2. Update WORKERS_URL with your Workers URL
 * ✅ 3. Customize ADMIN_SETTINGS for your team
 * ✅ 4. Test the configuration locally
 * ✅ 5. Deploy to GitHub Pages
 * ✅ 6. Set up custom domain (optional)
 *
 * 📝 NOTES:
 * - Keep this file secure - don't expose sensitive URLs publicly
 * - Test WebSocket connections after deployment
 * - Monitor the browser console for any configuration errors
 */
