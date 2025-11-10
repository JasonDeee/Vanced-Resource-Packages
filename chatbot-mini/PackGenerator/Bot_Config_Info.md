# Thông tin về các config sử dụng trong Generator

Dự án hiện tại tôi - Dev - tạo ra với mục đích trở thành template chat bot chia sẻ cho cộng đồng.

## Có sử dụng

### Step 1. Theme & Color

**Theme Carousel System:**

- **5 theme slots** với thumbnail navigation
- **Theme 1**: "Vanced Default" (theme mặc định)
- **Theme 2-5**: Slots dành cho themes khác (dễ thêm/bớt sau)
- Mỗi theme = file CSS riêng với design khác nhau (border-radius, outline, font, etc.)

**Color Customization:**

- **3 color inputs**: Primary, Secondary, Tertiary
- **No color picker**: Chỉ input fields
- **CSS Variables**: Generator tạo CSS variables

```html
<style>
  :root {
    --chatbot-primary: #0c1136;
    --chatbot-secondary: #e72166;
    --chatbot-tertiary: #ffffff;
  }
</style>
```

**Theme Structure:**

- Mỗi theme khác nhau về design, không chỉ màu sắc
- Dễ dàng thêm/bớt themes trong tương lai

### Step 2. Basic Configuration

- **Worker's URL**: Quan trọng nhất (Required, không có giá trị mặc định, có hint)

- **Tên bot**: Text Input (Gợi ý: 12 ký tự sẽ tối ưu nhất cho UI)
- **Hình đại diện (Bot Avatar)**: URL Input
  - Supported formats: JPG, PNG, SVG, WebP
  - Default: `https://vanced.media/wp-content/uploads/woocommerce-placeholder.png`
  - Auto-update preview khi paste URI
- **Bot Tagline**: Text Input (Ngắn, non-required, ~16 ký tự)

- **Tin nhắn gợi ý**: 3 inputs, không bắt buộc, mỗi input là 1 dòng

### Step 3. Bot Behaviour & Position

**Position System:**

- Vị trí: Dropdown gồm Left hoặc Right
- **Desktop Position**: 2 inputs (bottom + left/right) - default: 32px
- **Mobile Position**: 2 inputs (bottom + left/right) - default: 12px
- Preview toggle: Desktop/Mobile view switcher

**Behaviour:**

- Khi tải trang: Radio select 2 giá trị "Thu nhỏ" hoặc "mở rộng"
  - **"Thu nhỏ"**: Icon → Click → UI gọi Worker
  - **"Mở rộng"**: Append HTML → UI gọi Worker
- Hiện chat bot trên cả Mobile: Checkbox, mặc định là checked

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
├── VancedDefault.scss      # ✅ Theme mặc định (đã tạo)
├── VancedDefault.css       # Compiled từ SCSS
├── theme-slot-2.scss       # Slot 2 - chờ thiết kế
├── theme-slot-3.scss       # Slot 3 - chờ thiết kế
├── theme-slot-4.scss       # Slot 4 - chờ thiết kế
├── theme-slot-5.scss       # Slot 5 - chờ thiết kế
└── theme-variables.css     # CSS variables definitions
```

**Theme Naming Convention:**

- **Theme 1**: "Vanced Default" → `VancedDefault.scss`
- **Theme 2-5**: Tên sẽ được đặt khi thiết kế (dễ thay đổi)

## ✅ Thông tin đã xác nhận

### 1. Theme System Details ✅

- **Số lượng themes**: 5 slots trong carousel (Vanced Default + 4 themes khác)
- **Theme structure**: Mỗi theme là file CSS riêng biệt với design khác nhau
- **Theme differences**: Không chỉ màu sắc mà còn border-radius, outline style, font style
- **Color system**: 3 input màu cho primary, secondary, tertiary (không cần color picker)
- **Theme carousel**: 5 slots với tên dễ tìm và thay thế
- **Theme 1**: "Vanced Default" (theme mặc định)

### 2. Avatar System ✅

- **Upload method**: User tự upload lên host của họ (Imgur, etc.) và paste URI
- **Supported formats**: JPG, PNG, SVG, WebP
- **Default avatar**: `https://vanced.media/wp-content/uploads/woocommerce-placeholder.png`
- **Preview update**: Tự động update preview khi paste URI
- **Format hints**: Gợi ý format ảnh phù hợp cho user

