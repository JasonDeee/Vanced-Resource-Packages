/**
 * Vanced Chatbot Generator SPA - JavaScript (Updated for 2-column layout)
 * Multi-step wizard functionality with live preview
 */

// Configuration state
let generatorConfig = {
  // Step 1: Theme & Colors
  selectedTheme: "vanced-default",
  colors: {
    primary: "#0c1136",
    secondary: "#e72166",
    tertiary: "#ffffff",
  },

  // Step 2: Basic Configuration
  workersUrl: "",
  botName: "Vanced Agency",
  botAvatar:
    "https://vanced.media/wp-content/uploads/woocommerce-placeholder.png",
  botTagline: "",
  recommendedMessages: ["", "", ""],

  // Step 3: Position & Behavior
  position: {
    side: "right",
    desktop: { bottom: 32, side: 32 },
    mobile: { bottom: 12, side: 12 },
  },
  behavior: {
    initialState: "minimized",
    showOnMobile: true,
  },
};

// Current step state (now 4 steps instead of 5)
let currentStep = 1;
const totalSteps = 4;

// Theme carousel state
let currentThemeIndex = 0;
const themes = [
  { id: "vanced-default", name: "Vanced Default", status: "available" },
  { id: "theme-slot-2", name: "Theme Slot 2", status: "coming-soon" },
  { id: "theme-slot-3", name: "Theme Slot 3", status: "coming-soon" },
  { id: "theme-slot-4", name: "Theme Slot 4", status: "coming-soon" },
  { id: "theme-slot-5", name: "Theme Slot 5", status: "coming-soon" },
];

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  initializeGenerator();
  setupEventListeners();
  updatePreview(); // Initial preview update
});

/**
 * Initialize generator
 */
function initializeGenerator() {
  console.log("🚀 Vanced Chatbot Generator initialized (2-column layout)");

  // Set initial form values
  document.getElementById("bot-name").value = generatorConfig.botName;
  document.getElementById("bot-avatar").value = generatorConfig.botAvatar;

  // Initialize color inputs
  updateColorInputs();

  // Initialize theme carousel
  initializeThemeCarousel();

  // Update step display
  updateStepDisplay();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
  // Navigation buttons
  document
    .getElementById("prev-btn")
    .addEventListener("click", goToPreviousStep);
  document.getElementById("next-btn").addEventListener("click", goToNextStep);

  // Step indicators (allow direct navigation)
  document.querySelectorAll(".step").forEach((step, index) => {
    step.addEventListener("click", () => goToStep(index + 1));
  });

  // Theme carousel
  document
    .getElementById("theme-prev")
    .addEventListener("click", previousTheme);
  document.getElementById("theme-next").addEventListener("click", nextTheme);

  // Theme indicators
  document.querySelectorAll(".indicator").forEach((indicator, index) => {
    indicator.addEventListener("click", () => selectTheme(index));
  });

  // Color inputs
  setupColorInputs();

  // Form inputs
  setupFormInputs();

  // Position inputs
  setupPositionInputs();

  // Preview controls
  setupPreviewControls();
}

/**
 * Setup color inputs
 */
function setupColorInputs() {
  const colorInputs = [
    { color: "primary-color", text: "primary-text", key: "primary" },
    { color: "secondary-color", text: "secondary-text", key: "secondary" },
    { color: "tertiary-color", text: "tertiary-text", key: "tertiary" },
  ];

  colorInputs.forEach(({ color, text, key }) => {
    const colorInput = document.getElementById(color);
    const textInput = document.getElementById(text);

    // Color picker change
    colorInput.addEventListener("change", (e) => {
      const value = e.target.value;
      textInput.value = value;
      generatorConfig.colors[key] = value;
      updatePreview();
    });

    // Text input change
    textInput.addEventListener("input", (e) => {
      const value = e.target.value;
      if (isValidColor(value)) {
        colorInput.value = value;
        generatorConfig.colors[key] = value;
        updatePreview();
      }
    });
  });
}

/**
 * Setup form inputs
 */
