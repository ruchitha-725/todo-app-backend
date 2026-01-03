
# TodoApp-Backend

- **Todo-app-backend** is a app built for creating and maintaining APIs for todo list tasks application.  

- It is a simple RESTful API for tracking and managing todo tasks. This app was built using Node.js and Express.js with TypeScript.

- Firebase Integration for todo-app which introduces Firebase as a backend service for storing and managing todo list tasks. 

## Table of Contents 📚

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Setup & Run](#setup--run)
- [How to Use](#how-to-use)
- [Code Highlights](#code-highlights)
- [Clone the Repo](#clone-the-repo)
- [Contribution](#contribution)
- [Contact](#contact)
- [Troubleshooting](#troubleshooting)
- [License](#license)


## Tech Stack 🛠️

- **[Express.js](https://expressjs.com)**: JavaScript framework application
- **[TypeScript](https://www.typescriptlang.org/)**: Superset of JavaScript that adds static typing
- **[Node.js](https://nodejs.org/)**: JavaScript runtime for backend
- **[Firebase](https://firebase.google.com/docs)**: Firebase service Integration for storing data.

## Features 🔐

### Feature:Add-task
- Implemented add task functionality with required fileds.

### Feature:View-task
- Implemented view task functionality with required fileds.

### Feature:Edit-task
- Implemented Edit task functionality with required fileds.

## Setup & Run 🛠

1. **Clone the repository**:

    ```bash
    git clone https://github.com/ruchitha-725/todo-app-Backend.git
    ```

2. **Switch to current directory**:
      
        cd todo-app-backend

3. **Install dependencies**:

    ```bash
    npm install
    ```
4. **Run the Tests**:
    ```bash
    npm test -- --coverage 
    ```
5. **Build the application**:

    ```bash
    npm run build
    ```

6. **Run the application**:

    ```bash
    npm start

## 🛠 Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).

2. Go to **Project Settings → General → Your Apps → Web App** and copy the Firebase config.

3. Create a .json file or .env in your project root:
   ```bash
   FIREBASE_API_KEY=your_api_key
   FIREBASE_AUTH_DOMAIN=your_auth_domain
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_STORAGE_BUCKET=your_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   FIREBASE_APP_ID=your_app_id   ```

## How to Use ⚡

- Start the app using `npm start` and open it in your browser ( `http://localhost:PORT`).

- Once the application is running, the user can copy the port number in a web browser and watch the output.


## Code Highlights 🚀

- Every route path and controllers are handled correctly.
- Implemented middlewares for checking whether the APIs are working correctly or not.

## Clone the Repo 📦

To clone the repository, run:

```bash
git clone https://github.com/ruchitha-725/todo-app-backend.git
```
## Contribution 🤝

- Feel free to fork, raise issues or submit pull requests to improve the project.


## Contact 📫

- For questions, feedback or collaboration, contact me via:

-      GitHub: @ruchitha-725

-      Email: ruchitha.bondala@everest.engineering

## Troubleshooting 🛠️

- Ensure that you have run npm install to install all the necessary dependencies.

- server not starting :

          npm install

## License 🧾

MIT License © [Ruchitha]
