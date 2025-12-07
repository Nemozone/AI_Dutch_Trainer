# AI-Powered Dutch Tutor

An interactive web application that leverages generative AI to create personalized Dutch language practice exercises. Built with Django (Backend) and React (Frontend).

## Features

-   **Dynamic Exercise Generation**: Generates Multiple Choice, Fill-in-the-Blank, and Matching exercises based on any user-provided topic.
-   **Smart Validation**: Ensured quality by validating AI outputs against strict schemas (Pydantic) and regenerating invalid questions automatically.
-   **Real-time Status**: Displays verbose logs during generation so users see the backend process (generating, validating, retrying) in real-time.
-   **Robust Error Handling**:
    -   **Frontend**: Error Boundary captures crashes and specific component errors.
    -   **Backend**: Comprehensive logging system (`backend/debug.log`) captures frontend crash reports and backend exceptions.
-   **Modern UI**: Sleek, responsive interface built with Tailwind CSS and Framer Motion animations.

## Tech Stack

### Backend
-   **Framework**: Django 4.2 & Django REST Framework
-   **AI Integration**: OpenAI API (`gpt-4o-mini`)
-   **Data Validation**: Pydantic
-   **Logging**: Custom file logging & error reporting endpoint

### Frontend
-   **Framework**: React 19 (Vite)
-   **Styling**: Tailwind CSS 4
-   **State Management**: React Hooks & LocalStorage
-   **Networking**: Axios & Fetch API (for streaming)

## Prerequisites

-   Python 3.8+
-   Node.js 16+ & npm
-   OpenAI API Key

## Installation

### 1. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Run migrations:
```bash
python manage.py migrate
```

Start the server:
```bash
python manage.py runserver
```
The backend runs on `http://localhost:8000`.

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The frontend runs on `http://localhost:5173`.

## Usage

1.  Open the frontend in your browser.
2.  Enter your **OpenAI API Key** (stored locally in your browser).
3.  Enter a **Topic** (e.g., "Food", "Travel", "Grammar").
4.  Click **Start Practice**.
5.  Watch the generation logs as the session is built.
6.  Complete the exercises and get instant feedback!

## Troubleshooting

-   **Blank Screen / Crash**: If the application crashes, an "Something went wrong" screen will appear.
-   **Logs**: Check `backend/debug.log` for detailed error messages, including frontend stack traces reported via the API.
