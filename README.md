# Fac3less

```
░█▀▀░█▀█░█▀▀░▀▀█░█░░░█▀▀░█▀▀░█▀▀
░█▀▀░█▀█░█░░░░▀▄░█░░░█▀▀░▀▀█░▀▀█
░▀░░░▀░▀░▀▀▀░▀▀░░▀▀▀░▀▀▀░▀▀▀░▀▀▀
```

**By Ken Kai does AI**

## 🛠️ What You'll Need

First up, let's grab all the tools for our digital toolbelt. Here's a quick list of what we're going to download and install:

- **Node.js** - JavaScript runtime
- **Git** - Version control system
- **WSL** - Windows Subsystem for Linux (a super cool mini Linux that runs inside Windows)
- **Code Editor** - Your favorite code editor, like [Cursor](https://cursor.com) or [Visual Studio Code](https://code.visualstudio.com)
- **Your amazing brain and typing fingers** 🧠✨

## 📥 Let's Get Everything Installed

This part is mostly just clicking through installers, but I'll point out the important bits.

### 1. Download and Install Node.js and Git

Go ahead and download the Windows installers from their official sites:

- **Node.js**: [https://nodejs.org/en](https://nodejs.org/en)
- **Git**: [https://git-scm.com/downloads](https://git-scm.com/downloads)

Once they're downloaded, run both installers. For Node.js, you can just click Next all the way through. The default options are perfect for what we need. For the Git installer, do the same thing, just click Next, but keep an eye out for one specific screen.

> ⚠️ **Super Important Note**
> During the Git installation, make sure you choose the option that adds Git to your PATH. This is a huge time saver. It just means you can run git commands from any terminal on your computer.

### 2. Install WSL and Your Code Editor

This is the easy part. Just open the Microsoft Store app on your PC:

1. Search for **WSL** and hit install. It pretty much takes care of itself.
2. Next, grab your editor:
   - **Cursor**: [https://cursor.com](https://cursor.com)
   - **Visual Studio Code**: [https://code.visualstudio.com](https://code.visualstudio.com)

Just download the installer and run it like any other Windows app.

## 🚀 Getting Claude Code Running

Okay, time for the final step. Let's get into the command line and make the magic happen.

Go to your Start menu and open the **WSL terminal** you just installed. Once you have that open, we're going to run a few commands one by one. You can copy and paste these right in.

### 1. Install NVM (Node Version Manager)

First, we need a tool called NVM which helps us manage our Node.js versions. It's a lifesaver.

```bash
sudo apt-get install curl
```

Now run this next command to actually install NVM itself:

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

### 2. Activate NVM and Install Node

Now here's a fun little quirk. You have to close your WSL terminal and open a new one for it to see that NVM is installed. Or, if you want to take a shortcut, you can just run this command instead:

```bash
source ~/.bashrc
```

With NVM ready, let's use it to install Node.js:

```bash
nvm install node
```

Let's quickly double check that Node.js is installed correctly. Type this command:

```bash
which npm
```

You should see a path pop up that looks something like this. Your username and version numbers might be different, and that's totally fine:

```
/home/yourusername/.nvm/versions/node/v20.10.0/bin/npm
```

### 3. Install Claude Code

We are on the home stretch. Just two more commands to go.

This first one is a little weird, I won't lie. We're telling npm to behave like it's on a Linux system. It's a small trick that helps this specific tool work correctly, so just roll with it:

```bash
npm config set os linux
```

And here is the final command to install the tool:

```bash
npm install -g @anthropic-ai/claude-code
```

## ✅ And You're Done!

You should be all set to go. Happy coding! 🎉
