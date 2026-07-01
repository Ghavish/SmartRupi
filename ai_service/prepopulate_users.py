import bcrypt
import sqlite3
import os

def setup_users():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(script_dir, 'data', 'users.db')
    
    # Ensure the directory exists
    os.makedirs(os.path.dirname(db_path), exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Create table if it doesn't exist
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)
    conn.commit()
    
    # Define your demo users
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