function setupFormInputs() {
  // Workers URL
  document.getElementById("workers-url").addEventListener("input", (e) => {
    generatorConfig.workersUrl = e.target.value;
    validateStep2();
  });

  // Bot name
  document.getElementById("bot-name").addEventListener("input", (e) => {
    generatorConfig.botName = e.target.value || "Vanced Agency";
    updatePreview();
  });

  // Bot avatar
  document.getElementById("bot-avatar").addEventListener("input", (e) => {
    generatorConfig.botAvatar =
      e.target.value ||
      "https://vanced.media/wp-content/uploads/woocommerce-placeholder.png";
    updatePreview();
  });

  // Bot tagline
  document.getElementById("bot-tagline").addEventListener("input", (e) => {
    generatorConfig.botTagline = e.target.value;
    updatePreview();
  });

  // Recommended messages
  for (let i = 1; i <= 3; i++) {
    document.getElementById(`rec-msg-${i}`).addEventListener("input", (e) => {
      generatorConfig.recommendedMessages[i - 1] = e.target.value;
      updatePreview();
    });
  }
}

/**
 * Setup position inputs
 */
function setupPositionInputs() {
  // Position side
  document.getElementById("position-side").addEventListener("change", (e) => {
    generatorConfig.position.side = e.target.value;
    updatePositionLabels();
    updatePreview();
  });

  // Desktop position
  document.getElementById("desktop-bottom").addEventListener("input", (e) => {
    generatorConfig.position.desktop.bottom = parseInt(e.target.value) || 32;
    updatePreview();
  });

  document.getElementById("desktop-side").addEventListener("input", (e) => {
    generatorConfig.position.desktop.side = parseInt(e.target.value) || 32;
    updatePreview();
  });

  // Mobile position
  document.getElementById("mobile-bottom").addEventListener("input", (e) => {
    generatorConfig.position.mobile.bottom = parseInt(e.target.value) || 12;
    updatePreview();
  });

  document.getElementById("mobile-side").addEventListener("input", (e) => {
    generatorConfig.position.mobile.side = parseInt(e.target.value) || 12;
    updatePreview();
  });

  // Initial state
  document.querySelectorAll('input[name="initial-state"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      generatorConfig.behavior.initialState = e.target.value;
      updatePreview();
    });
  });

  // Show on mobile
  document.getElementById("show-on-mobile").addEventListener("change", (e) => {
    generatorConfig.behavior.showOnMobile = e.target.checked;
    updatePreview();
  });
}

/**
 * Setup preview controls
 */
function setupPreviewControls() {
  document.querySelectorAll(".device-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Update active state
      document
        .querySelectorAll(".device-btn")
        .forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");

      // Update preview frame
      const device = e.target.dataset.device;
      const frame = document.getElementById("preview-frame");
      frame.className = `preview-frame ${device}`;

      updatePreview();
    });
  });

  // Preview chatbot interactions
  document.getElementById("preview-icon").addEventListener("click", () => {
    togglePreviewChatbot();
  });

  const closeBtn = document.querySelector(".preview-close");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      togglePreviewChatbot();
    });
  }
}

/**
 * Navigation functions
 */
function goToStep(step) {
  if (step < 1 || step > totalSteps) return;

  // Validate current step before moving
  if (step > currentStep && !validateCurrentStep()) {
    return;
  }

  // Hide current step
  document.querySelector(".step-content.active").classList.remove("active");

  // Show new step
  document.getElementById(`step-${step}`).classList.add("active");

  // Update current step
  currentStep = step;

  // Update UI
  updateStepDisplay();
  updateNavigationButtons();

  // Generate code if on final step
  if (step === 4) {
    generateAllCode();
  }

  // Always update preview (since it's always visible)
  updatePreview();
}

function goToNextStep() {
  goToStep(currentStep + 1);
}

function goToPreviousStep() {
  goToStep(currentStep - 1);
}

/**
 * Update step display
 */
function updateStepDisplay() {
  // Update progress steps
  document.querySelectorAll(".step").forEach((step, index) => {
    const stepNum = index + 1;
    step.classList.remove("active", "completed");

    if (stepNum === currentStep) {
      step.classList.add("active");
    } else if (stepNum < currentStep) {
      step.classList.add("completed");
    }
  });

  // Update step info
  document.getElementById("current-step").textContent = currentStep;
}

