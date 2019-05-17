# Welcome to The Frontend @ DHSI 2019

For this week, we will be learning about advanced JavaScript (specifically the [React](https://reactjs.org) framework) and CSS (using [SASS](https://sass-lang.com/) and [Emotion.js](https://emotion.sh/docs/introduction)) in order to better understand how to make data-driven, responsive, and feature-rich applications using a modern software ecosystem.

## Getting Started

### Installing Software

1. Install [Visual Studio Code](https://code.visualstudio.com/)
1. Install [Node.js](https://nodejs.org/en/download/)
1. Open Visual Studio Code
	1. In the menu, select `View -> Extensions`
	1. In the sidebar that opens, search for "eslint" and install "ESLint" (should be the first result)

### Downloading / Configuring Our Project Template

We will be using [Create React App](https://facebook.github.io/create-react-app/) to bootstrap our projects in class. Given that the wifi at DHSI can sometimes be spotty, you have two options for how to proceed. One option asks you to install some software yourself, which involves some light command line usage. The other asks you to download and unzip a binary file, hoping that the software I set up will work on your operating system (I tested this on macOS Mojave and Windows 10). Given that I have no way to test if pre-compiled software will run on your computer, option 2 *should* work but there may be problems.

#### Option 1: Let's Use the Command Line!

You can [download the project as a Zip file here](https://github.com/oncomouse/dhsi2019-react/archive/master.zip) or you can clone `https://github.com/oncomouse/dhsi2019-react` using git. 

If you downloaded the zip, unzip ([Windows instructions](https://support.microsoft.com/en-us/help/4028088/windows-zip-and-unzip-files); [macOS Instructions](https://www.lifewire.com/how-to-zip-and-unzip-files-and-folders-on-a-mac-2260188)) the file in a directory you'll remember (the convention is to store git-driven projects in `/Projects`). 

If you cloned the project off of GitHub, move the folder to a directory you'll remember (the convention is to store git-driven projects in `/Projects`).

Now, open Visual Studio Code and choose `File -> Open` from the menu. Navigate to the directory where you stored the project and click on the folder for the project. Click on "Open".

You should see our project.

In the menu, choose `Terminal -> New Terminal`. If you are on Windows, it may announce that you can configure your terminal, but you can ignore that for the purposes of our class.

A terminal window should open at the bottom of your screen. In that window, type `npm install` and press <kbd>Enter</kbd>. A bunch of information will scroll up on your screen, including one or more ASCII progress bars. It may also flash an error that also says you can ignore it, which you can. If you see any other errors, something may have gone wrong; try Googling the error or email me about it.

In the terminal, type `npm run start` to see if your install worked. It should open a web browser and show you a basic React app. If everything worked, type <kbd>Ctrl+C</kbd> in the terminal window back in Visual Studio Code, type `exit` and press <kbd>Enter</kbd>. You may now close Visual Studio Code. You're done!

#### Option 2: Download a file!

Please download the appropriate file for your computer:

* [macOS](https://github.com/oncomouse/dhsi2019-react/raw/zips/dhsi2019-react-app-macos.zip)
* [Windows](https://github.com/oncomouse/dhsi2019-react/raw/zips/dhsi2019-react-app-win.zip)

Unzip ([Windows instructions](https://support.microsoft.com/en-us/help/4028088/windows-zip-and-unzip-files); [macOS Instructions](https://www.lifewire.com/how-to-zip-and-unzip-files-and-folders-on-a-mac-2260188)) the above archive and place the resulting folder somewhere where you can remember it (by convention, git-driven projects reside in the `/Projects` directory).

You can now open your project directory in VS Code if you want, but you should have everything you need for class.

**Optional**: If you want to test what you've done, open Visual Studio Code. In the menu, choose `Terminal -> New Terminal`. If you are on Windows, it may announce that you can configure your terminal, but you can ignore that for the purposes of our class. In the terminal, type `npm run start` to see if your install worked. It should open a web browser and show you a basic React app. If everything worked, type <kbd>Ctrl+C</kbd> in the terminal window back in Visual Studio Code, type `exit` and press <kbd>Enter</kbd>. You may now close Visual Studio Code. You're done!

If the optional step doesn't work, delete the directory you created and try Option 1, as that will likely work.

Alternately, please email me with information about what operating system you are using and any problems you had. I will be happy to sort out what's happening.

## See you in Victoria!
