try:
    session.execute(text('SELECT 1'))
    print("✅ Connected to the MySQL database successfully!")
except Exception as e:
    print("❌ Failed to connect to the database.")
    print("Error:", e)