/**
 * Update navigation buttons
 */
function updateNavigationButtons() {
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  // Previous button
  prevBtn.disabled = currentStep === 1;

  // Next button
  if (currentStep === totalSteps) {
    nextBtn.textContent = "Hoàn thành";
    nextBtn.disabled = true; // Disable on final step
  } else {
    nextBtn.textContent = "Tiếp theo →";
    nextBtn.disabled = !validateCurrentStep();
  }
}

/**
 * Validate current step
 */
function validateCurrentStep() {
  switch (currentStep) {
    case 1:
      return true; // Theme selection always valid
    case 2:
      return validateStep2();
    case 3:
      return true; // Position always valid
    case 4:
      return true; // Generate always valid
    default:
      return true;
  }
}

/**
 * Validate step 2 (Basic Configuration)
 */
function validateStep2() {
  const workersUrl = document.getElementById("workers-url").value;
  const isValid = workersUrl.trim() !== "" && isValidUrl(workersUrl);

  // Update next button state
  setTimeout(() => updateNavigationButtons(), 0);

  return isValid;
}

/**
 * Theme carousel functions
 */
function initializeThemeCarousel() {
  updateThemeCarousel();
}

function nextTheme() {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;
  updateThemeCarousel();
}

function previousTheme() {
  currentThemeIndex = (currentThemeIndex - 1 + themes.length) % themes.length;
  updateThemeCarousel();
}

function selectTheme(index) {
  currentThemeIndex = index;
  updateThemeCarousel();
}

function updateThemeCarousel() {
  const slides = document.querySelector(".theme-slides");
  const indicators = document.querySelectorAll(".indicator");

  // Update slides position
  slides.style.transform = `translateX(-${currentThemeIndex * 100}%)`;

  // Update indicators
  indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === currentThemeIndex);
  });

  // Update selected theme
  generatorConfig.selectedTheme = themes[currentThemeIndex].id;

  // Update theme-specific colors if needed
  updateThemeColors();

  updatePreview();
}

/**
 * Update theme colors based on selected theme
 */
function updateThemeColors() {
  const themeColors = {
    "vanced-default": {
      primary: "#0c1136",
      secondary: "#e72166",
      tertiary: "#ffffff",
    },
    "theme-slot-2": {
      primary: "#2c3e50",
      secondary: "#3498db",
      tertiary: "#ffffff",
    },
    "theme-slot-3": {
      primary: "#27ae60",
      secondary: "#2ecc71",
      tertiary: "#ffffff",
    },
    "theme-slot-4": {
      primary: "#8e44ad",
      secondary: "#9b59b6",
      tertiary: "#ffffff",
    },
    "theme-slot-5": {
      primary: "#e67e22",
      secondary: "#f39c12",
      tertiary: "#ffffff",
    },
  };

  const colors = themeColors[generatorConfig.selectedTheme];
  if (colors) {
    generatorConfig.colors = { ...colors };
    updateColorInputs();
  }
}

/**
 * Update color inputs with current values
 */
function updateColorInputs() {
  document.getElementById("primary-color").value =
    generatorConfig.colors.primary;
  document.getElementById("primary-text").value =
    generatorConfig.colors.primary;
  document.getElementById("secondary-color").value =
    generatorConfig.colors.secondary;
  document.getElementById("secondary-text").value =
    generatorConfig.colors.secondary;
  document.getElementById("tertiary-color").value =
    generatorConfig.colors.tertiary;
  document.getElementById("tertiary-text").value =
    generatorConfig.colors.tertiary;
}

/**
 * Update position labels based on selected side
 */
function updatePositionLabels() {
  const side = generatorConfig.position.side;
  const sideLabel = side === "left" ? "Left" : "Right";

  document.getElementById(
    "desktop-side-label"
  ).textContent = `${sideLabel} (px)`;
  document.getElementById(
    "mobile-side-label"
  ).textContent = `${sideLabel} (px)`;
}

/**
 * Update preview - Always visible live preview
 */
