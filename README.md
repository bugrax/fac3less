# Fac3less

```
░█▀▀░█▀█░█▀▀░▀▀█░█░░░█▀▀░█▀▀░█▀▀
░█▀▀░█▀█░█░░░░▀▄░█░░░█▀▀░▀▀█░▀▀█
░▀░░░▀░▀░▀▀▀░▀▀░░▀▀▀░▀▀▀░▀▀▀░▀▀▀
```

**By Ken Kai does AI**

Just so you know, this is a little web app I built that uses some powerful AI tools called Replicate and OpenRouter to do all the heavy lifting for you.

## 🎬 Here's a taste of what it can do:

- ✨ You can start with any video idea you can dream up
- 📝 It lets you choose from a bunch of different script styles
- 🎨 You can pick from tons of cool visual styles for your video
- 🎙️ There are over a dozen different AI voices to narrate your script
- 📄 It writes the entire script for you
- 🔊 It turns that script into a voice over automatically
- 🎞️ It even adds cool editing like sound effects and zoom transitions
- ⚡ The best part? It builds the final video in just a few minutes!

## 🚀 Let's get this thing set up

This guide will walk you through setting up my automated faceless video generator. Just follow these steps exactly, and you'll be up and running on your own computer in no time.

> **Note:** If you already have Node.js and ffmpeg installed, you can skip to step 3.

## 📋 Your pre-flight checklist

Before we dive in, let's make sure you have everything you need:

