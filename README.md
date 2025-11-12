# ⚙️ Backend: AI Writer API (Node.js + Express + MongoDB)

This directory contains the backend services and API endpoints for the Fullstack AI Writer application. It is built using **Node.js** with the **Express** framework and uses **MongoDB (Mongoose)** for persistence.

---

## ✨ Features

* **Authentication:** JWT-based user sign-up and log-in (passwords hashed with `bcrypt`).
* **Article CRUD:** Full Create, Read, Update, Delete functionality for articles.
* **AI Suggestions Endpoint (`/api/ai/suggest`):**
    * Calls **OpenAI's Chat Completions API** if `OPENAI_API_KEY` is provided.
    * Returns a **mock suggestion** suitable for local development if the API key is absent.
* **Data Persistence:** Uses MongoDB/Mongoose for storing user data, articles, and AI logs.
* **Logging:** AI requests and responses are logged to the `AILog` collection for audit and debugging.
* **Search:** Supports semantic-ish search on articles via MongoDB text indexes.

---

## 🛠️ Quickstart (Local Development)

Follow these steps to get the API server running locally.

### Prerequisites

1.  Node.js (LTS recommended)
2.  A running MongoDB instance (local or remote).

### Installation & Run

1.  **Navigate** to the backend directory:
    ```bash
    cd backend
    ```

2.  **Configuration:** Copy the example environment file and update your credentials:
    ```bash
    cp .env.example .env
    ```
    * Update `MONGODB_URI` (required).
    * Set a strong `JWT_SECRET` (required).
    * (Optional) Set your `OPENAI_API_KEY` if you wish to use real AI suggestions instead of the mock feature.

3.  **Install** dependencies:
    ```bash
    npm install
    ```

4.  **Start** the server in development mode:
    ```bash
    npm run dev
    ```
    The API should now be running (usually on `http://localhost:3000`).

---

## 📌 Available Endpoints

The API supports the following main routes:

| Category | Endpoint | Methods | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/signup` | `POST` | Register a new user. |
| **Auth** | `/api/auth/login` | `POST` | Log in and receive a JWT. |
| **Articles** | `/api/articles` | `GET` | Get all articles (or search). |
| **Articles** | `/api/articles` | `POST` | Create a new article. |
| **Articles** | `/api/articles/:id` | `PUT` / `DELETE` | Update or delete a specific article. |
| **AI** | `/api/ai/suggest` | `POST` | Request AI writing suggestion. |

---

## 🧠 Design Choices

* **Database:** MongoDB + Mongoose was chosen for rapid schema development and native text index support for search.
* **AI Abstraction:** The `/api/ai/suggest` endpoint intelligently switches between calling the external OpenAI API and returning a mocked response, making it environment-agnostic.
* **Security (Basic):** JWT for session management and `bcrypt` for password hashing are implemented. (Note: Production hardening like rate-limiting is omitted for brevity).