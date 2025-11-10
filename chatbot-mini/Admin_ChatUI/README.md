# Admin Dashboard - Human Support Interface

## 🎯 Overview

This is the admin dashboard where support agents can handle human support requests from the chatbot. It provides real-time WebSocket chat with customers who need human assistance.

## 🚀 Quick Setup

### 1. Configure Settings

Edit `config.js` and update:

- `SPREADSHEET_URL` - Your Google Apps Script URL
- `WORKERS_URL` - Your Cloudflare Workers URL
- `ADMIN_SETTINGS` - Customize for your team

### 2. Deploy to GitHub Pages

1. Push this folder to your GitHub repository
2. Go to Settings > Pages
3. Select source branch (usually `main`)
4. Your dashboard will be available at: `https://yourusername.github.io/yourrepo/Admin_ChatUI/`

### 3. Custom Domain (Optional)

1. Add a `CNAME` file with your domain
2. Configure DNS to point to GitHub Pages
3. Enable HTTPS in repository settings

## 📁 Files Structure

- `index.html` - Main dashboard interface
- `config.js` - Configuration settings (EDIT THIS)
- `README.md` - This setup guide

## 🔧 Configuration Guide

### Required Settings

```javascript
// Your Google Apps Script URL
const SPREADSHEET_URL =
  "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";

// Your Cloudflare Workers URL
const WORKERS_URL = "https://your-worker.your-subdomain.workers.dev";
```

### Optional Customization

- Company branding and colors
- Refresh intervals
- Notification settings
- Time format and timezone

## 🎮 How to Use

1. **Login:** Enter your nickname as support agent
2. **Monitor:** View incoming support requests
3. **Connect:** Click on a customer to start chat
4. **Chat:** Real-time messaging with customers
5. **End:** Close chat when support is complete

## 🔒 Security Notes

- Keep your `config.js` file secure
- Don't expose sensitive URLs publicly
- Use HTTPS for production deployment
- Monitor access logs regularly

## 🆘 Troubleshooting

### WebSocket Connection Issues

- Check WORKERS_URL is correct
- Verify Workers deployment is active
- Check browser console for errors

### No Support Requests Showing

- Verify SPREADSHEET_URL is correct
- Check Apps Script permissions
- Ensure chatbot is generating support requests

### Chat Not Working

- Check WebSocket connection in browser dev tools
- Verify room IDs match between client and admin
- Check Workers logs for errors

## 📞 Support

If you need help:

1. Check browser console for errors
2. Verify all URLs in config.js
3. Test Workers and Apps Script separately
4. Check GitHub Pages deployment status
