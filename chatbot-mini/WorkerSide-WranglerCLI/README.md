# Cloudflare Workers Backend

## 🎯 Overview

This is the backend service that handles:

- AI chat processing via OpenRouter API
- Rate limiting and user management
- WebSocket chat for human support
- Integration with Google Apps Script database

## 🚀 Quick Deploy

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy and edit the configuration:

```bash
cp wrangler.toml.template wrangler.toml
```

Edit `wrangler.toml` and add your:

- `OPENROUTER_API_KEY` - Get from [OpenRouter](https://openrouter.ai/)
- `APPS_SCRIPT_URL` - Your Google Apps Script web app URL

### 3. Configure Chatbot Settings

Edit `src/data.js`:

- Set `isPhoneNumberCollectMode` (true/false)
- Update `TUNED_DATA` with your Q&A examples
- Customize `SYSTEM_PROMPT_TEMPLATE` for your business

### 4. Deploy

```bash
npx wrangler deploy
```

## ⚙️ Configuration

### Chat Modes

- **Info Mode** (`isPhoneNumberCollectMode = false`): General information chatting
- **Phone Collection Mode** (`isPhoneNumberCollectMode = true`): Focus on collecting phone numbers

### Customization

- `TUNED_DATA`: Add your company's Q&A examples
- `SYSTEM_PROMPT_TEMPLATE`: Customize AI behavior and personality
- Rate limits: Modify `RPD_LIMIT` in your Apps Script

## 🔗 Next Steps

After deployment:

1. Copy your Workers URL (e.g., `https://your-worker.your-subdomain.workers.dev`)
2. Use this URL in the PackGenerator to create embed codes
3. Configure your Admin UI with this Workers URL

## 🛠️ Development

```bash
# Local development
npx wrangler dev

# View logs
npx wrangler tail
```
