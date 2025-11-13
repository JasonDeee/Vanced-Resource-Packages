/**
 * Vanced Chatbot - UI Generator - Main CDN Script
 * Version: 1.0.0
 *
 * This script is loaded via CDN and injects the chatbot into user's website
 * genUI CDN URL: https://cdn.vanced.media/chatbot-mini/scripts/newest/generator.js
 */

// Auto Inject - Tự động generate tất cả thẻ HTML cần thiết dựa trên các Configuration Object
// window.VancedChatbotConfig = {
//   workersUrl: "https://vanced-chatbot.caocv-work.workers.dev/",
//   chatbotName: "Vanced Agency",
//   avatarUrl:
//     "https://vanced.media/wp-content/uploads/woocommerce-placeholder.png",
//   tagline: "Okay Brah",
//   recommendedMessages: ["Nop ", "Scné", "ewdgewf"],
//   position: {
//     side: "right",
//     desktop: {
//       bottom: 32,
//       right: 32,
//     },
//     mobile: {
//       bottom: 12,
//       right: 12,
//     },
//   },
//   behavior: {
//     initialState: "minimized",
//     showOnMobile: true,
//   },
//   theme: "vanced-default",
// };

(function () {
  "use strict";

  // Prevent multiple initialization
  if (window.VancedChatbotInitialized) {
    console.warn("[Vanced Chatbot] Already initialized");
    return;
  }

  // Get configuration
  const config = window.VancedChatbotConfig || {};

  // Validate required config
  if (!config.workersUrl) {
    console.error(
      "[Vanced Chatbot] Missing required workersUrl in VancedChatbotConfig"
    );
    return;
  }

  // Default values
  const chatbotName = config.chatbotName || "Vanced Agency";
  const avatarUrl =
    config.avatarUrl ||
    'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%234A90E2" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="40" text-anchor="middle" dy=".3em" fill="white"%3EV%3C/text%3E%3C/svg%3E';
  const tagline = config.tagline || "Hỏi tôi bất cứ điều gì";
  const recommendedMessages = config.recommendedMessages || [
    "Tôi cần hỗ trợ về sản phẩm",
    "Làm thế nào để liên hệ?",
    "Chính sách bảo hành như thế nào?",
  ];
  const behavior = config.behavior.initialState || "expanded"; // "minimized" or "expanded"

  // Track if OpusChat.js has been loaded
  let opusChatLoaded = false;

  /**
   * Load OpusChat.js script - Main chat logic
   */
  function loadOpusChatScript() {
    if (opusChatLoaded) {
      console.log("[Vanced Chatbot] OpusChat.js already loaded");
      return;
    }

    console.log("[Vanced Chatbot] Loading OpusChat.js...");

    const Chatscript = document.createElement("script");
    const machineIDscript = document.createElement("script");

    // Swap giữa môi trường dev và host (Nếu location là http://127.0.0.1:5500/)
    machineIDscript.type = "module";
    machineIDscript.async = true;
    Chatscript.type = "module";
    Chatscript.async = true;

    if (location.hostname === "127.0.0.1") {
      Chatscript.src = "./OpusChat.js";
      machineIDscript.src = "./MachineID.js";
    } else {
      Chatscript.src =
        "https://cdn.vanced.media/chatbot-mini/scripts/newest/OpusChat.js";
      machineIDscript.src =
        "https://cdn.vanced.media/chatbot-mini/scripts/newest/MachineID.js";
    }

    machineIDscript.onload = function () {
      console.log("[Vanced Chatbot] OpusChat.js loaded successfully");
      document.body.appendChild(Chatscript);
    };

    machineIDscript.onerror = function () {
      console.error("[Vanced Chatbot] Failed to load OpusChat.js");
    };

    document.body.appendChild(machineIDscript);
    opusChatLoaded = true;
  }

  /**
   * Generate HTML structure - Y HỆT như Simple-ChatBot.html
   */
  function generateChatbotHTML() {
    const minimizedClass = behavior === "minimized" ? " minimized" : "";
    const html = `
      <div class="Vx_Chatbot">
         <div
              class="OpusPC_RequestForRealAssist_Message"
              style="display: none"
            >
              <main class="OpusPC_RequestForRealAssist_Message__Contents">
                <h2>Chuyển hướng gặp<br />tư vấn viên.</h2>
                <p>
                  Không phải mô hình nào cũng hoàn hảo, đôi khi chúng mắc lỗi.
                  Bạn có thể yêu cầu chat với CSKH hoặc
                  <font style="color: var(--AccentColor)"
                    >tiếp tục trò chuyện với Opus</font
                  >
                  về lỗi bạn đang gặp phải.
                </p>
              </main>
              <footer class="OpusPC_Slot_Footer">
                <button class="Opus_RequestForRealAssist_Button">
                  Gặp tư vấn viên
                </button>
                <button class="Opus_StayWithOpus_Button">
                  Tiếp tục với Opus
                </button>
              </footer>
            </div>
        <div class="OpusAgent_Containter${minimizedClass}">
          <div class="OpusAgent_ChatInterface Pending">
            <div class="Vx_chat-container" id="Vx_chatContainer">
              <header class="Vx_ChatBotHeader">
                <div class="Vx_ChatBotLogo">
                  <img
                    src="${avatarUrl}"
                    alt="${chatbotName} | Avatar Cover"
                  />
                </div>
                <h1 class="Vx_ChatBotTitle">
                  ${chatbotName} <span>| ${tagline}</span>
                </h1>
                <div id="AdditionInfo">
                  <div class="Minimize_Button"></div>
                </div>
              </header>
              <div class="Vx_chat-messages" id="Vx_chatMessages">
                <!-- Tin nhắn sẽ được hiển thị ở đây -->
              </div>

              <div class="Vx_chat-input">
                <div class="Vx_Recommendation_Question">
                  ${recommendedMessages
                    .map((msg) => `<p>${msg}</p>`)
                    .join("\n                  ")}
                </div>
                <div class="Vx_Input_Area">
                  <input
                    type="text"
                    id="Vx_messageInput"
                    placeholder="Nhập tin nhắn của bạn..."
                  />
                  <button id="Vx_sendButton">Gửi</button>
                  <nav class="Vx_ChatBotNav"></nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    return html;
  }

  /**
   * Setup toggle minimize/expand functionality
   */
  function setupAdditionalEvents() {
    const container = document.querySelector(".OpusAgent_Containter");
    const logo = document.querySelector(".Vx_ChatBotLogo");
    const minimizeBtn = document.querySelector(".Minimize_Button"); // Cho Minimize Event

    const recommendationElement = document.querySelector(
      ".Vx_Recommendation_Question"
    ); // Cho cuộn phần gợi ý bên trên input người dùng

    if (!container || !logo || !minimizeBtn) {
      console.error("[Vanced Chatbot] Toggle elements not found");
      return;
    }

    // Click logo to expand when minimized
    logo.addEventListener("click", function () {
      container.classList.remove("minimized");
      console.log("[Vanced Chatbot] Expanded");

      // Load OpusChat.js on first click if behavior is "minimized"
      if (behavior === "minimized" && !opusChatLoaded) {
        loadOpusChatScript();
      }
    });

    // Click minimize button to minimize
    minimizeBtn.addEventListener("click", function () {
      console.log("[Vanced Chatbot] Minimized");

      container.classList.add("minimized");
    });

    // cuộn phần gợi ý input người dùng

    if (recommendationElement) {
      recommendationElement.addEventListener(
        "wheel",
        function (e) {
          // Ngăn chặn hành vi cuộn dọc mặc định
          e.preventDefault();

          // Lấy giá trị cuộn dọc và chuyển thành cuộn ngang
          const scrollAmount = e.deltaY;

          // Áp dụng cuộn ngang
          this.scrollLeft += scrollAmount;
        },
        { passive: false }
      ); // passive: false để có thể preventDefault
    }

    console.log("[Vanced Chatbot] Toggle events setup successfully");
  }

  /**
   * Inject chatbot into DOM
   */
  function injectChatbot() {
    console.log("[Vanced Chatbot] Injecting chatbot HTML...");

    // Create wrapper div
    const chatbotWrapper = document.createElement("div");
    chatbotWrapper.innerHTML = generateChatbotHTML();

    // Insert before closing body tag
    document.body.appendChild(chatbotWrapper.firstElementChild);

    console.log("[Vanced Chatbot] HTML injected successfully");

    // Setup toggle events
    setupAdditionalEvents();

    // Mark as initialized
    window.VancedChatbotInitialized = true;

    // Load OpusChat.js immediately if behavior is "expanded"
    if (behavior === "expanded") {
      loadOpusChatScript();
    }
  }

  /**
   * Initialize when DOM is ready
   */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectChatbot);
  } else {
    // DOM already loaded
    injectChatbot();
  }

  console.log("[Vanced Chatbot] Generator script loaded");
})();