- ✅ A computer running Windows 10/11 or macOS
- ✅ An internet connection to download the tools and generate videos
- ✅ A couple of API Keys. Think of these as secret passwords that let your app talk to other services. You'll need one from:
  - **[OpenRouter](https://openrouter.ai)** (this is for the AI that writes the scripts)
  - **[Replicate](https://replicate.com)** (this is for the AI that creates the images and video)

> ⚠️ **Important:** Make sure to setup billing for both OpenRouter & Replicate to start using their models

## 📖 Step 1: Open your command center

This is a little window where we'll type in some simple commands to get everything installed.

### On a Mac:
1. Press `Command + Space` to open Spotlight search
2. Type `Terminal` and hit Enter
3. A simple window will pop up. That's your Terminal!

### On Windows:
1. Press the `Windows Key + R` at the same time
2. Type `cmd` and hit Enter
3. A black window will appear. This is your Command Prompt

## 🛠️ Step 2: Grab the essential tools

We just need to install two main things to make the magic happen.

### A. Install Node.js (This is a must)

Node.js is a background tool that lets your computer run the app.

**For Mac:**
1. Head over to [https://nodejs.org](https://nodejs.org)
2. Download the version that says "LTS"
3. Double-click the file you just downloaded
4. Just click through the installer. "Continue" and "Install" are your friends here

**For Windows:**
1. Go to [https://nodejs.org](https://nodejs.org)
2. Download the "LTS" version for Windows
3. Double-click the .msi file that downloads
4. Follow the installer, clicking "Next" and "Install" until it's done

To check if it worked, type this into your Terminal or Command Prompt and press Enter:

```bash
node --version
```

You should see a version number pop up, like `v20.11.0`.

### B. Install FFmpeg (For video stuff)

FFmpeg is a super powerful tool that handles all the video processing behind the scenes.

**For Mac (The Easy Way):**

1. First, we need a helper called Homebrew. Copy this entire line and paste it into your Terminal:
   ```bash
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   ```

2. Press Enter. It might ask for your computer's password. Go ahead and type it in (you won't see the letters appear, that's normal!) and press Enter.

3. Once it's finished, type this and press Enter:
   ```bash
   brew install ffmpeg
   ```

**For Mac (The Manual Way if the easy way fails):**
1. Go to [https://evermeet.cx/ffmpeg/](https://evermeet.cx/ffmpeg/)
2. Download the file named `ffmpeg` (just that one)
3. Open Finder and press `Shift + Command + G`
4. Type `/usr/local/bin` and press Enter
5. Drag the ffmpeg file you downloaded into this folder
6. Open Terminal and type this command to make it runnable:
   ```bash
   chmod +x /usr/local/bin/ffmpeg
   ```

**For Windows:**
1. Go to [https://www.gyan.dev/ffmpeg/builds/](https://www.gyan.dev/ffmpeg/builds/)
2. Click the "release builds" link
3. Download the file called `ffmpeg-release-essentials.zip`
4. Right-click the zip file and choose "Extract All"
5. Tell it to extract to this exact spot: `C:\ffmpeg`
6. Now we need to tell Windows where to find it. This part sounds tricky, but it's easy!
   - Right-click on "This PC" (or "My Computer") and choose "Properties"
   - Click on "Advanced system settings"
   - Click the "Environment Variables" button
   - Under "System variables", find `Path`, click it, then click "Edit"
   - Click "New" and type in: `C:\ffmpeg\bin`
   - Click "OK" on all the windows to close them
7. **Close and reopen your Command Prompt. This is important!**
8. Type `ffmpeg -version` and press Enter to check that it worked

## 📥 Step 3: Download and set up Fac3less

Now let's get the actual project files onto your computer.

### Option A: Using Git (The best way)

1. In your Terminal or Command Prompt, let's move to your Desktop:
   - **Mac:** `cd ~/Desktop`
   - **Windows:** `cd %USERPROFILE%\Desktop`

2. Now, clone (which is a fancy word for download) the project with this command:
   ```bash
   git clone https://github.com/KenKaiii/fac3less_ken.git
   ```

3. Once it's done, let's go inside the new project folder:
   ```bash
   cd fac3less_ken
   ```

### Option B: Download a ZIP file (If Git gives you trouble)

1. Go to [https://github.com/KenKaiii/fac3less_ken](https://github.com/KenKaiii/fac3less_ken)
2. Click the green "Code" button, then click "Download ZIP"
3. Extract the ZIP file right onto your Desktop
4. The folder will be named `fac3less_ken-main`. Let's go into it:
   - **Mac:** `cd ~/Desktop/fac3less_ken-main`
   - **Windows:** `cd %USERPROFILE%\Desktop\fac3less_ken-main`

Now, no matter which option you chose, run this command to install all the project's little helpers:

```bash
npm install --production
```

> This might take a few minutes. Just let it do its thing!

## 🔐 Step 4: Plug in your secret keys

Remember those API keys we talked about? It's time to put them in.

1. Inside the project folder, we need to create a new file called `.env`. Yes, it really starts with a dot!
   - **Mac:** In Terminal, type `touch .env`, then type `open -e .env` to open it in a text editor
   - **Windows:** In Command Prompt, type `notepad .env` and click "Yes" when it asks to create the file

2. Copy and paste this text into your new empty file:
   ```
   # API Keys - REPLACE WITH YOUR ACTUAL KEYS
   OPENROUTER_API_KEY=your_openrouter_key_here
   REPLICATE_API_TOKEN=your_replicate_token_here
   ```

3. Now, replace the placeholder text with your real keys:
   - Go to [https://openrouter.ai/keys](https://openrouter.ai/keys), sign up, and copy your key
   - Go to [https://replicate.com/account/api-tokens](https://replicate.com/account/api-tokens), sign up, and copy your token

4. Save the file!
   - **Mac:** Press `Command + S`
   - **Windows:** Press `Ctrl + S`

## 🎯 Step 5: Time for liftoff!

This is the moment we've been waiting for.

1. Make sure you're still in the project folder in your Terminal or Command Prompt

2. Type this command and press Enter:
   ```bash
   npm start
   ```

3. You should see a message pop up that says:
   ```
   Big 'FAC3LESS' logo

   ✓ Server Status: ONLINE
   ✓ Port: 3001
   ✓ Environment: production

   🌐 Access your application at:

   http://localhost:3001

   Press Ctrl+C to stop the server
   ```

4. Open your favorite web browser like Chrome or Safari

5. Go to this address: `http://localhost:3001` or press `CTRL + CLICK` to open

## 🎥 How to make your first video

You're in! Using the generator is super simple.

1. **Enter Your Idea:** Type in what you want your video to be about
2. **Choose Your Style:** Pick a visual style and a video model from the dropdowns
3. **Generate:** Click the "Execute" button below
4. **Wait:** Grab a coffee. Video generation can take between 2-5 minutes
5. **Download:** Your finished video will appear on the page ready for you to download

## 🔧 Hit a snag? No worries!

Here are some common issues and how to fix them:

- **"npm is not recognized" error:** This means Node.js didn't install right. Hop back to Step 2A and try again.
- **"ffmpeg is not recognized" error:** This means FFmpeg isn't installed or your computer can't find it. Go back to Step 2B. If you're on Windows, make sure you restarted your Command Prompt after setting it up!
- **"Cannot find module" error:** You probably just need to run `npm install --production` again. Make sure you're in the correct project folder first!
- **"API key invalid" error:** Double check your `.env` file for typos. Make sure you saved the file after pasting your keys. It's also a good idea to restart the server.
- **Server won't start:** Another program might be using port 3001. Try changing the port in your `.env` file to 3010. Your antivirus might also be blocking it, so check that too.

## 🛑 How to stop the app

When you're all done making videos, you can stop the server:

In the Terminal or Command Prompt window where the server is running, just press `CTRL + C`.

## 🆘 Still stuck?

If you're really having trouble, here are a few things to try:

1. Go back and make sure you followed every single step exactly as I wrote it
2. The classic solution: try restarting your computer
3. Delete the `node_modules` folder inside the project and run `npm install --production` again to do a fresh install

## 📝 A few important notes

- 🔒 **Your API keys are secret!** Never share them with anyone
- 💰 **Generating videos isn't free.** It uses your API accounts, which will charge you small amounts for the work
- 💾 **All your generated videos are saved locally** in a folder called `outputs` inside the project folder. Your videos are never uploaded anywhere else

## ⚖️ A quick legal note

This software is my own creation and is confidential. Please do not share or distribute it.
