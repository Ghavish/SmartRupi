from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tools.db import get_db_connection, init_db
import bcrypt
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

init_db()

app = FastAPI()

# Enable CORS so your frontend can talk to the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserAuth(BaseModel):
    username: str
    password: str

@app.post("/api/register")
def register_user(user: UserAuth):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Hash the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    
    try:
        cursor.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", 
                       (user.username, hashed_password.decode('utf-8')))
        conn.commit()
        return {"message": "User registered successfully"}
    except:
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        conn.close()

@app.post("/api/login")
def login_user(user: UserAuth):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM users WHERE username = ?", (user.username,))
    row = cursor.fetchone()
    conn.close()
    
    if row and bcrypt.checkpw(user.password.encode('utf-8'), row['password_hash'].encode('utf-8')):
        return {"status": "success"}
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
@app.get("/api/get-log")
def get_log(request_id: str):
    conn = get_db_connection()
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)