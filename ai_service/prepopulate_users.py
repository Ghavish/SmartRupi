import bcrypt
import sqlite3
import os

def setup_users():
    
    # 1. Get the directory where THIS script is located
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 2. Build the path: move up one level (if needed) and into data/
    # If requests.db is inside 'ai_service/data/', use this:
    db_path = os.path.join(script_dir, 'data', 'requests.db')
    
    print(f"DEBUG: Attempting to connect to: {db_path}")
    conn = sqlite3.connect(db_path)

    cursor = conn.cursor()
    
    # List of users to add
    users_to_add = [
        ("raj", "password123"),
        ("sira", "securepassword123")
    ]
    
    for username, password in users_to_add:
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        try:
            cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", 
                           (username, hashed.decode('utf-8')))
            print(f"✅ Added user: {username}")
        except sqlite3.IntegrityError:
            print(f"⚠️ User {username} already exists.")
            
    conn.commit()
    conn.close()

if __name__ == "__main__":
    setup_users()