### 3. Position System Details ✅

- **Responsive behavior**: Toggle Desktop/Mobile preview trong generator
- **Position inputs**: 4 inputs chia 2 cặp:
  - Desktop: bottom + left/right (default: 32px)
  - Mobile: bottom + left/right (default: 12px)
- **No coordinate limits**: Không giới hạn min/max values
- **Mobile display**: Checkbox "Hiện chat bot trên cả Mobile" (default: checked)

### 4. Validation Rules ❌

- **Not implemented**: Trước mắt không cần validation rules

### 5. Preview System ✅

- **Live preview**: Real-time update khi user thay đổi config
- **Preview modes**: Desktop và Mobile toggle
- **Interactive preview**: Basic functionality testing

### 6. Code Generation & Deployment ✅

- **CDN Base URL**: `https://cdn.vanced.media/chatbot-mini`
- **Generator access**: `https://cdn.vanced.media/chatbot-mini/PackGenerator/generator.html`
- **Main script**: `https://cdn.vanced.media/chatbot-mini/scripts/newest/generator.js`
- **User workflow**: Access generator → Complete steps → Get code → Paste to website
- **Comments**: Có thêm comments hướng dẫn trong generated code

### 7. Advanced Features ❌

- **Not needed**: Không cần animation controls, sound settings

### 8. Generator.js Role ✅

- **HTML Injection**: Append các thẻ HTML của chat bot vào trang web
- **Worker Communication**: Chứa logic giao tiếp với Cloudflare Workers
- **Behavior Handling**:
  - **"Thu nhỏ"**: UI gọi Worker khi icon được click lần đầu
  - **"Mở rộng"**: UI gọi Worker sau khi append hoàn toàn HTML elements

## Questions for Dev

1. **Theme carousel**: Bạn muốn bao nhiêu themes trong carousel? Có layout preference không?
2. **Color picker**: Có cần color picker advanced không hay chỉ predefined colors?
3. **Avatar upload**: Có implement avatar upload system không?
4. **Mobile optimization**: Priority level cho mobile responsive?
5. **Advanced features**: Có cần thêm animation controls, sound settings không?
6. **Deployment**: Generated code sẽ host ở đâu? CDN setup như thế nào?

## Implementation Priority

### Phase 1 (Core Features)

- [ ] Step-by-step navigation
- [ ] Basic theme selection
- [ ] Essential configuration inputs
- [ ] Simple preview system

### Phase 2 (Enhanced Features)

- [ ] Theme carousel với thumbnails
- [ ] Color customization
- [ ] Advanced positioning
- [ ] Interactive preview

### Phase 3 (Polish)

- [ ] Avatar upload system
- [ ] Mobile optimization
- [ ] Advanced validation
- [ ] Performance optimization

## ✅ Đã hoàn thành

### Theme System

- ✅ **VancedDefault.scss** - Theme mặc định đã tạo
- ✅ **3-color system** - Primary, Secondary, Tertiary variables
- ✅ **Responsive positioning** - Desktop/Mobile position support
- ✅ **Avatar system** - CSS variable cho avatar URL
- ✅ **Modern design** - Dựa trên Simple-ChatBot.html hiện tại

### Theme Features (VancedDefault)

- ✅ **Lexend font** - Professional typography
- ✅ **Smooth animations** - Cubic-bezier transitions
- ✅ **Responsive design** - Mobile-first approach
- ✅ **Accessibility** - Proper contrast và focus states
- ✅ **Component-based** - Modular CSS structure
- ✅ **Variable system** - Easy customization

### Next Steps

1. **Compile SCSS** → CSS cho VancedDefault theme
2. **Create generator-spa.html** - Step-by-step interface
3. **Implement theme carousel** - 5 slots với thumbnails
4. **Add preview system** - Real-time updates
5. **Create remaining themes** - Slots 2-5

## Ready for Implementation 🚀

Bây giờ chúng ta có:

- ✅ **Detailed specifications** trong Bot_Config_Info.md
- ✅ **VancedDefault theme** - Professional SCSS structure
- ✅ **Clear roadmap** cho Step-by-Step Generator

**Bạn muốn bắt đầu với phần nào tiếp theo?**

1. **Tạo generator-spa.html** - Multi-step wizard interface
2. **Compile VancedDefault.scss** sang CSS
3. **Design theme carousel** - 5 slots layout
4. **Implement preview system** - Real-time updates
