# DevChat: Real-time Messaging Application

DevChat is a modern, full-stack real-time messaging application designed for seamless and secure communication. Built with a robust Node.js backend using Express and Socket.io, and a dynamic Next.js frontend, DevChat offers instant private messaging, user authentication, chat history, and online presence indicators. The application is containerized with Docker Compose for easy setup and deployment.

## ✨ Features

**Real-time Communication:**
*   **Instant Private Messaging:** Leverage Socket.io for lightning-fast, bidirectional communication between users.
*   **Online Presence:** See which of your contacts are currently online with real-time status updates.
*   **Chat History:** Persist and retrieve chat conversations between users from a dedicated SQLite database.

**User Management & Security:**
*   **Secure Authentication:** User registration and login powered by JWT (JSON Web Tokens) for secure API access and `bcryptjs` for robust password hashing.
*   **User Validation:** Strict validation rules for username (alphanumeric, no spaces, min 4 chars, at least one number) and email during registration.
*   **User Search:** Easily find other users by username or email for initiating new chats.
*   **Protected Routes:** API endpoints secured with JWT middleware to ensure authorized access.

**Modern Frontend Experience:**
*   **Responsive Design:** A sleek, intuitive user interface built with Next.js and Tailwind CSS, adapting beautifully across devices.
*   **Dynamic UI Components:** Dedicated components for user lists, search results, and settings.
*   **Animated Preloader:** A minimalist preloader with circular progress and subtle animations for a polished loading experience.
*   **Interactive Landing Page:** An engaging landing page showcasing DevChat's features, statistics, and technologies, complete with animated gradients and floating elements.
*   **Vercel Integrations:** Built-in Vercel Speed Insights and Analytics for performance monitoring and usage tracking.

**Developer Friendly:**
*   **TypeScript:** Full type-safety across the frontend for improved code quality and maintainability.
*   **Dockerized:** Ready-to-deploy with `docker-compose` for isolated development and production environments.
*   **Separate Databases:** Utilizes two SQLite databases (`users.db` and `chats.db`) for clear data separation.

## 🚀 Tech Stack

**Backend:**
*   **Framework:** Node.js, Express.js
*   **Real-time:** Socket.io
*   **Database:** SQLite3 (for `users` and `chats` data)
*   **Authentication:** JWT, `bcryptjs`
*   **Validation:** `express-validator`
*   **Environment:** `dotenv`
*   **Utilities:** `cors`

**Frontend:**
*   **Framework:** Next.js
*   **UI/Styling:** React, Tailwind CSS, `framer-motion` (for animations)
*   **Real-time:** `socket.io-client`
*   **Authentication:** `jwt-decode`, `axios`
*   **Icons:** `react-icons`
*   **Visuals:** `three` (for 3D effects on landing page), `@uiw/react-textarea-code-editor`, `react-syntax-highlighter` (for code display)
*   **Performance:** `@vercel/analytics`, `@vercel/speed-insights`
*   **Language:** TypeScript

**Deployment:**
*   **Containerization:** Docker, Docker Compose

## ⚙️ Getting Started

Follow these instructions to set up and run DevChat locally or with Docker.

### Prerequisites

*   Node.js (v18 or later recommended)
*   npm or Yarn
*   Docker and Docker Compose (for containerized deployment)

### Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd devchat-app
    ```

2.  **Backend Setup:**
    ```bash
    cd backend
    npm install
    # Create a .env file with your JWT_SECRET (e.g., JWT_SECRET=your_super_secret_key)
    cp .env.example .env # If you have an example file
    npm start
    ```
    The backend server will run on `http://localhost:5001`. It will initialize `users.db` and `chats.db` in `/tmp` on startup.

3.  **Frontend Setup:**
    ```bash
    cd frontend
    npm install
    # Create a .env.local file with your backend API URL (e.g., NEXT_PUBLIC_API_URL=http://localhost:5001)
    cp .env.local.example .env.local # If you have an example file
    npm run dev
    ```
    The frontend application will run on `http://localhost:3000`.

### Running with Docker Compose

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd devchat-app
    ```

2.  **Create `.env` files:**
    *   In `backend/` directory, create a `.env` file:
        ```
        JWT_SECRET=your_super_secret_key_here
        PORT=5001
        ```
    *   In `frontend/` directory, create a `.env.local` file:
        ```
        NEXT_PUBLIC_API_URL=http://backend:5001
        ```
        Note: When running with Docker Compose, `backend` is the service name, so `http://backend:5001` is used for inter-service communication.

3.  **Build and run the services:**
    ```bash
    docker-compose up --build
    ```
    This will build the Docker images for both frontend and backend and start the services.
    *   Frontend: `http://localhost:3000`
    *   Backend: `http://localhost:5001`

## 🗄️ API Endpoints

### Authentication (`/auth`)
*   `POST /auth/register`: Register a new user.
    *   `body`: `{ username, email, password }`
    *   `response`: `{ token: "jwt_token_string" }`
*   `POST /auth/login`: Log in an existing user.
    *   `body`: `{ email, password }`
    *   `response`: `{ token: "jwt_token_string", username: "user_username" }`

### Users (`/users`)
*   `GET /users` (Protected): Get a list of users with whom the current user has chatted.
    *   `headers`: `Authorization: Bearer <token>`
    *   `response`: `{ users: [{ id, username, email, isOnline }] }`

### Chat (`/chat`)
*   `GET /chat/history/:user1/:user2`: Get chat history between two users.
    *   `params`: `user1` (ID of current user), `user2` (ID of other user)
    *   `response`: `{ messages: [{ sender_id, receiver_id, message, timestamp }] }`

### Search (`/api/users`)
*   `GET /api/users/search?q=<query>`: Search for users by username or email.
    *   `query_param`: `q` (search term)
    *   `response`: `[{ id, username, email }]`

### Protected Test Route (`/protected`)
*   `GET /protected` (Protected): A test route to verify token authorization.
    *   `headers`: `Authorization: Bearer <token>`
    *   `response`: `{ message: "You are authorized", user: { id, username, email } }`

## 🗺️ Frontend Routes

*   `/`: Main chat interface (requires authentication).
*   `/landingPage`: Public marketing page for DevChat.
*   `/login`: User login page.
*   `/register`: User registration page.

## 🤝 Contributing

Contributions are welcome! If you have any suggestions, bug reports, or feature requests, please open an issue or submit a pull request.

## 📄 License

This project is licensed under the ISC License.

