This is a new [**React Native**](https://reactnative.dev) project, bootstrapped using [`@react-native-community/cli`](https://github.com/react-native-community/cli).

# Getting Started

> **Note**: Make sure you have completed the [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) instructions till "Creating a new application" step, before proceeding.

## Step 1: Start the Metro Server

First, you will need to start **Metro**, the JavaScript _bundler_ that ships _with_ React Native.

To start Metro, run the following command from the _root_ of your React Native project:

```bash
# using npm
npm start

# OR using Yarn
yarn start
```

## Step 2: Start your Application

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```

If everything is set up _correctly_, you should see your new app running in your _Android Emulator_ or _iOS Simulator_ shortly provided you have set up your emulator/simulator correctly.

This is one way to run your app — you can also run it directly from within Android Studio and Xcode respectively.

## Step 3: Modifying your App

Now that you have successfully run the app, let's modify it.

1. Open `App.tsx` in your text editor of choice and edit some lines.
2. For **Android**: Press the <kbd>R</kbd> key twice or select **"Reload"** from the **Developer Menu** (<kbd>Ctrl</kbd> + <kbd>M</kbd> (on Window and Linux) or <kbd>Cmd ⌘</kbd> + <kbd>M</kbd> (on macOS)) to see your changes!

   For **iOS**: Hit <kbd>Cmd ⌘</kbd> + <kbd>R</kbd> in your iOS Simulator to reload the app and see your changes!

## Congratulations! :tada:

You've successfully run and modified your React Native App. :partying_face:

### Now what?

- If you want to add this new React Native code to an existing application, check out the [Integration guide](https://reactnative.dev/docs/integration-with-existing-apps).
- If you're curious to learn more about React Native, check out the [Introduction to React Native](https://reactnative.dev/docs/getting-started).

# Troubleshooting

If you can't get this to work, see the [Troubleshooting](https://reactnative.dev/docs/troubleshooting) page.

# Learn More

To learn more about React Native, take a look at the following resources:

- [React Native Website](https://reactnative.dev) - learn more about React Native.
- [Getting Started](https://reactnative.dev/docs/environment-setup) - an **overview** of React Native and how setup your environment.
- [Learn the Basics](https://reactnative.dev/docs/getting-started) - a **guided tour** of the React Native **basics**.
- [Blog](https://reactnative.dev/blog) - read the latest official React Native **Blog** posts.
- [`@facebook/react-native`](https://github.com/facebook/react-native) - the Open Source; GitHub **repository** for React Native.

#### install

Tried this but no dice and it really messed up my environment.

npm install @react-navigation/native
npm install @react-navigation/native-stack
npx expo install react-native-screens react-native-safe-area-context

then later this and more
npm install @builderx/utils@0.1.6 lodash react-navigation@4.0.10 react-native-svg react-native-maps --legacy-peer-deps
npm install @builderx/utils@0.1.6 lodash react-navigation@4.0.10 react-native-svg react-native-maps --force
npm install --global yarn
yarn add @builderx/utils@0.1.6 lodash react-navigation@4.0.10 react-native-svg react-native-maps
npm install -g react-native-cli

One thing I have learned is that these projects are

1. full of compatability issues. Warning are like greetings to a passerby
2. When Your App.tsx ore even underlying files like screens are in a bad state, you will get false errors and not be able to install packages.
3. xcodebuild clean sometimes needs extra permissions

Tried this but no dice!

unbork instuctions:!
npx react-native run-ios
npm install
If you encounter issues with npm, you might want to try using yarn:

bash
Copy code
yarn install 3. Clean the Project
Remove node_modules and package-lock.json (or yarn.lock) to ensure a clean state:

bash
Copy code
rm -rf node_modules package-lock.json yarn.lock
npm cache clean --force
npm install 4. Verify React Native Version
Check the React Native version specified in your package.json:

bash
Copy code
cat package.json | grep react-native
Make sure it points to a valid version. If necessary, re-install React Native:

bash
Copy code
npm install react-native@latest 5. Rebuild the iOS Project
Navigate to the ios directory:

bash
Copy code
cd ios
Install CocoaPods dependencies:

bash
Copy code
pod install
Go back to the root directory:

bash
Copy code
cd ..
Try running your project again:

bash
Copy code
npx react-native run-ios
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash

npx react-native run-ios

### Upgraded dependancies and your lockfile is now ahead, behind and just plane borked?

cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
xcodebuild clean
npx react-native run-ios

### Install and upgrade Ruby

Sometimes Ruby needs you to install a base version apparently then u
brew install rbenv
rbenv init

####

Upgrade
source ~/.zshrc
rbenv install 2.7.0
rbenv global 2.7.0

#### Unable to boot device in current state: booted pop up

Yeah.. the simulator started before it as called to start again.. no worries.

cd ios
xcodebuild clean
cd ..
npm run clean
npm install
cd ios
pod install
cd ..

> lets_play@0.0.1 ios
> react-native run-ios

info A dev server is already running for this project on port 8082.
info Found Xcode workspace "lets_play.xcworkspace"
info Found booted iPhone SE (3rd generation)
info Building (using "xcodebuild -workspace lets_p

#### if it starts running on an existin server.. e.g. "dev server already running on port 8082"

You are going to have a bad time... find the terminal keepng it alive and kill it
as well as close any orphaned simulators...like you should have to press i

back in the saddle
npm install @react-navigation/native @react-navigation/native-stack

##### Okay then also sometimes you can leave 1 build dev server up but if you have an error when tou run the app

cd ios
pod install
cd ..
npx react-native run-ios
npm install @react-navigation/native @react-navigation/stack
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view

npm install react-native-linear-gradient
npm install @react-navigation/native @react-navigation/stack
npm install react-native-gesture-handler react-native-reanimated react-native-screens react-native-safe-area-context @react-native-community/masked-view
npm install react-native-linear-gradient

## Known issues

(node:72916) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)

## Troubleshooting

Rebuild
pod repo update
pod install
react-native run-ios
or
cd ios
pod install
cd ..
npx react-native run-ios

### SCOPE

NSAllowsArbitraryLoads for scope sticking with http however We would need to change that to "avoid app rejection" when modifying info.plist for IOS. It seems the solution here is to simply move to https for the server's API

# if changing manifest

make simple-clean-and-deploy is not as destructive and works for most dev
xcodebuild clean
cd ios
pod install
cd ..
npx react-native run-ios

npm install react-native-fs
npm install react-native-dns
yarn add react-native-ping
**After minimal changes, to run do the following from the midi-file-server root folder:**

```bash
       cd ios
       pod install
       cd ..
       npx react-native run-ios
```
