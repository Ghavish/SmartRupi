import sqlite3
import os

# Set base directory to the root of your project (ai_service/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_FOLDER = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(DB_FOLDER, "requests.db")

def get_db_connection():
    """Create a connection to the SQLite database with WAL mode."""
    if not os.path.exists(DB_FOLDER):
        os.makedirs(DB_FOLDER, exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    # WAL mode enables concurrent reads/writes
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.row_factory = sqlite3.Row
    return conn

def init_db():

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            request_id TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_request_id ON logs(request_id)")
    
    # New users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL
        )
    """)
    
    conn.commit()
    conn.close()

def log_message(request_id: str, message: str):
    """Insert a new log entry."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO logs (request_id, message) VALUES (?, ?)",
        (request_id, message)
    )
    conn.commit()
    conn.close()