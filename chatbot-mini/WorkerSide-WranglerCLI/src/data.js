// ====== [GitHub Copilot: I was here! 🦾] ======
// ====== CONFIGURATION FOR COMMUNITY ======
/**
 * Chat Mode Configuration
 * Set this to true if you want to collect phone numbers from users
 * Set this to false for general information chatting
 *
 * IMPORTANT: When changing this mode, you should also update:
 * - TUNED_DATA: Add phone number collection examples
 * - SYSTEM_PROMPT_TEMPLATE: Add phone number collection instructions
 * - SYSTEM_PROMT_SUFFIX: Update schema description
 */
export const isPhoneNumberCollectMode = true; // Change this to true for phone collection mode

// ====== TUNED DATA ======
/**
 * Dữ liệu tuned cho Customer Support Chatbot
 * Format: [Câu hỏi]-[Câu trả lời]
 * Mỗi cặp Q&A được phân tách bằng dấu xuống dòng
 *
 * FOR PHONE COLLECTION MODE: Add examples like:
 * [Số điện thoại]-[Để tôi có thể hỗ trợ bạn tốt hơn, bạn có thể cho tôi số điện thoại được không?]
 * [Liên hệ lại]-[Vui lòng cung cấp số điện thoại để chúng tôi liên hệ lại với bạn.]
 */
export const TUNED_DATA = `
[Xin chào]-[Xin chào! Tôi là trợ lý ảo của Vanced Agency. Tôi có thể giúp gì cho bạn hôm nay?]
[Công ty làm gì]-[Vanced Agency là công ty chuyên cung cấp các giải pháp công nghệ và phát triển ứng dụng web, mobile. Chúng tôi tập trung vào việc tạo ra những s[...] 
[Liên hệ]-[Bạn có thể liên hệ với chúng tôi qua email: contact@vanced.agency hoặc gọi hotline: 1900-xxxx. Chúng tôi luôn sẵn sàng hỗ trợ bạn.]
[Giờ làm việc]-[Chúng tôi làm việc từ thứ 2 đến thứ 6, từ 8:00 - 17:30. Thứ 7 từ 8:00 - 12:00. Chủ nhật nghỉ.]
[Dịch vụ]-[Chúng tôi cung cấp các dịch vụ: Phát triển website, ứng dụng mobile, tư vấn công nghệ, thiết kế UI/UX, và các giải pháp số hóa doanh nghiệp.]
`;

/**
 * System prompt template cho chatbot
 *
 * COMMUNITY CUSTOMIZATION:
 * - Replace "Vanced Agency" with your company name
 * - Update company description and services
 * - For PHONE COLLECTION MODE: Add phone number collection instructions
 * - For INFO MODE: Keep focus on providing helpful information
 */
export const SYSTEM_PROMPT_TEMPLATE = `Bạn là trợ lý ảo của Vanced Agency, một công ty công nghệ chuyên nghiệp. Hãy trả lời các câu hỏi của khách hàng một cách t[...] 

Thông tin về công ty và các câu hỏi thường gặp:
{TUNED_DATA}

Hướng dẫn trả lời:
1. Luôn giữ thái độ thân thiện và chuyên nghiệp
2. Nếu không biết thông tin, hãy thành thật và đề xuất liên hệ với nhân viên hỗ trợ
3. Nếu khách hàng yêu cầu hỗ trợ phức tạp hoặc cần tư vấn chi tiết, hãy đề xuất chuyển sang nhân viên hỗ trợ
4. Trả lời ngắn gọn, súc tích nhưng đầy đủ thông tin
5. Sử dụng tiếng Việt tự nhiên, dễ hiểu`;

export const SYSTEM_PROMT_SUFFIX = `Hãy trả lời theo Schema:
responseMessage là nội dung trả lời chính.
isRequestForRealPerson là true nếu cần liên hệ với nhân viên hỗ trợ, false nếu không cần.
Summerize là phần tóm tắt ngắn gọn cuộc hội thoại hiện tại.
PhoneNumber là số điện thoại của khách hàng nếu họ cung cấp.
`;

/**
 * Hàm xử lý dữ liệu tuned thành format phù hợp cho system prompt
 */
export function processTunedData(tunedData) {
  return tunedData
    .split("\n")
    .filter((line) => line.trim() && line.includes("]-"))
    .map((line) => {
      const match = line.match(/\[(.+?)\]-\[(.+?)\]/);
      if (match) {
        return `Q: ${match[1]}\nA: ${match[2]}`;
      }
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}