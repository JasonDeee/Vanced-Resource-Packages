# Thông tin về các config sử dụng trong Generator

Dự án hiện tại tôi - Dev - tạo ra với mục đích trở thành template chat bot chia sẻ cho cộng đồng.

## Có sử dụng

### Step 1. Theme & Color

Màn hình step 1 này sẽ có dạng carousel/gallery: có hình thu nhỏ và 2 mũi tên điều hướng carousel, mỗi thumbnail sẽ đại diện cho một theme khi click vào thumb.

- Chọn theme: Radio Input chính là các thumbnail
- Chọn 3 màu sắc: tất cả các theme đều chỉ sử dụng 3 màu. Trong CSS sẽ có 3 màu sắc chính là: `primary`, `secondary` và `tertiary`

Mỗi một theme sẽ là một file css khác nhau, và các theme không chỉ khác nhau về màu sắc mà còn khác về thêm Border Radius, outline style, font style, v.v. Nói cách khác, mỗi theme là một style thiết kế khác nhau.

Scripts trong Generator sẽ tạo thêm một đoạn style dạng:

```html
<style>
  ::root {
    --primary: #0c1136;
    --secondary: #e72166;
    --tertiary: #ffffff;
  }
</style>
```

\*\*\*Lưu ý: Dev sẽ tự thiết kế theme sau. Hãy tối ưu màn hình này thật đơn giản cho việc Dev thêm/bớt theme sau này.

### Step 2. Basic Configuration

- Worker's URL: Quan trọng nhất (Required, không có giá trị mặc định, có hint)

- Tên bot: Text Input (Bên dưới là 1 dòng gợi ý 12 ký tự sẽ tối ưu nhất cho UI)
- Hình đại diện (Bot Avatar): URL Input
- Bot Tagline: Text Input (Ngắn, non-required, khoảng 16 kí tự)

- Tin nhắn gợi ý (Initial Recommended messages): 3 input, không bắt buộc, mỗi input là 1 dòng

### Step 3. Bot Behaviour & Position

- Vị trí: Dropdown gồm Left hoặc Right; bên dưới là 2 input để nhập bottom và left/right

_Behaviour_

- Khi tải trang: Radio select 2 giá trị. "Thu nhỏ" hoặc "mở rộng"
  _Boxchat của Bot có thể dược Minimize thành 1 icon và khi click vào sẽ mở rộng lại._
- Hiện chat bot trên cả Mobile: Checkbox, mặc định là checked.

### Step 4. Final Preview & Generate

## Không sử dụng trong Generator UI

- **App Script URL**: Người dùng sẽ tự thêm URL này thủ công tại code của màn hình Admin và Env của Worker để đảm bảo an toàn
- **Chế độ hoạt động (Info Mode/Phone Collection Mode)**:

```
CollectMode chỉ quyết định model trong workers schema trả về có dạng thế nào. cả 2 mode đều sử dụng chung các data như TUNED_DATA, SYSTEM_PROMPT_TEMPLATE và SYSTEM_PROMT_SUFFIX.

Khi cộng đồng muốn thay đổi mode, họ sẽ phải chỉnh sửa lại các data này để phù hợp với mục đích.

Nói cách khác, CollectMode là chế độ cộng đồng sẽ phải cấu hình ngay từ đầu và rất hiếm khi thay đổi về sau.
```

## Technical Implementation Details

### CSS Variable System

Generator sẽ tạo CSS variables cho theme customization:

```css
:root {
  --chatbot-primary: #0c1136;
  --chatbot-secondary: #e72166;
  --chatbot-tertiary: #ffffff;
  --chatbot-position-bottom: 20px;
  --chatbot-position-right: 20px;
  --chatbot-avatar-url: url("default-avatar.png");
}
```

### Generated Code Structure

```html
<!-- 1. Theme Variables -->
<style>
  /* CSS variables */
</style>

<!-- 2. Configuration Object -->
<script>
  window.VancedChatbotConfig = {
    workersUrl: "user-input",
    chatbotName: "user-input",
    avatarUrl: "user-input",
    tagline: "user-input",
    recommendedMessages: ["msg1", "msg2", "msg3"],
    position: { side: "right", bottom: "20px", right: "20px" },
    behavior: "minimized", // or "expanded"
  };
</script>

<!-- 3. Theme CSS -->
<link
  rel="stylesheet"
  href="https://cdn.vanced.media/chatbot-mini/style/{theme}.css"
/>

<!-- 4. Main Script -->
<script src="https://cdn.vanced.media/chatbot-mini/scripts/chatbot.js"></script>
```

### File Structure Requirements

```
Templates/style/
├── base-theme.css          # Base styles với CSS variables
├── modern-blue.css         # Theme với default colors
├── corporate-gray.css      # Theme với default colors
├── friendly-green.css      # Cần tạo mới
├── custom.css             # Template cho custom theme
└── theme-variables.css    # CSS variables definitions
```