function updatePreview() {
  const preview = document.getElementById("chatbot-preview");
  const icon = document.getElementById("preview-icon");
  const interface = document.getElementById("preview-interface");

  if (!preview || !icon || !interface) return;

  // Update colors
  const { primary, secondary, tertiary } = generatorConfig.colors;

  // Update icon
  icon.style.background = secondary;
  icon.style.border = `3px solid ${primary}`;

  // Update avatar
  const avatarImg = icon.querySelector("img");
  if (avatarImg) {
    avatarImg.src = generatorConfig.botAvatar;
  }

  // Update interface header
  const header = interface.querySelector(".preview-header");
  if (header) {
    header.style.background = primary;
  }

  // Update bot name and tagline
  const nameEl = document.getElementById("preview-bot-name");
  const taglineEl = document.getElementById("preview-bot-tagline");

  if (nameEl) nameEl.textContent = generatorConfig.botName;
  if (taglineEl)
    taglineEl.textContent = generatorConfig.botTagline || "Hỗ trợ 24/7";

  // Update avatar in interface
  const interfaceAvatar = interface.querySelector(".preview-avatar img");
  if (interfaceAvatar) {
    interfaceAvatar.src = generatorConfig.botAvatar;
  }

  // Update recommended messages
  updatePreviewRecommendations();

  // Update position
  updatePreviewPosition();

  // Update initial state
  updatePreviewState();
}

/**
 * Update preview recommendations
 */
function updatePreviewRecommendations() {
  const container = document.getElementById("preview-recommendations");
  if (!container) return;

  container.innerHTML = "";

  generatorConfig.recommendedMessages.forEach((msg) => {
    if (msg.trim()) {
      const rec = document.createElement("div");
      rec.className = "preview-recommendation";
      rec.textContent = msg;
      container.appendChild(rec);
    }
  });
}

/**
 * Update preview position
 */
function updatePreviewPosition() {
  const preview = document.getElementById("chatbot-preview");
  const frame = document.getElementById("preview-frame");

  if (!preview || !frame) return;

  const isDesktop = frame.classList.contains("desktop");
  const position = isDesktop
    ? generatorConfig.position.desktop
    : generatorConfig.position.mobile;
  const side = generatorConfig.position.side;

  preview.style.bottom = `${position.bottom}px`;

  if (side === "left") {
    preview.style.left = `${position.side}px`;
    preview.style.right = "auto";
  } else {
    preview.style.right = `${position.side}px`;
    preview.style.left = "auto";
  }
}

/**
 * Update preview state
 */
function updatePreviewState() {
  const icon = document.getElementById("preview-icon");
  const interface = document.getElementById("preview-interface");

  if (!icon || !interface) return;

  if (generatorConfig.behavior.initialState === "minimized") {
    icon.style.display = "flex";
    interface.style.display = "none";
  } else {
    icon.style.display = "none";
    interface.style.display = "flex";
  }
}

/**
 * Toggle preview chatbot
 */
function togglePreviewChatbot() {
  const icon = document.getElementById("preview-icon");
  const interface = document.getElementById("preview-interface");

  if (!icon || !interface) return;

  if (icon.style.display !== "none") {
    icon.style.display = "none";
    interface.style.display = "flex";
  } else {
    icon.style.display = "flex";
    interface.style.display = "none";
  }
}

/**
 * Generate all code
 */
function generateAllCode() {
  generateCSSVariables();
  generateConfigCode();
  generateMainScript();
}

/**
 * Generate CSS variables code
 */
function generateCSSVariables() {
  const { primary, secondary, tertiary } = generatorConfig.colors;
  const { position, behavior } = generatorConfig;

  const cssCode = `<!-- 1. CSS Variables & Theme -->
<style>
:root {
  --chatbot-primary: ${primary};
  --chatbot-secondary: ${secondary};
  --chatbot-tertiary: ${tertiary};
  --chatbot-position-bottom-desktop: ${position.desktop.bottom}px;
  --chatbot-position-${position.side}-desktop: ${position.desktop.side}px;
  --chatbot-position-bottom-mobile: ${position.mobile.bottom}px;
  --chatbot-position-${position.side}-mobile: ${position.mobile.side}px;
  --chatbot-avatar-url: url('${generatorConfig.botAvatar}');
}

@media (max-width: 768px) {
  :root {
    --chatbot-position-bottom: var(--chatbot-position-bottom-mobile);
    --chatbot-position-${position.side}: var(--chatbot-position-${position.side}-mobile);
  }
}

@media (min-width: 769px) {
  :root {
    --chatbot-position-bottom: var(--chatbot-position-bottom-desktop);
    --chatbot-position-${position.side}: var(--chatbot-position-${position.side}-desktop);
  }
}
</style>

<!-- Theme CSS -->
<link rel="stylesheet" href="https://cdn.vanced.media/chatbot-mini/style/${generatorConfig.selectedTheme}.css">`;

  const codeEl = document.getElementById("css-variables-code");
  if (codeEl) {
    codeEl.innerHTML = `<code>${escapeHtml(cssCode)}</code>`;
  }
}

