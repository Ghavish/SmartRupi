from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tools.db import get_db_connection, init_db, init_user_db
from fastapi import FastAPI, HTTPException
import bcrypt
from tools.db import get_db_connection

init_db()

app = FastAPI()

# Enable CORS so your frontend can talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/get-log")
def get_log(request_id: str):
    conn = get_db_connection("requests.db")
    cursor = conn.cursor()
    
    # Fetch the most recent log entry for this request_id
    cursor.execute(
        "SELECT message FROM logs WHERE request_id = ? ORDER BY created_at DESC LIMIT 1",
        (request_id,)
    )
    row = cursor.fetchone()
    conn.close()
    
    if row:
        return {"message": row["message"]}
    return {"message": None}

@app.post("/api/login")
def login(user_data: dict):
    username = user_data.get("username")
    password = user_data.get("password")
    
    conn = get_db_connection("users.db")
    cursor = conn.cursor()
    
    # Fetch hashed password from users.db
    cursor.execute("SELECT password_hash FROM users WHERE username = ?", (username,))
    row = cursor.fetchone()

    if row:
        print(f"DEBUG: Found user {username}, hash: {row['password_hash']}")
        # Compare
        if bcrypt.checkpw(password.encode('utf-8'), row["password_hash"].encode('utf-8')):
            return {"status": "success"}
    
    print(f"DEBUG: Login failed for {username}")
    raise HTTPException(status_code=401, detail="Invalid username or password")
    
    conn.close()
    
    if row and bcrypt.checkpw(password.encode('utf-8'), row["password_hash"].encode('utf-8')):
        return {"status": "success", "message": "Login successful"}
    else:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)