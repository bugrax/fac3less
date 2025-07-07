# Fac3less Video Generator - Setup Guide

This is an automated faceless video generation system. Follow these steps EXACTLY to get it running on your computer.

## What You Need Before Starting

1. **A computer** running Windows 10/11 or macOS
2. **Internet connection** for downloading tools and generating videos
3. **API Keys** from:
   - OpenRouter (for AI text generation)
   - Replicate (for image/video generation)

## Complete Setup Guide

### Step 1: Open Terminal/Command Prompt

**On Mac:**
1. Press `Command + Space` to open Spotlight
2. Type "Terminal" and press Enter
3. A black/white window will open - this is where you'll type commands

**On Windows:**
1. Press `Windows Key + R`
2. Type "cmd" and press Enter
3. A black window will open - this is the Command Prompt

### Step 2: Install Required Software

#### A. Install Node.js (Required)

**Mac:**
1. Go to https://nodejs.org
2. Download the "LTS" version for macOS
3. Double-click the downloaded file
4. Follow the installer - just click "Continue" and "Install"

**Windows:**
1. Go to https://nodejs.org
2. Download the "LTS" version for Windows
3. Double-click the downloaded .msi file
4. Follow the installer - just click "Next" and "Install"

To verify it's installed, type this in Terminal/Command Prompt and press Enter:
```
node --version
```
You should see something like `v20.11.0` (numbers may vary)

#### B. Install FFmpeg (Required for Video Processing)

**Mac (Easy Method):**
1. First install Homebrew by copying this ENTIRE line and pasting it in Terminal:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```
2. Press Enter and wait (it may ask for your password - type it and press Enter)
3. When done, type this and press Enter:
```
brew install ffmpeg
```

**Mac (Manual Method if above doesn't work):**
1. Go to https://evermeet.cx/ffmpeg/
2. Download "ffmpeg" (not ffprobe or ffplay)
3. Open Finder, press `Shift + Command + G`
4. Type `/usr/local/bin` and press Enter
5. Drag the downloaded ffmpeg file into this folder
6. Open Terminal and type: `chmod +x /usr/local/bin/ffmpeg`

**Windows:**
1. Go to https://www.gyan.dev/ffmpeg/builds/
2. Click "release builds" link
3. Download "ffmpeg-release-essentials.zip"
4. Right-click the downloaded zip file and select "Extract All"
5. Choose to extract to `C:\ffmpeg`
6. Now we need to add it to PATH:
   - Right-click "This PC" or "My Computer" and select "Properties"
   - Click "Advanced system settings"
   - Click "Environment Variables"
   - Under "System variables", scroll down and find "Path", click it, then click "Edit"
   - Click "New" and add: `C:\ffmpeg\bin`
   - Click "OK" on all windows
7. Close and reopen Command Prompt
8. Type `ffmpeg -version` and press Enter to verify

### Step 3: Download and Setup Fac3less

1. Download this project:
   - Click the green "Code" button on this page
   - Click "Download ZIP"
   - Extract the ZIP file to your Desktop

2. Navigate to the project folder:
   
   **Mac:**
   ```
   cd ~/Desktop/fac3less_ken-main
   ```
   
   **Windows:**
   ```
   cd %USERPROFILE%\Desktop\fac3less_ken-main
   ```

3. Install the project:
   ```
   npm install --production
   ```
   (This will take a few minutes - let it finish)

### Step 4: Configure Your API Keys

1. In the project folder, create a new file called `.env` (yes, it starts with a dot)

   **Mac:**
   - In Terminal, type: `touch .env`
   - Then type: `open -e .env`

   **Windows:**
   - In Command Prompt, type: `notepad .env`
   - Click "Yes" if it asks to create a new file

2. Copy and paste this into the file:
   ```
   # API Keys - REPLACE WITH YOUR ACTUAL KEYS
   OPENROUTER_API_KEY=your_openrouter_key_here
   REPLICATE_API_TOKEN=your_replicate_token_here

   ```

3. Replace the API keys:
   - Go to https://openrouter.ai/keys and create an account
   - Copy your API key and replace `your_openrouter_key_here`
   - Go to https://replicate.com/account/api-tokens and create an account
   - Copy your API token and replace `your_replicate_token_here`

4. Save the file:
   - **Mac:** Press `Command + S`
   - **Windows:** Press `Ctrl + S`

### Step 5: Start the Application

1. In Terminal/Command Prompt, make sure you're still in the project folder
2. Type this and press Enter:
   ```
   npm start
   ```

3. You should see:
   ```
   Server is running on port 3009
   Open http://localhost:3009 in your browser
   ```

4. Open your web browser (Chrome, Firefox, Safari, etc.)
5. Go to: http://localhost:3009

### How to Use the Video Generator

1. **Enter Your Idea**: Type what kind of video you want (e.g., "A motivational video about success")
2. **Choose Style**: Select visual style and video model
3. **Generate**: Click the generate button
4. **Wait**: Video generation takes 5-15 minutes
5. **Download**: Your video will appear when ready

### Common Problems and Solutions

**"npm is not recognized" error:**
- Node.js isn't installed properly. Go back to Step 2A

**"ffmpeg is not recognized" error:**
- FFmpeg isn't installed or not in PATH. Go back to Step 2B
- On Windows, make sure you restarted Command Prompt after adding to PATH

**"Cannot find module" error:**
- Run `npm install --production` again
- Make sure you're in the correct folder

**"API key invalid" error:**
- Check your `.env` file has the correct keys
- Make sure you saved the file after adding keys
- Restart the server (Ctrl+C to stop, then `npm start` again)

**Server won't start:**
- Make sure port 3009 isn't being used: try changing PORT in .env to 3010
- Check if antivirus is blocking it

### Stopping the Application

To stop the server:
- Press `Ctrl + C` in Terminal/Command Prompt
- Type `Y` if it asks to terminate

### Getting Help

If you're stuck:
1. Make sure you followed EVERY step exactly
2. Try restarting your computer
3. Delete the `node_modules` folder and run `npm install --production` again

### Important Notes

- Keep your API keys secret - don't share them
- Video generation costs money through your API accounts
- Generated videos are saved in the `outputs` folder
- The app runs locally on your computer - your videos aren't uploaded anywhere

## License

This software is proprietary and confidential. Do not distribute.