import mysql.connector

conn = mysql.connector.connect(
    host="localhost",
    user="root",
    password="03062008",
    database="career_coach_db"
)

print("Database Connected Successfully!")