/**
 * Generate configuration code
 */
function generateConfigCode() {
  const configCode =
    `<!-- 2. Configuration Object -->
<script>
window.VancedChatbotConfig = {
  workersUrl: "${generatorConfig.workersUrl}",
  chatbotName: "${generatorConfig.botName}",
  avatarUrl: "${generatorConfig.botAvatar}",
  tagline: "${generatorConfig.botTagline}",
  recommendedMessages: ${JSON.stringify(
    generatorConfig.recommendedMessages.filter((msg) => msg.trim())
  )},
  position: {
    side: "${generatorConfig.position.side}",
    desktop: {
      bottom: ${generatorConfig.position.desktop.bottom},
      ${generatorConfig.position.side}: ${generatorConfig.position.desktop.side}
    },
    mobile: {
      bottom: ${generatorConfig.position.mobile.bottom},
      ${generatorConfig.position.side}: ${generatorConfig.position.mobile.side}
    }
  },
  behavior: {
    initialState: "${generatorConfig.behavior.initialState}",
    showOnMobile: ${generatorConfig.behavior.showOnMobile}
  },
  theme: "${generatorConfig.selectedTheme}"
};
<` + `/script>`;

  const codeEl = document.getElementById("config-code");
  if (codeEl) {
    codeEl.innerHTML = `<code>${escapeHtml(configCode)}</code>`;
  }
}

/**
 * Generate main script code
 */
function generateMainScript() {
  const mainCode =
    `<!-- 3. Main Chatbot Script -->
<script src="https://cdn.vanced.media/chatbot-mini/scripts/newest/generator.js"><` +
    `/script>`;

  const codeEl = document.getElementById("main-script-code");
  if (codeEl) {
    codeEl.innerHTML = `<code>${escapeHtml(mainCode)}</code>`;
  }
}

/**
 * Copy code to clipboard
 */
function copyCode(type) {
  let code = "";

  switch (type) {
    case "css-variables":
      code = document.getElementById("css-variables-code").textContent;
      break;
    case "config":
      code = document.getElementById("config-code").textContent;
      break;
    case "main-script":
      code = document.getElementById("main-script-code").textContent;
      break;
  }

  navigator.clipboard
    .writeText(code)
    .then(() => {
      // Visual feedback
      const btn = event.target;
      const originalText = btn.textContent;
      btn.textContent = "✅ Copied!";
      btn.style.background = "#10b981";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "#0c1136";
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy: ", err);
      alert("Không thể copy tự động. Vui lòng copy thủ công.");
    });
}

/**
 * Download configuration as JSON
 */
function downloadConfig() {
  const config = {
    ...generatorConfig,
    generatedAt: new Date().toISOString(),
    version: "1.0.0",
  };

  const blob = new Blob([JSON.stringify(config, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `vanced-chatbot-config-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

/**
 * Utility functions
 */
function isValidColor(color) {
  const s = new Option().style;
  s.color = color;
  return s.color !== "";
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  return text.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
}

// Debug functions
window.VancedGeneratorDebug = {
  getConfig: () => generatorConfig,
  setConfig: (config) => {
    generatorConfig = { ...generatorConfig, ...config };
  },
  goToStep: goToStep,
  updatePreview: updatePreview,
  generateAllCode: generateAllCode,
};

console.log(
  "🎯 Vanced Chatbot Generator SPA loaded successfully (2-column layout)!"
);
