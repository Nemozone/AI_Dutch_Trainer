# Dutch AI Practice App Walkthrough

I have built a Django-React application for practicing Dutch.

## Features Implemented
- **Backend**: Django with Django Rest Framework.
    - `practice` app with `generate` and `check` endpoints.
    - Mock AI service (ready to be replaced with real LLM).
- **Frontend**: React with Vite and Tailwind CSS.
    - `Home` page for topic selection and API key input.
    - `PracticeSession` page for interactive exercises.
    - `TopicInput`, `ExerciseCard`, `Feedback`, `ApiKeyInput` components.
    - **API Key Support**: Users can securely enter their OpenAI API key, which is stored locally and used for generating exercises.

## Verification
I verified the backend API using `curl`.

### Backend Test
Command:
```bash
curl -X POST http://localhost:8000/api/generate/ -H "Content-Type: application/json" -d '{"topic": "Present Perfect"}'
```

Result:
```json
[
    {
        "id": 1,
        "question": "Translate: 'I am learning Dutch' (Present Perfect)",
        "type": "translation",
        "answer": "Ik leer Nederlands"
    },
    ...
]
```

## How to Run
1. **Backend**:
   ```bash
   cd backend
   source venv/bin/activate
   python manage.py runserver
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.
