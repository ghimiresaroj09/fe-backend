# ⚡ 5-Minute Quick Start

## Step 1️⃣: Setup (One Time Only)

### Windows Users 🎯
1. Ensure Node.js is installed ([download](https://nodejs.org/))
2. Double-click: **`setup.bat`**
3. Wait for setup to complete ✅

### Other Platforms
```bash
npm run setup
```

## Step 2️⃣: Start the Application

### Windows Users 🎯
1. Double-click: **`start.bat`**
2. Wait for "Server running on http://localhost:5000"
3. Browser opens automatically ✨

### Other Platforms
```bash
npm start
```

## Step 3️⃣: Use the Application

1. **Enter** a license number (from your PDFs)
2. **Click** Search or press Enter
3. **View** if license is printed and collection point

## ✅ Done!

The system will automatically:
- ✅ Load all PDFs from `data/` folder
- ✅ Create searchable database
- ✅ Serve modern web UI
- ✅ Show results instantly

## 📊 Architecture

```
Your PDFs
   ↓
[Node.js Server] ← Reads PDFs on startup
   ↓
[Express API] ← Handles /api/search
   ↓
[React UI] ← Beautiful phased interface
```

## 🎯 What Happens

**Setup:**
- Installs Node packages (backend + frontend)
- Builds React app for production
- Ready to run!

**Start:**
- Loads PDFs into memory
- Starts web server
- You search and get results instantly

## 💡 Pro Tips

- License numbers are **case-insensitive**
- First search loads database (~1-2 seconds)
- Subsequent searches are **instant**
- Works offline once started
- No additional dependencies needed

## 🛠️ If Something Goes Wrong

| Problem | Fix |
|---------|-----|
| "Node.js not found" | Install Node.js from nodejs.org |
| "Module not found" | Delete `node_modules` and run setup again |
| Port 5000 in use | Close other apps on that port |
| PDFs not loading | Restart the server |

## 📚 Files Created During Setup

```
node_modules/          ← Backend packages (auto)
client/dist/           ← Built React app (auto)
client/node_modules/   ← Frontend packages (auto)
```

These are auto-generated - don't edit them!

## 🚀 You're Ready!

```
1. Setup: Double-click setup.bat ✓
2. Start: Double-click start.bat ✓
3. Search: Enter license number ✓
```

That's it! 🎉

---

**Need help?** See `README_NEW.md` for detailed documentation.
