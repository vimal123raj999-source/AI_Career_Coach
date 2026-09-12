import google.generativeai as genai

genai.configure(api_key="AIzaSyApY8o1CpVcmrlnyfcjexbR-7IcbnZB_3Y")
m = genai.GenerativeModel("gemini-2.5-flash")
resp = m.generate_content(
    "Return only this JSON without any markdown: {\"test\": \"success\", \"status\": \"AI connected\"}",
    generation_config={"temperature": 0.1, "max_output_tokens": 100}
)
print("SUCCESS:", resp.text)
