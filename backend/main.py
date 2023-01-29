import uvicorn
 
from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from routers import users

app = FastAPI()
app.include_router(users.router)

origins = [
    "http://localhost:3001"
]

allow_all = ['*']
app.add_middleware(
   CORSMiddleware,
   allow_origins=allow_all,
   allow_credentials=True,
   allow_methods=allow_all,
   allow_headers=allow_all
)


# root endpoint
@app.get("/")
async def root():
    return "Hello, welcome to Parsyll!"

if __name__ == "__main__":
   uvicorn.run("main:app")




