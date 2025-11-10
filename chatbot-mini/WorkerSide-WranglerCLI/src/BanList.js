/**
 * 🚫 Ban List Management System
 *
 * This file manages banned IPs and Machine IDs to prevent abuse.
 *
 * 🔧 COMMUNITY CUSTOMIZATION:
 * Add problematic IPs or Machine IDs to the arrays below.
 * The system will automatically block these users from using the chatbot.
 */

// ====== BAN LISTS ======
/**
 * 📋 Banned IP Addresses
 * Add IP addresses that should be blocked from using the chatbot.
 *
 * Examples:
 * - "192.168.1.100" - Specific IP
 * - "10.0.0.0/8" - IP range (not implemented yet, use specific IPs)
 */
export const BANNED_IPS = [
  // Add banned IP addresses here
  // "192.168.1.100",
  // "203.0.113.0",
];

/**
 * 🔐 Banned Machine IDs
 * Add Machine IDs (browser fingerprints) that should be blocked.
 * Machine IDs are 16-character hex strings generated from browser fingerprints.
 *
 * Examples:
 * - "abc123def456789a" - Specific machine
 * - "xyz789abc123def4" - Another machine
 */
export const BANNED_MACHINE_IDS = [
  // Add banned Machine IDs here
  // "abc123def456789a",
  // "xyz789abc123def4",
];

// ====== BAN CHECK FUNCTIONS ======
/**
 * 🔍 Check if an IP or Machine ID is banned
 * @param {string} clientIP - Client's IP address
 * @param {string} machineId - Client's Machine ID
 * @returns {Object} Ban status and reason
 */
export function checkBanStatus(clientIP, machineId) {
  // Check IP ban
  if (BANNED_IPS.includes(clientIP)) {
    return {
      isBanned: true,
      reason: "ip_banned",
      message:
        "Địa chỉ IP này đã bị chặn. Vui lòng liên hệ admin nếu đây là lỗi.",
    };
  }

  // Check Machine ID ban
  if (BANNED_MACHINE_IDS.includes(machineId)) {
    return {
      isBanned: true,
      reason: "machine_banned",
      message:
        "Thiết bị này đã bị chặn. Vui lòng liên hệ admin nếu đây là lỗi.",
    };
  }

  // Not banned
  return {
    isBanned: false,
    reason: null,
    message: null,
  };
}

/**
 * 📊 Get ban list statistics
 * @returns {Object} Statistics about current ban lists
 */
export function getBanListStats() {
  return {
    bannedIPs: BANNED_IPS.length,
    bannedMachineIDs: BANNED_MACHINE_IDS.length,
    totalBanned: BANNED_IPS.length + BANNED_MACHINE_IDS.length,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * 🔧 COMMUNITY USAGE TIPS:
 *
 * 1. **Finding Machine IDs to ban:**
 *    - Check your Workers logs for repeated abuse
 *    - Look for the machineId field in debug logs
 *    - Machine IDs are consistent per browser/device
 *
 * 2. **Finding IPs to ban:**
 *    - Check Cloudflare Analytics for suspicious traffic
 *    - Look for repeated failed requests or spam
 *    - Consider geographic restrictions if needed
 *
 * 3. **Testing bans:**
 *    - Add your own IP/Machine ID temporarily
 *    - Test that the ban message appears correctly
 *    - Remove your info after testing
 *
 * 4. **Ban management:**
 *    - Keep this list updated regularly
 *    - Document reasons for bans (in comments)
 *    - Consider temporary vs permanent bans
 */
