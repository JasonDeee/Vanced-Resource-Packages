import { VancedPopUpAnimation } from "./animation.js";

class VancedPopUpGenerator {
  constructor() {
    const globalConfig = window.UserJoinedPopUpConfig || {};

    // Default Data
    // Default Data with Gender
    this.names = globalConfig.names || [
      { name: "Nguyễn Văn An", gender: "male" },
      { name: "Trần Thị Bích", gender: "female" },
      { name: "Lê Văn Cường", gender: "male" },
      { name: "Phạm Thị Dung", gender: "female" },
      { name: "Hoàng Văn Em", gender: "male" },
      { name: "Đặng Thị Hoa", gender: "female" },
      { name: "Bùi Văn Giang", gender: "male" },
      { name: "Vũ Thị Hồng", gender: "female" },
      { name: "Ngô Văn Hùng", gender: "male" },
      { name: "Dương Thị Kim", gender: "female" },
    ];
    // Avatar lists
    this.avatarsMale = globalConfig.avatarsMale || [];
    this.avatarsFemale = globalConfig.avatarsFemale || [];
    this.useAvatar =
      globalConfig.useAvatar !== undefined ? globalConfig.useAvatar : false;

    this.viewerRange = globalConfig.viewerRange || { min: 15, max: 50 };

    // DOM Elements
    const container = document.querySelector(
      globalConfig.containerSelector || "#vanced-popup-container",
    );
    this.imgContainer = container
      ? container.querySelector(".vanced-popup-image")
      : null;
    this.imgEl = container
      ? container.querySelector("#vanced-popup-img")
      : null; // Scope to container too just in case, though ID should be unique.
    this.msgEl = container
      ? container.querySelector("#vanced-popup-message")
      : null;
    this.timeEl = container
      ? container.querySelector("#vanced-popup-time")
      : null;

    // State
    this.isViewerMode = true;
    this.isPlaying = false; // Default Paused
    this.loopTimeout = null;

    // Animation Instance
    this.animator = new VancedPopUpAnimation({
      containerSelector: "#vanced-popup-container",
      displayDuration: globalConfig.displayDuration || 5000,
      delayBetween: globalConfig.delayBetween || 3000,
    });

    // Start Loop if configured to auto-play (default false for preview, true for export)
    if (globalConfig.autoPlay) {
      this.play();
    }
  }

  // ... existing methods ...

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  getRandomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  updateContent() {
    if (this.isViewerMode) {
      // SHOW VIEWER COUNT - Hide Avatar
      const count = this.getRandomInt(
        this.viewerRange.min,
        this.viewerRange.max,
      );
      this.msgEl.innerHTML = `Hiện đang có <span class="vanced-highlight">${count}</span> người đang xem sản phẩm này`;

      // Logic: Hide Image Container for Viewer Mode as per request
      if (this.imgContainer) this.imgContainer.style.display = "none";

      this.timeEl.textContent = "Trực tiếp";
    } else {
      // SHOW PURCHASE NOTIFICATION
      // Item from this.names is now an object {name, gender}
      const person = this.getRandomItem(this.names);
      // Handle if person is just a string (legacy support)
      const nameText = typeof person === "object" ? person.name : person;
      const gender = typeof person === "object" ? person.gender : "neutral";

      let content = `<span class="vanced-highlight">${nameText}</span> vừa đặt hàng thành công`;

      this.msgEl.innerHTML = content;
      this.timeEl.textContent = "Vừa xong";

      // Avatar Logic
      if (this.useAvatar) {
        let avatarUrl = "https://via.placeholder.com/50";

        // Logic Phase 10: Match Gender
        let targetList = [];
        if (gender === "male") targetList = this.avatarsMale;
        else if (gender === "female") targetList = this.avatarsFemale;

        // Fallback if list empty or gender neutral
        if (targetList.length === 0) {
          // Try the other list or combine
          targetList = [...this.avatarsMale, ...this.avatarsFemale];
        }

        if (targetList.length > 0) {
          avatarUrl = this.getRandomItem(targetList);
        }

        this.imgEl.src = avatarUrl;
        if (this.imgContainer) this.imgContainer.style.display = "block";
      } else {
        // If not using avatar, hide image container
        if (this.imgContainer) this.imgContainer.style.display = "none";
      }
    }

    this.isViewerMode = !this.isViewerMode;
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.runCycle();
  }

  pause() {
    this.isPlaying = false;
    if (this.loopTimeout) clearTimeout(this.loopTimeout);
    this.animator.hide(); // Hide current
  }

  runCycle() {
    if (!this.isPlaying) return;

    this.updateContent();
    this.animator.show();
    // Total wait = display duration + delay between
    const totalWait =
      this.animator.displayDuration + this.animator.delayBetween;

    this.loopTimeout = setTimeout(() => {
      this.runCycle();
    }, totalWait);
  }
}

// Initialize on load
document.addEventListener("DOMContentLoaded", () => {
  // Only init if not already present (in case of double inclusion or builder logic)
  if (!window.vancedPopUp) {
    window.vancedPopUp = new VancedPopUpGenerator();
  }
});
