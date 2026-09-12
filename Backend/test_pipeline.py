import requests
import os

BASE = "http://127.0.0.1:8000"

resume_path = os.path.join("uploads", "Vimalraj_V_Resume.pdf")

if os.path.exists(resume_path):
    print("Resume file found, testing analyze endpoint...")
    resp = requests.get(f"{BASE}/analyze-resume?filename=Vimalraj_V_Resume.pdf", timeout=60)
    data = resp.json()
    print("Status:", data.get("status"))
    print("AI Connected:", data.get("ai_connected"))
    print("AI Model:", data.get("ai_model"))
    print("ATS Score:", data.get("ats_score"))
    if data.get("analysis"):
        analysis = data["analysis"]
        print("\n--- STRENGTHS ---")
        for s in analysis.get("strengths", [])[:2]:
            print(" *", s)
        print("\n--- WEAKNESSES ---")
        for w in analysis.get("weaknesses", [])[:2]:
            print(" *", w)
        print("\n--- SKILLS FOUND ---")
        skills = analysis.get("skills_analysis", {})
        print("Technical:", skills.get("technical_skills", [])[:5])
else:
    print("No resume file found. Available:", os.listdir("uploads") if os.path.exists("uploads") else "folder missing")
