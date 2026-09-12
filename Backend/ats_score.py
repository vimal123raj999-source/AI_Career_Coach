import re
from typing import Tuple, Dict

# Simple keyword sets for scoring sections
SECTION_KEYWORDS = {
    "Contact": ["email", "phone", "address", "linkedin", "github"],
    "Education": ["bachelor", "master", "phd", "university", "college", "institute"],
    "Experience": ["experience", "project", "worked", "intern", "developer", "engineer", "responsibilities"],
    "Skills": ["skill", "proficient", "experienced", "knowledge", "technology", "python", "java", "c++", "react", "node", "aws", "docker"],
    "Certifications": ["certification", "certificate", "course"],
    "Projects": ["project", "implementation", "built", "developed", "designed"]
}

def calculate_ats_score(text: str) -> Tuple[int, Dict[str, int]]:
    """Calculate a simple ATS score based on presence of section keywords.

    Returns a tuple of (overall_score, per_section_scores). The overall score is a
    percentage (0‑100) representing the proportion of sections that contain at
    least one relevant keyword.
    """
    lowered = text.lower()
    per_section_scores: Dict[str, int] = {}
    hits = 0
    total_sections = len(SECTION_KEYWORDS)
    for section, keywords in SECTION_KEYWORDS.items():
        count = sum(1 for kw in keywords if kw in lowered)
        score = 100 if count > 0 else 0
        per_section_scores[section] = score
        if score == 100:
            hits += 1
    overall_score = int((hits / total_sections) * 100)
    return overall_score, per_section_scores

def validate_resume_document(text: str) -> Tuple[bool, str]:
    """Validate that the resume contains required sections.

    Checks for the presence of contact information, education, experience and
    skills. Returns (True, "") if valid, otherwise (False, reason).
    """
    required_sections = ["Contact", "Education", "Experience", "Skills"]
    missing = []
    lowered = text.lower()
    for sec in required_sections:
        if not any(kw in lowered for kw in SECTION_KEYWORDS.get(sec, [])):
            missing.append(sec)
    if missing:
        reason = f"Missing required sections: {', '.join(missing)}"
        return False, reason
    return True, ""