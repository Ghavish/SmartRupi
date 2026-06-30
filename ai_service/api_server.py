from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from tools.db import get_db_connection, init_db

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