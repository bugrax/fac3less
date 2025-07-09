```
░█▀▀░█▀█░█▀▀░▀▀█░█░░░█▀▀░█▀▀░█▀▀
░█▀▀░█▀█░█░░░░▀▄░█░░░█▀▀░▀▀█░▀▀█
░▀░░░▀░▀░▀▀▀░▀▀░░▀▀▀░▀▀▀░▀▀▀░▀▀▀
```
By Ken Kai does AI

**An AI-powered automated video creation tool that generates complete faceless videos from just a simple idea.**

## ✨ What This App Does

This web application uses powerful AI services (Replicate and OpenRouter) to automatically create professional-looking videos:

- 🎯 **Start with any video idea** - Just describe what you want
- 📝 **Choose script styles** - Multiple writing styles available
- 🎨 **Pick visual styles** - Tons of cool visual options
- 🎙️ **AI voice narration** - Over a dozen different AI voices
- ✍️ **Automatic script writing** - AI writes the entire script
- 🎵 **Voice generation** - Converts script to professional voiceover
- 🎬 **Smart editing** - Adds sound effects and zoom transitions
- ⚡ **Fast processing** - Complete videos in just 2-5 minutes

---

## 🚀 Quick Start Guide

### ⚠️ Prerequisites

Before you start, make sure you have:

- **Computer**: Windows 10/11 or macOS
- **Internet connection** for downloads and video generation
- **API Keys** from these services (with billing enabled):
  - [OpenRouter](https://openrouter.ai/keys) - For AI script writing
  - [Replicate](https://replicate.com/account/api-tokens) - For AI images and video

---

## 📋 Installation Steps

### Step 1: Open Your Terminal

**On Mac:**
1. Press `Cmd + Space` to open Spotlight
2. Type `Terminal` and press Enter

**On Windows:**
1. Press `Windows Key + R`
2. Type `cmd` and press Enter

### Step 2: Install Required Tools

#### A) Install Node.js (Required)

1. Go to [nodejs.org](https://nodejs.org)
2. Download the **LTS version**
3. Run the installer and follow the prompts
4. Verify installation by typing: `node --version`

#### B) Install FFmpeg (Required for video processing)

**On Mac (Easy Method):**
```bash
# Install Homebrew first
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Then install FFmpeg
brew install ffmpeg
```

**On Mac (Manual Method):**
1. Download FFmpeg from [evermeet.cx/ffmpeg](https://evermeet.cx/ffmpeg/)
2. Press `Shift + Cmd + G` in Finder
3. Type `/usr/local/bin` and press Enter
4. Drag the ffmpeg file into this folder
5. Run: `chmod +x /usr/local/bin/ffmpeg`

**On Windows:**
1. Download from [gyan.dev/ffmpeg/builds](https://www.gyan.dev/ffmpeg/builds/)
2. Click "release builds" → Download `ffmpeg-release-essentials.zip`
3. Extract to `C:\ffmpeg`
4. Add to PATH:
   - Right-click "This PC" → Properties
   - Advanced system settings → Environment Variables
   - Under System variables, find "Path" → Edit
   - Click "New" → Add `C:\ffmpeg\bin`
   - Click OK on all windows
5. **Restart Command Prompt** and test: `ffmpeg -version`

### Step 3: Download the Project

#### Option A: Using Git (Recommended)
```bash
# Navigate to Desktop
cd ~/Desktop           # Mac
cd %USERPROFILE%\Desktop  # Windows

# Clone the project
git clone https://github.com/KenKaiii/fac3less_ken.git
cd fac3less_ken
```

#### Option B: Download ZIP
1. Go to [github.com/KenKaiii/fac3less_ken](https://github.com/KenKaiii/fac3less_ken)
2. Click "Code" → "Download ZIP"
3. Extract to Desktop
4. Navigate to the folder:
   ```bash
   cd ~/Desktop/fac3less_ken-main           # Mac
   cd %USERPROFILE%\Desktop\fac3less_ken-main  # Windows
   ```

### Step 4: Install Dependencies

```bash
npm install --production
```

### Step 5: Setup API Keys

1. **Create environment file:**
   ```bash
   # Mac
   touch .env
   open -e .env

   # Windows
   notepad .env
   ```

2. **Add your API keys:**
   ```env
   # API Keys - REPLACE WITH YOUR ACTUAL KEYS
   OPENROUTER_API_KEY=your_openrouter_key_here
   REPLICATE_API_TOKEN=your_replicate_token_here
   ```

3. **Get your keys:**
   - OpenRouter: Sign up at [openrouter.ai/keys](https://openrouter.ai/keys)
   - Replicate: Sign up at [replicate.com/account/api-tokens](https://replicate.com/account/api-tokens)

4. **Save the file** (`Cmd + S` on Mac, `Ctrl + S` on Windows)

### Step 6: Start the Application

```bash
npm start
```

You should see:
```
✓ Server Status: ONLINE
✓ Port: 3001
✓ Environment: production

🌐 Access your application at:
http://localhost:3001
```

**Open your browser and go to:** [http://localhost:3001](http://localhost:3001)

---

## 🎥 How to Create Your First Video

1. **Enter Your Idea**: Type what you want your video to be about
2. **Choose Your Style**: Pick a visual style and video model from the dropdowns
3. **Generate**: Click the "Execute" button
4. **Wait**: Video generation takes 2-5 minutes
5. **Download**: Your finished video will appear ready for download

---

## 🔧 Troubleshooting

### Common Issues & Solutions

| Problem | Solution |
|---------|----------|
| **"npm is not recognized"** | Node.js not installed correctly. Retry Step 2A |
| **"ffmpeg is not recognized"** | FFmpeg not found. Retry Step 2B, restart terminal |
| **"Cannot find module"** | Run `npm install --production` in project folder |
| **"API key invalid"** | Check `.env` file for typos, restart server |
| **Server won't start** | Port 3001 might be in use, check antivirus |

### Still Having Issues?

1. **Double-check**: Follow every step exactly as written
2. **Restart**: Try restarting your computer
3. **Fresh install**: Delete `node_modules` folder and run `npm install --production` again

---

## 🛑 How to Stop the App

In the terminal where the server is running, press `Ctrl + C`

---

## 📁 Output Files

- Generated videos are saved in the `outputs` folder
- Your videos stay on your computer and are never uploaded elsewhere

---

## ⚠️ Important Notes

- 🔐 **Keep your API keys secret** - Never share them with anyone
- 💰 **API usage costs money** - Each video generation uses your API credits
- 📱 **Local storage** - All videos are saved locally, never uploaded
- 🔒 **Confidential software** - Do not share or distribute this application

---

## 🆘 Need Help?

If you're still stuck after trying the troubleshooting steps:

1. Make sure you followed **every single step** exactly
2. Try the classic solution: **restart your computer**
3. Do a **fresh install** by deleting `node_modules` and running `npm install --production` again

---

*This software is proprietary and confidential. Do not share or distribute.*
