# Generator SPA UI Refresh - Specifications & Implementation

## 🎯 Yêu Cầu Chính

### Layout Requirements:

- ✅ **Tối ưu cho màn hình 16:9**
- ✅ **Live Preview**: Luôn hiển thị trong tất cả steps
- ✅ **Real-time Updates**: Preview cập nhật ngay khi user input
- ✅ **Enhanced Chat**: 2-3 câu chat mẫu (bot + user)

### Layout Structure:

- ✅ **2 Columns**: Left (62%) + Right (38%)
- ✅ **Body Padding**: 5vh và 3vw
- ✅ **Display**: Flex row layout

## 📐 Cấu Trúc HTML

### Final Structure:

```html
<body style="display: flex; flex-direction: row">
  <!-- Left Column (62%) -->
  <div class="left_col step_col">
    <header class="generator-header">
      <div class="logo">
        <h1>🤖 Vanced Chatbot Generator</h1>
        <p>Tạo chatbot cho website của bạn trong 4 bước đơn giản</p>
      </div>
      <div class="progress-steps">
        <!-- Step dots: ● ● ● ● -->
      </div>
    </header>

    <main class="steps-main">
      <!-- Step 1: Theme & Colors -->
      <!-- Step 2: Basic Configuration -->
      <!-- Step 3: Position & Behavior -->
      <!-- Step 4: Generate Code -->
    </main>

    <footer class="generator-footer">
      <button class="nav-btn prev">← Quay lại</button>
      <div class="step-info">1 / 4</div>
      <button class="nav-btn next">Tiếp theo →</button>
    </footer>
  </div>

  <!-- Right Column (38%) -->
  <div class="right_col preview_col">
    <div class="preview-header">
      <h3>👀 Live Preview</h3>
      <div class="device-toggle">
        <button>🖥️ Desktop</button>
        <button>📱 Mobile</button>
      </div>
    </div>

    <div class="live-preview-container">
      <!-- Chatbot preview với 3 messages -->
      <div class="preview-messages">
        <div class="preview-message bot">Xin chào! Tôi có thể giúp gì?</div>
        <div class="preview-message user">Tôi cần hỗ trợ về sản phẩm</div>
        <div class="preview-message bot">Tất nhiên! Tôi sẽ giúp bạn...</div>
      </div>
    </div>
  </div>
</body>
```

## 🎨 CSS Implementation

### Body Layout:

```css
body {
  display: flex;
  flex-direction: row;
  padding: 5vh 3vw;
  height: 90vh;
  gap: 0;
}
```

### Left Column (62%):

```css
.left_col.step_col {
  width: 62%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px 0 0 12px;
}
```

### Right Column (38%):

```css
.right_col.preview_col {
  width: 38%;
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 0 12px 12px 0;
}
```

### Header Layout (Flex Row):

```css
.generator-header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 2rem;
}

.logo {
  flex: 1;
  text-align: left;
}

.progress-steps {
  display: flex;
  gap: 1rem;
}
```

## 📱 Responsive Design

### Desktop (>1024px):

```
┌────────────────────────────────────────────────┐
│ [Logo + Title]           [● ● ● ●]            │
├────────────────────────────────────────────────┤
│                          │                     │
│  Steps Content (62%)     │  Live Preview (38%) │
│  - Scrollable            │  - Always visible   │
│                          │  - Real-time update │
├────────────────────────────────────────────────┤
│ [← Back]  1/4  [Next →]  │                     │
└────────────────────────────────────────────────┘
```

### Mobile/Tablet (<1024px):

```
┌─────────────────────┐
│   Live Preview      │
│   (collapsed)       │
├─────────────────────┤
│ [Logo + Title]      │
│    [● ● ● ●]        │
├─────────────────────┤
│  Steps Content      │
│  (full width)       │
├─────────────────────┤
│ [← Back] 1/4 [Next] │
└─────────────────────┘
```

## ✨ Key Features Implemented

### 1. Live Preview System:

- ✅ **Always Visible**: Trong tất cả 4 steps
- ✅ **Real-time Updates**: Cập nhật ngay khi input change
- ✅ **Enhanced Chat**: 3 messages (bot → user → bot)
- ✅ **Device Toggle**: Desktop/Mobile preview switcher
- ✅ **Interactive**: Click để toggle chatbot state

### 2. Header Design:

- ✅ **Flex Row Layout**: Logo trái, dots phải
- ✅ **Compact Design**: Tối ưu không gian
- ✅ **Step Dots**: 4 dots cho 4 steps
- ✅ **Active States**: Visual feedback

### 3. Navigation:

- ✅ **Footer Buttons**: Back/Next navigation
- ✅ **Step Counter**: Current step / Total steps
- ✅ **Disabled States**: Smart button states
- ✅ **Validation**: Required fields check

### 4. Responsive Behavior:

- ✅ **Desktop**: 62%-38% split
- ✅ **Tablet**: Stacked, preview on top
- ✅ **Mobile**: Full width, optimized spacing

## 🚀 Files Structure

```
ChatbotMini_Package/PackGenerator/
├── generator-spa.html              ✅ Flex layout structure
├── Styles/generator-spa.css        ✅ Flex-based styling
├── js/generator-spa-updated.js     ✅ 4-step logic
└── SPA_UI_Refresh.md              ✅ This documentation
```

## 📊 Implementation Status

### Completed:

- ✅ **HTML Structure**: Flex row với 2 columns
- ✅ **CSS Layout**: 62%-38% với padding 5vh 3vw
- ✅ **Header**: Flex row với logo + dots
- ✅ **Live Preview**: Always visible với 3 messages
- ✅ **Responsive**: Mobile-friendly stacked layout
- ✅ **Navigation**: Footer với back/next buttons

### Technical Details:

- **Display**: `flex` với `flex-direction: row`
- **Columns**: `.left_col.step_col` (62%) + `.right_col.preview_col` (38%)
- **Padding**: `5vh 3vw` trên body
- **Height**: `90vh` cho optimal viewport usage
- **Border Radius**: Rounded corners cho modern look

## 🎯 Result

Perfect implementation theo specifications:

- ✅ **16:9 optimized** - Designed cho widescreen
- ✅ **Live preview** - Real-time updates
- ✅ **Flex layout** - Simple và maintainable
- ✅ **Responsive** - Mobile-friendly
- ✅ **Clean structure** - Easy to understand

**Status**: ✅ COMPLETED & READY FOR USE
