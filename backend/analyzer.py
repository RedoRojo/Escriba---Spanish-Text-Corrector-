import os
from pathlib import Path

from dotenv import load_dotenv
from google import genai
from google.genai import types

from .schemas import AnalyzeRequest, AnalyzeResponse

load_dotenv()

PROMPT_PATH = Path(__file__).resolve().parent.parent / "prompts" / "system_prompt.txt"

with open(PROMPT_PATH) as f:
    SYSTEM_PROMPT = f.read()


def analyze_text(request: AnalyzeRequest) -> AnalyzeResponse:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GEMINI_API_KEY environment variable is not set")

    client = genai.Client(api_key=api_key)

    response = client.models.generate_content(
        model="gemini-3.1-flash-lite",
        contents=request.text,
        config=types.GenerateContentConfig(
            system_instruction=SYSTEM_PROMPT,
            response_mime_type="application/json",
        ),
    )

    raw = response.text
    if not raw:
        raise ValueError(
            "Gemini returned an empty response. "
            "The model may have been blocked."
        )

    import json
    try:
        data = json.loads(raw)
        result = AnalyzeResponse(**data)
        result.summary.total = sum(result.summary.by_type.values())
        return result
    except (json.JSONDecodeError, Exception) as e:
        raise ValueError(
            f"Failed to parse Gemini response. Raw text: {raw[:500]}"
        ) from e
