# generator.js - Vanced Chatbot CDN Script

## 📋 Overview

Main CDN script that injects the Vanced Chatbot into user websites. This script handles everything from HTML injection to Worker communication.

## 🚀 Usage

### 1. User configures chatbot in generator UI

### 2. Generator produces this code:

```html
<!-- 1. CSS Variables & Theme -->
<style>
  :root {
    --chatbot-primary: #0c1136;
    --chatbot-secondary: #e72166;
    --chatbot-tertiary: #ffffff;
  }
</style>
<link
  rel="stylesheet"
  href="https://cdn.vanced.media/chatbot-mini/style/vanced-default.css"
/>

<!-- 2. Configuration Object -->
<script>
  window.VancedChatbotConfig = {
    workersUrl: "https://your-worker.workers.dev",
    chatbotName: "Vanced Agency",
    avatarUrl: "https://example.com/avatar.png",
    tagline: "Hỗ trợ 24/7",
    recommendedMessages: ["Tìm hiểu sản phẩm", "Hỗ trợ kỹ thuật"],
    position: {
      side: "right",
      desktop: { bottom: 32, side: 32 },
      mobile: { bottom: 12, side: 12 },
    },
    behavior: {
      initialState: "minimized",
      showOnMobile: true,
    },
    theme: "vanced-default",
  };
</script>

<!-- 3. Main Script -->
<script src="https://cdn.vanced.media/chatbot-mini/scripts/newest/generator.js"></script>
```

## 🎯 Features

### Core Functionality:

- ✅ **Auto-injection** - Dynamically creates chatbot HTML
- ✅ **Configuration parsing** - Reads VancedChatbotConfig
- ✅ **State management** - Handles minimized/expanded states
- ✅ **Responsive positioning** - Desktop/mobile support
- ✅ **Theme integration** - CSS variables support

### Communication:

- ✅ **Initialize chat** - Browser fingerprint → Workers
- ✅ **Send messages** - User input → Workers → AI response
- ✅ **Chat history** - Persistent conversation
- ✅ **Rate limiting** - Handle RPD/RPM limits
- ✅ **Human support** - Escalation requests

### UI Features:

- ✅ **Message display** - User/bot/system messages
- ✅ **Loading states** - Animated indicators
- ✅ **Recommended messages** - Quick reply buttons
- ✅ **Keyboard support** - Enter to send
- ✅ **Toggle functionality** - Show/hide chatbot

## 📐 Architecture

### Initialization Flow:

```
1. Script loads → Check if already initialized
2. Read VancedChatbotConfig → Merge with defaults
3. Create HTML structure → Inject into DOM
4. Setup event listeners → Keyboard, clicks
5. If expanded → Initialize chat session
6. If minimized → Wait for user click
```

### Chat Flow:

```
User clicks icon/sends message
  ↓
Initialize if needed (fingerprint → Workers)
  ↓
Display user message
  ↓
Send to Workers (action: sendMessage)
  ↓
Receive AI response
  ↓
Display bot message
  ↓
Check if needs human support
  ↓
Show escalation prompt if needed
```

## 🔧 Configuration

### Required:

- `workersUrl` - Cloudflare Workers endpoint

### Optional:

- `chatbotName` - Bot display name (default: "Vanced Agency")
- `avatarUrl` - Bot avatar image (default: placeholder)
- `tagline` - Bot subtitle (default: "Hỗ trợ 24/7")
- `recommendedMessages` - Quick reply buttons (default: [])
- `position` - Desktop/mobile positioning
- `behavior` - Initial state, mobile visibility
- `theme` - Theme name (default: "vanced-default")

## 🌐 Public API

### window.VancedChatbot

```javascript
// Toggle chatbot visibility
window.VancedChatbot.toggle();

// Send a message programmatically
window.VancedChatbot.sendMessage("Hello!");

// Send recommended message
window.VancedChatbot.sendRecommended("Tìm hiểu sản phẩm");

// Request human support
window.VancedChatbot.requestHumanSupport();

// Get current state
const state = window.VancedChatbot.getState();
// Returns: { isMinimized, isInitialized, machineId, chatHistory, rpdRemaining }
```

## 📱 Responsive Behavior

### Desktop (>768px):

- Uses `position.desktop` coordinates
- Full-size chat interface (350px width)

### Mobile (≤768px):

- Uses `position.mobile` coordinates
- Responsive width (calc(100vw - 24px))
- Can be hidden with `behavior.showOnMobile: false`

## 🎨 Styling

### CSS Classes:

- `.vanced-chatbot-container` - Main container
- `.vanced-chatbot-icon` - Minimized icon
- `.vanced-chat-interface` - Expanded chat UI
- `.vanced-chat-header` - Header with avatar
- `.vanced-chat-messages` - Messages container
- `.vanced-message` - Individual message
- `.vanced-loading` - Loading indicator
- `.vanced-human-support` - Support prompt

### CSS Variables:

```css
:root {
  --chatbot-primary: #0c1136;
  --chatbot-secondary: #e72166;
  --chatbot-tertiary: #ffffff;
}
```

## 🔍 Debug Mode

Enable debug logging:

```javascript
// In generator.js, line 11:
const DEBUG = true;
```

Debug logs will show:

- Initialization steps
- Configuration merging
- API calls and responses
- State changes

## 🚨 Error Handling

### Graceful Degradation:

- Missing workersUrl → Console error, no injection
- Network errors → Display error message
- Rate limiting → Show limit message
- Banned users → Disable input

### User-Friendly Messages:

- Connection errors: "Không thể kết nối. Vui lòng thử lại sau."
- Rate limits: "Bạn đã hết lượt chat trong ngày..."
- Banned: "Thiết bị này không hợp lệ."

## 📊 State Management

### chatState Object:

```javascript
{
  isMinimized: boolean,      // Current visibility
  isInitialized: boolean,    // Chat session started
  machineId: string,         // User fingerprint ID
  chatHistory: Array,        // Conversation history
  rpdRemaining: number       // Messages remaining today
}
```

## 🔐 Security

### Browser Fingerprinting:

- User agent
- Language
- Platform
- Screen resolution
- Timezone
- Timestamp

### No Sensitive Data:

- No cookies stored
- No localStorage used
- All data managed by Workers

## 📦 File Size

- **Unminified**: ~15KB
- **Minified**: ~8KB (estimated)
- **Gzipped**: ~3KB (estimated)

## 🎯 Browser Support

- Chrome/Edge: ✅ Latest 2 versions
- Firefox: ✅ Latest 2 versions
- Safari: ✅ Latest 2 versions
- Mobile browsers: ✅ iOS Safari, Android Chrome

## 📝 Version

- **Current**: 1.0.0
- **CDN URL**: `https://cdn.vanced.media/chatbot-mini/scripts/newest/generator.js`

## 🔄 Updates

To update the script:

1. Modify `generator.js`
2. Test thoroughly
3. Upload to CDN
4. Users automatically get latest version

## 📞 Support

For issues or questions:

- Email: contact@vanced.agency
- Documentation: https://cdn.vanced.media/chatbot-mini/docs

---

**Status**: Production Ready ✅
