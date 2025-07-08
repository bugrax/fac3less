What You'll Need

First up, let's grab all the tools for our digital toolbelt. Here’s a quick list of what we're going to download and install.





Node.js



Git



WSL which is a super cool mini Linux that runs inside Windows.



Your favorite code editor, like Cursor or Visual Studio Code.



And of course, your amazing brain and typing fingers.



Let's Get Everything Installed

This part is mostly just clicking through installers, but I'll point out the important bits.

1. Download and Install Node.js and Git

Go ahead and download the Windows installers from their official sites.





Node.js is right here https://nodejs.org/en



You can grab Git here https://git-scm.com/downloads

Once they're downloaded, run both installers. ForNode.js, you can just click Next all the way through. The default options are perfect for what we need. For the Git installer, do the same thing, just click Next, but keep an eye out for one specific screen.



Super Important Note
During the Git installation, make sure you choose the option that adds Git to your PATH. This is a huge time saver. It just means you can run git commands from any terminal on your computer.



2. Install WSL and Your Code Editor

This is the easy part. Just open the Microsoft Store app on your PC.





Search for WSL and hit install. It pretty much takes care of itself.



Next, grab your editor. You can get Cursor at https://cursor.com or Visual Studio Code at https://code.visualstudio.com. Just download the installer and run it like any other Windows app.



Getting Claude Code Running

Okay, time for the final step. Let's get into the command line and make the magic happen.

Go to your Start menu and open the WSL terminal you just installed. Once you have that open, we're going to run a few commands one by one. You can copy and paste these right in.

1. Install NVM (Node Version Manager)

First, we need a tool called NVM which helps us manage our Node.js versions. It's a lifesaver.

sudo apt-get install curl

Now run this next command to actually install NVM itself.

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash



2. Activate NVM and Install Node

Now here's a fun little quirk. You have to close your WSL terminal and open a new one for it to see that NVM is installed. Or, if you want to take a shortcut, you can just run this command instead.

source ~/.bashrc

With NVM ready, let's use it to install Node.js.

nvm install node

Let's quickly double check that Node.js is installed correctly. Type this command.

which npm

You should see a path pop up that looks something like this. Your username and version numbers might be different, and that's totally fine.

/home/yourusername/.nvm/versions/node/v20.10.0/bin/npm



3. Install Claude Code

We are on the home stretch. Just two more commands to go.

This first one is a little weird, I won't lie. We're telling npm to behave like it's on a Linux system. It's a small trick that helps this specific tool work correctly, so just roll with it.

npm config set os linux

And here is the final command to install the tool.

npm install -g @anthropic-ai/claude-code

And you're done. You should be all set to go.
