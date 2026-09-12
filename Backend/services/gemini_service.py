import os
import json
import logging
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Ensure .env is loaded so GEMINI_API_KEY is available
load_dotenv()

logger = logging.getLogger(__name__)

# Try to initialize the API key from environment, but don't fail immediately
# so that the server can still start if the key is missing.
api_key = os.environ.get("GEMINI_API_KEY")
_client = genai.Client(api_key=api_key) if api_key else None


def analyze_resume_text(text: str) -> dict:
    """
    Analyzes the resume text using Google Gemini API.
    Returns a dictionary matching the specified JSON structure.
    """
    if not api_key:
        raise ValueError("GEMINI_API_KEY is not set in environment variables.")

    client = _client or genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

    prompt = f"""You are an expert resume reviewer and career coach.

Analyze the following resume carefully.

Return ONLY valid JSON using this structure:

{{
  "overall_score": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "skills": [],
  "technical_skills": [],
  "soft_skills": [],
  "education": [],
  "experience": [],
  "projects": [],
  "ats_score": 0,
  "ats_issues": [],
  "missing_skills": [],
  "recommended_improvements": [],
  "recommended_roles": [],
  "career_advice": []
}}

Scoring rules:
- overall_score: 0-100
- ats_score: 0-100

Be specific and evidence-based.
Do not invent experience, education, skills, certifications, or achievements that are not present in the resume.
If information is missing, say that it is missing.

Resume:
{text}
"""

    # Configurable list of Gemini models to attempt. Users can override via GEMINI_MODELS env var.
    # Updated to use the latest Gemini model version as older models may be deprecated.
    models_to_try = os.getenv("GEMINI_MODELS", "gemini-3.6-flash,gemini-3.5-pro").split(",")
    models_to_try = [m.strip() for m in models_to_try if m.strip()]
    last_error = None

    for model_name in models_to_try:
        try:
            try:
                response = client.models.generate_content(
                    model=model_name,
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        temperature=0.2,
                        max_output_tokens=4000,
                        response_mime_type="application/json",
                        http_options=types.HttpOptions(timeout=60000)
                    ),
                )
            except Exception as e:
                # Capture specific 404 errors indicating model not found and continue to next model
                if hasattr(e, "response") and getattr(e.response, "status_code", None) == 404:
                    logger.warning(f"Model {model_name} not found (404). Skipping to next model.")
                    last_error = e
                    continue
                else:
                    logger.error(f"Gemini API Error with model {model_name}: {e}")
                    last_error = e
                    continue

            raw_text = response.text.strip()

            # Clean up markdown code blocks if present
            if raw_text.startswith("```json"):
                raw_text = raw_text[7:]
            elif raw_text.startswith("```"):
                raw_text = raw_text[3:]

            if raw_text.endswith("```"):
                raw_text = raw_text[:-3]

            raw_text = raw_text.strip()

            # Extract JSON object securely
            start_idx = raw_text.find("{")
            end_idx = raw_text.rfind("}") + 1

            if start_idx != -1 and end_idx > start_idx:
                json_str = raw_text[start_idx:end_idx]
                result = json.loads(json_str)
                return result
            else:
                raise ValueError("No JSON object found in the response.")

        except json.JSONDecodeError as e:
            logger.error(f"JSON Parsing Error with model {model_name}: {e}\nRaw Response: {raw_text}")
            last_error = e
        except Exception as e:
            logger.error(f"Gemini API Error with model {model_name}: {e}")
            last_error = e

    # If all models failed
    # After all attempts, raise a clear error indicating no valid model succeeded.
    raise Exception(f"Gemini API analysis failed after trying models {models_to_try}. Last error: {str(last_error)}")
