# React Native Project

This is a React Native project that allows you to build cross-platform mobile applications using JavaScript and React.

## Getting Started

### Prerequisites
Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) or [Yarn](https://yarnpkg.com/)
- [React Native CLI](https://reactnative.dev/docs/environment-setup)
- Android Studio (for Android development)
- Xcode (for iOS development)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/react-native-project.git
   cd react-native-project
   ```

2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```

### Running the Application

#### For Android:
```sh
npx react-native run-android
```

#### For iOS:
```sh
npx react-native run-ios
```
*(Ensure that an iOS simulator is running or a physical device is connected.)*

### Folder Structure
```
react-native-project/
│-- .expo/              # Expo configuration files
│-- assets/             # Static assets (images, fonts, etc.)
│-- Components/         # Reusable React components
│-- Context/            # Context API providers
│-- Navigation/         # App navigation setup
│-- Utils/              # Utility/helper functions
│-- node_modules/       # Dependencies
│-- .env                # Environment variables
│-- .gitignore          # Git ignore rules
│-- App.js              # Main entry file
│-- app.json            # App configuration
│-- index.js            # Entry point
│-- package-lock.json   # Dependency lock file
│-- package.json        # Project metadata
│-- README.md           # Documentation
```

### Useful Commands
- **Start Metro Bundler:**
  ```sh
  npx react-native start
  ```
- **Run Android App:**
  ```sh
  npx react-native run-android
  ```
- **Run iOS App:**
  ```sh
  npx react-native run-ios
  ```
- **Run ESLint Check:**
  ```sh
  npm run lint
  ```
- **Run Tests:**
  ```sh
  npm test
  ```

### Troubleshooting
If you face issues while running the project, try:
- **Clearing Cache:**
  ```sh
  npx react-native start --reset-cache
  ```
- **Reinstalling Dependencies:**
  ```sh
  rm -rf node_modules && npm install
  ```

## License
This project is licensed under the MIT License.

