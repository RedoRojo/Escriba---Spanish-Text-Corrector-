# Corrector de Español

A focused web tool that analyzes Spanish articles and essays, detects errors (spelling, grammar, punctuation, semantics, style), and returns a detailed report per mistake. Built as a portfolio project.

## Tech Stack

- **Backend:** Python + FastAPI
- **Frontend:** HTML + Tailwind CSS (CDN) + Vanilla JS
- **LLM:** Gemini 2.5 Flash (Google Gen AI SDK)
- **Deploy:** Railway.app

## Features

- Detects 5 error types: ortografía, gramática, puntuación, semántica, estilo
- Color-coded error cards with original text, correction, and explanation
- Summary bar with error count by type
- Full corrected text with copy-to-clipboard
- Rate-limited API (10 requests/min per IP)

## Setup

```bash
# Clone and enter the directory
git clone <repo-url> && cd corrector-espanol

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set your Gemini API key
echo "GEMINI_API_KEY=your_key_here" > .env

# Run the server
uvicorn backend.main:app --reload
```

Open http://localhost:8000 in your browser.

## API

### `POST /analyze`

```json
{
  "text": "Texto en español para analizar (20-5000 caracteres)"
}
```

### `GET /health`

Returns `{ "status": "ok" }`.

## Live Demo

[Add Railway URL here after deployment]
